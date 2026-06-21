#!/usr/bin/env python3
"""Extract Risk of Rain 2 end-of-run item stacks from a screenshot.

The extractor is intentionally local-only. It uses fixed proportional crops for
the stable end screen layout, OCR for text overlays, and either CLIP embeddings
or OpenCV template matching against a local icon reference directory.
"""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

import cv2
import numpy as np

try:
    import pytesseract
except ImportError:  # pragma: no cover - handled at runtime
    pytesseract = None


ROOT = Path(__file__).resolve().parent
FULL_MANIFEST = ROOT / "RiskOfRain2_ItemIcons" / "manifest.json"
BASE_MANIFEST = ROOT / "RiskOfRain2_BaseGame_ItemIcons" / "manifest.json"
DEFAULT_MANIFEST = FULL_MANIFEST if FULL_MANIFEST.exists() else BASE_MANIFEST

# Calibrated from 16:9 Risk of Rain 2 end screen captures. These are deliberately
# slightly generous so the crop still works with minor UI scaling differences.
DEFAULT_GRID_REL = (0.600, 0.322, 0.937, 0.565)  # x1, y1, x2, y2
DEFAULT_CLASS_REL = (0.635, 0.225, 0.805, 0.270)


@dataclass(frozen=True)
class ReferenceIcon:
    id: str
    name: str
    path: Path
    image: np.ndarray
    features: np.ndarray | None = None


@dataclass(frozen=True)
class DetectedItem:
    id: str
    count: int
    confidence: float
    decision: str = "accepted"
    clip_id: str | None = None
    clip_score: float | None = None
    clip_margin: float | None = None
    template_id: str | None = None
    template_score: float | None = None
    template_margin: float | None = None


@dataclass(frozen=True)
class MatchCalibration:
    output_min_confidence: float = 0.73
    strong_template_score: float = 0.90
    strong_template_margin: float = 0.04
    clear_template_score: float = 0.82
    clear_template_margin: float = 0.20
    reject_max_confidence: float = 0.69
    reject_confidence_penalty: float = 0.25


def snake_case(value: str) -> str:
    """Normalize either a display name or an internal id to snake_case."""
    value = re.sub(r"(?<=[a-z0-9])(?=[A-Z])", "_", value)
    value = re.sub(r"[^A-Za-z0-9]+", "_", value)
    return value.strip("_").lower()


def load_image(path: str | Path, max_width: int = 2048) -> np.ndarray:
    image = cv2.imread(str(path), cv2.IMREAD_COLOR)
    if image is None:
        raise FileNotFoundError(f"Could not load image: {path}")

    height, width = image.shape[:2]
    if width > max_width:
        scale = max_width / float(width)
        image = cv2.resize(image, (max_width, int(height * scale)), interpolation=cv2.INTER_AREA)
    return image


def relative_crop(image: np.ndarray, rel_box: tuple[float, float, float, float]) -> np.ndarray:
    height, width = image.shape[:2]
    x1, y1, x2, y2 = rel_box
    x1i = max(0, min(width - 1, int(round(x1 * width))))
    y1i = max(0, min(height - 1, int(round(y1 * height))))
    x2i = max(x1i + 1, min(width, int(round(x2 * width))))
    y2i = max(y1i + 1, min(height, int(round(y2 * height))))
    return image[y1i:y2i, x1i:x2i].copy()


def crop_item_grid(
    image: np.ndarray,
    rel_box: tuple[float, float, float, float] = DEFAULT_GRID_REL,
) -> np.ndarray:
    """Crop the "Items Collected" icon grid using relative screen coordinates."""
    return relative_crop(image, rel_box)


def split_grid(
    grid: np.ndarray,
    rows: int = 4,
    cols: int = 10,
    pad_ratio: float = 0.02,
    min_content: float = 0.025,
) -> list[np.ndarray]:
    """Split a cropped grid into fixed cells and skip cells that are effectively empty."""
    height, width = grid.shape[:2]
    cell_h = height / rows
    cell_w = width / cols
    cells: list[np.ndarray] = []

    for row in range(rows):
        for col in range(cols):
            x1 = int(round(col * cell_w))
            y1 = int(round(row * cell_h))
            x2 = int(round((col + 1) * cell_w))
            y2 = int(round((row + 1) * cell_h))

            pad_x = int(round((x2 - x1) * pad_ratio))
            pad_y = int(round((y2 - y1) * pad_ratio))
            cell = grid[y1 + pad_y : y2 - pad_y, x1 + pad_x : x2 - pad_x].copy()
            if has_icon_content(cell, min_content=min_content):
                cells.append(cell)

    return cells


def has_icon_content(cell: np.ndarray, min_content: float = 0.025) -> bool:
    gray = cv2.cvtColor(cell, cv2.COLOR_BGR2GRAY)
    # Empty cells are nearly black. Icons and white stack text lift a measurable
    # fraction of pixels above this threshold.
    return float(np.mean(gray > 28)) >= min_content


def remove_count_overlay(cell: np.ndarray) -> np.ndarray:
    """Mask bright OCR text before template comparison."""
    cleaned = cell.copy()
    gray = cv2.cvtColor(cleaned, cv2.COLOR_BGR2GRAY)
    bright = gray > 190
    # Only mask top/corner areas so bright item details survive in the center.
    h, w = bright.shape
    corner_mask = np.zeros_like(bright)
    corner_mask[: int(h * 0.48), :] = True
    corner_mask[:, int(w * 0.65) :] = True
    cleaned[bright & corner_mask] = 0
    return cleaned


def preprocess_icon(image: np.ndarray, size: int = 96) -> np.ndarray:
    image = remove_count_overlay(image)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    non_black = np.column_stack(np.where(gray > 18))
    if len(non_black) > 0:
        y1, x1 = non_black.min(axis=0)
        y2, x2 = non_black.max(axis=0)
        image = image[y1 : y2 + 1, x1 : x2 + 1]

    h, w = image.shape[:2]
    scale = min(size / max(w, 1), size / max(h, 1))
    resized = cv2.resize(image, (max(1, int(w * scale)), max(1, int(h * scale))), interpolation=cv2.INTER_AREA)
    canvas = np.zeros((size, size, 3), dtype=np.uint8)
    y = (size - resized.shape[0]) // 2
    x = (size - resized.shape[1]) // 2
    canvas[y : y + resized.shape[0], x : x + resized.shape[1]] = resized
    return canvas


class ItemMatcher:
    def __init__(
        self,
        manifest_path: Path = DEFAULT_MANIFEST,
        method: str = "auto",
        calibration: MatchCalibration | None = None,
    ) -> None:
        self.manifest_path = manifest_path
        self.method = method
        self.calibration = calibration or MatchCalibration()
        self.references = self._load_references()
        self.clip_model: Any | None = None
        self.clip_preprocess: Any | None = None
        self.device = "cpu"

        if method in {"auto", "clip"}:
            self._try_init_clip()
        if method == "clip" and self.clip_model is None:
            raise RuntimeError("CLIP requested, but torch/clip could not be loaded locally.")

    def _load_references(self) -> list[ReferenceIcon]:
        with self.manifest_path.open("r", encoding="utf-8") as file:
            entries = json.load(file)

        refs: list[ReferenceIcon] = []
        for entry in entries:
            path = ROOT / entry["file"]
            image = cv2.imread(str(path), cv2.IMREAD_COLOR)
            if image is None:
                continue
            refs.append(
                ReferenceIcon(
                    id=snake_case(entry.get("id") or entry["name"]),
                    name=entry["name"],
                    path=path,
                    image=preprocess_icon(image),
                )
            )

        if not refs:
            raise RuntimeError(f"No reference icons loaded from {self.manifest_path}")
        return refs

    def _try_init_clip(self) -> None:
        try:
            import clip  # type: ignore
            import torch  # type: ignore
            from PIL import Image  # type: ignore
        except ImportError:
            return

        self.torch = torch
        self.pil_image = Image
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.clip_model, self.clip_preprocess = clip.load("ViT-B/32", device=self.device)

        encoded_refs = []
        with torch.no_grad():
            for ref in self.references:
                rgb = cv2.cvtColor(ref.image, cv2.COLOR_BGR2RGB)
                tensor = self.clip_preprocess(Image.fromarray(rgb)).unsqueeze(0).to(self.device)
                features = self.clip_model.encode_image(tensor)
                features = features / features.norm(dim=-1, keepdim=True)
                encoded_refs.append(
                    ReferenceIcon(ref.id, ref.name, ref.path, ref.image, features.cpu().numpy()[0])
                )
        self.references = encoded_refs

    def match(self, cell: np.ndarray) -> DetectedItem:
        if self.clip_model is not None and self.method == "auto":
            return self._match_hybrid(cell)
        if self.clip_model is not None:
            return self._match_clip(cell)
        return self._match_template(cell)

    def _clip_scores(self, cell: np.ndarray) -> list[tuple[float, ReferenceIcon]]:
        import torch  # type: ignore

        rgb = cv2.cvtColor(preprocess_icon(cell), cv2.COLOR_BGR2RGB)
        image = self.pil_image.fromarray(rgb)
        tensor = self.clip_preprocess(image).unsqueeze(0).to(self.device)
        with torch.no_grad():
            features = self.clip_model.encode_image(tensor)
            features = features / features.norm(dim=-1, keepdim=True)
            vector = features.cpu().numpy()[0]

        return sorted(
            [(float(np.dot(vector, ref.features)), ref) for ref in self.references if ref.features is not None],
            key=lambda pair: pair[0],
            reverse=True,
        )

    def _template_scores(self, cell: np.ndarray) -> list[tuple[float, ReferenceIcon]]:
        query = preprocess_icon(cell)
        query_gray = cv2.cvtColor(query, cv2.COLOR_BGR2GRAY)

        scores: list[tuple[float, ReferenceIcon]] = []
        for ref in self.references:
            ref_gray = cv2.cvtColor(ref.image, cv2.COLOR_BGR2GRAY)
            score = float(cv2.matchTemplate(query_gray, ref_gray, cv2.TM_CCOEFF_NORMED)[0][0])
            scores.append((score, ref))
        return sorted(scores, key=lambda pair: pair[0], reverse=True)

    def _match_clip(self, cell: np.ndarray) -> DetectedItem:
        scores = self._clip_scores(cell)
        best_score, best_ref = scores[0]
        second_score = scores[1][0] if len(scores) > 1 else 0.0
        confidence = max(0.0, min(1.0, best_score))
        return DetectedItem(
            best_ref.id,
            extract_count(cell),
            confidence,
            clip_id=best_ref.id,
            clip_score=best_score,
            clip_margin=best_score - second_score,
        )

    def _match_template(self, cell: np.ndarray) -> DetectedItem:
        scores = self._template_scores(cell)
        best_score, best_ref = scores[0]
        second_score = scores[1][0] if len(scores) > 1 else 0.0
        confidence = max(0.0, min(1.0, best_score))
        return DetectedItem(
            best_ref.id,
            extract_count(cell),
            confidence,
            template_id=best_ref.id,
            template_score=best_score,
            template_margin=best_score - second_score,
        )

    def _match_hybrid(self, cell: np.ndarray) -> DetectedItem:
        clip_scores = self._clip_scores(cell)
        template_scores = self._template_scores(cell)

        clip_score, clip_ref = clip_scores[0]
        template_score, template_ref = template_scores[0]
        clip_margin = clip_score - clip_scores[1][0] if len(clip_scores) > 1 else clip_score
        template_margin = template_score - template_scores[1][0] if len(template_scores) > 1 else template_score
        count = extract_count(cell)

        if clip_ref.id == template_ref.id:
            confidence = min(1.0, 0.55 * template_score + 0.45 * clip_score + 0.08)
            return DetectedItem(
                template_ref.id,
                count,
                confidence,
                decision="clip_template_agree",
                clip_id=clip_ref.id,
                clip_score=clip_score,
                clip_margin=clip_margin,
                template_id=template_ref.id,
                template_score=template_score,
                template_margin=template_margin,
            )

        if (
            template_score >= self.calibration.strong_template_score
            and template_margin >= self.calibration.strong_template_margin
        ):
            confidence = min(0.95, template_score)
            return DetectedItem(
                template_ref.id,
                count,
                confidence,
                decision="strong_template",
                clip_id=clip_ref.id,
                clip_score=clip_score,
                clip_margin=clip_margin,
                template_id=template_ref.id,
                template_score=template_score,
                template_margin=template_margin,
            )

        if (
            template_score >= self.calibration.clear_template_score
            and template_margin >= self.calibration.clear_template_margin
        ):
            confidence = min(0.90, template_score)
            return DetectedItem(
                template_ref.id,
                count,
                confidence,
                decision="clear_template_margin",
                clip_id=clip_ref.id,
                clip_score=clip_score,
                clip_margin=clip_margin,
                template_id=template_ref.id,
                template_score=template_score,
                template_margin=template_margin,
            )

        # High CLIP similarity alone is not trustworthy for these tiny UI crops.
        # Keep the best available id for debugging, but force confidence below
        # the default output threshold so ambiguous cells do not pollute JSON.
        return DetectedItem(
            template_ref.id if template_score >= 0.78 else clip_ref.id,
            count,
            min(
                self.calibration.reject_max_confidence,
                max(template_score, clip_score) - self.calibration.reject_confidence_penalty,
            ),
            decision="rejected_disagreement",
            clip_id=clip_ref.id,
            clip_score=clip_score,
            clip_margin=clip_margin,
            template_id=template_ref.id,
            template_score=template_score,
            template_margin=template_margin,
        )


_MATCHER: ItemMatcher | None = None


def detect_item(cell: np.ndarray) -> dict[str, Any]:
    """Match one grid cell to the closest known local item icon."""
    global _MATCHER
    if _MATCHER is None:
        _MATCHER = ItemMatcher()
    detected = _MATCHER.match(cell)
    return {
        "id": detected.id,
        "count": detected.count,
        "confidence": detected.confidence,
        "decision": detected.decision,
        "clip_id": detected.clip_id,
        "clip_score": detected.clip_score,
        "clip_margin": detected.clip_margin,
        "template_id": detected.template_id,
        "template_score": detected.template_score,
        "template_margin": detected.template_margin,
    }


def extract_count(cell: np.ndarray) -> int:
    """OCR the stack-count overlay. Defaults to 1 when no number is readable."""
    if pytesseract is None:
        return 1

    h, w = cell.shape[:2]
    hsv = cv2.cvtColor(cell, cv2.COLOR_BGR2HSV)
    white_mask = ((hsv[:, :, 1] < 90) & (hsv[:, :, 2] > 145)).astype(np.uint8) * 255
    white_mask = cv2.resize(white_mask, None, fx=4, fy=4, interpolation=cv2.INTER_NEAREST)
    white_mask = cv2.dilate(white_mask, cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2)), iterations=1)

    crops = [
        white_mask,
        cell[: int(h * 0.60), :],
        cell[: int(h * 0.55), int(w * 0.45) :],
        cell[: int(h * 0.55), : int(w * 0.55)],
        cell[int(h * 0.45) :, int(w * 0.45) :],
    ]

    for crop in crops:
        if crop.ndim == 2:
            thresh = crop
        else:
            gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
            gray = cv2.resize(gray, None, fx=3, fy=3, interpolation=cv2.INTER_CUBIC)
            _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
        config = "--psm 7 -c tessedit_char_whitelist=xX0123456789"
        text = pytesseract.image_to_string(thresh, config=config)
        match = re.search(r"[xX]\s*(\d{1,4})", text)
        if match:
            count = int(match.group(1))
            if count > 1:
                return count
    return 1


def detect_class_name(
    image: np.ndarray,
    rel_box: tuple[float, float, float, float] = DEFAULT_CLASS_REL,
) -> str:
    if pytesseract is None:
        return "unknown"

    crop = relative_crop(image, rel_box)
    gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
    gray = cv2.resize(gray, None, fx=3, fy=3, interpolation=cv2.INTER_CUBIC)
    _, thresh = cv2.threshold(gray, 120, 255, cv2.THRESH_BINARY)
    text = pytesseract.image_to_string(thresh, config="--psm 7")
    match = re.search(r"Class:\s*([A-Za-z][A-Za-z0-9 '-]+)", text)
    if match:
        return match.group(1).strip()

    # Fallback: often the OCR crop only returns the yellow class word.
    cleaned = re.sub(r"[^A-Za-z0-9 '-]+", " ", text).strip()
    return cleaned or "unknown"


def aggregate_results(items: Iterable[dict[str, Any]], min_confidence: float = 0.7) -> list[dict[str, Any]]:
    merged: dict[str, dict[str, Any]] = {}
    for item in items:
        if float(item["confidence"]) < min_confidence:
            continue
        item_id = snake_case(str(item["id"]))
        count = int(item["count"])
        confidence = float(item["confidence"])

        if item_id not in merged:
            merged[item_id] = {"id": item_id, "count": count, "confidence": confidence}
        else:
            merged[item_id]["count"] += count
            merged[item_id]["confidence"] = max(float(merged[item_id]["confidence"]), confidence)

    return sorted(merged.values(), key=lambda entry: entry["id"])


def save_debug_cells(grid: np.ndarray, cells: list[np.ndarray], debug_dir: Path) -> None:
    debug_dir.mkdir(parents=True, exist_ok=True)
    cv2.imwrite(str(debug_dir / "grid_crop.png"), grid)
    for index, cell in enumerate(cells):
        cv2.imwrite(str(debug_dir / f"cell_{index:02d}.png"), cell)


def save_debug_report(raw_items: list[dict[str, Any]], debug_dir: Path) -> None:
    lines = ["cell,id,count,confidence,decision,clip_id,clip_score,clip_margin,template_id,template_score,template_margin"]
    for index, item in enumerate(raw_items):
        lines.append(
            ",".join(
                [
                    str(index),
                    str(item.get("id") or ""),
                    str(item.get("count") or ""),
                    f"{float(item.get('confidence') or 0.0):.6f}",
                    str(item.get("decision") or ""),
                    str(item.get("clip_id") or ""),
                    f"{float(item.get('clip_score') or 0.0):.6f}",
                    f"{float(item.get('clip_margin') or 0.0):.6f}",
                    str(item.get("template_id") or ""),
                    f"{float(item.get('template_score') or 0.0):.6f}",
                    f"{float(item.get('template_margin') or 0.0):.6f}",
                ]
            )
        )
    (debug_dir / "match_report.csv").write_text("\n".join(lines) + "\n", encoding="utf-8")


def parse_rel_box(value: str) -> tuple[float, float, float, float]:
    parts = [float(part.strip()) for part in value.split(",")]
    if len(parts) != 4:
        raise argparse.ArgumentTypeError("Expected four comma-separated floats: x1,y1,x2,y2")
    return tuple(parts)  # type: ignore[return-value]


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract Risk of Rain 2 end-screen item stacks as JSON.")
    parser.add_argument("image", help="Path to the screenshot image.")
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST, help="Local item icon manifest JSON.")
    parser.add_argument("--rows", type=int, default=4, help="Fixed item-grid row count.")
    parser.add_argument("--cols", type=int, default=10, help="Fixed item-grid column count.")
    parser.add_argument(
        "--min-confidence",
        type=float,
        default=MatchCalibration.output_min_confidence,
        help="Discard matches below this confidence.",
    )
    parser.add_argument("--method", choices=["auto", "clip", "template"], default="auto", help="Matching backend.")
    parser.add_argument("--grid-rel", type=parse_rel_box, default=DEFAULT_GRID_REL, help="Grid crop as x1,y1,x2,y2 ratios.")
    parser.add_argument("--class-rel", type=parse_rel_box, default=DEFAULT_CLASS_REL, help="Class OCR crop as x1,y1,x2,y2 ratios.")
    parser.add_argument("--debug-dir", type=Path, help="Save grid and cell crops for inspection.")
    parser.add_argument("--strong-template-score", type=float, default=MatchCalibration.strong_template_score)
    parser.add_argument("--strong-template-margin", type=float, default=MatchCalibration.strong_template_margin)
    parser.add_argument("--clear-template-score", type=float, default=MatchCalibration.clear_template_score)
    parser.add_argument("--clear-template-margin", type=float, default=MatchCalibration.clear_template_margin)
    parser.add_argument("--reject-max-confidence", type=float, default=MatchCalibration.reject_max_confidence)
    args = parser.parse_args()

    image = load_image(args.image)
    grid = crop_item_grid(image, args.grid_rel)
    cells = split_grid(grid, rows=args.rows, cols=args.cols)

    global _MATCHER
    calibration = MatchCalibration(
        output_min_confidence=args.min_confidence,
        strong_template_score=args.strong_template_score,
        strong_template_margin=args.strong_template_margin,
        clear_template_score=args.clear_template_score,
        clear_template_margin=args.clear_template_margin,
        reject_max_confidence=args.reject_max_confidence,
    )
    _MATCHER = ItemMatcher(args.manifest, args.method, calibration=calibration)
    raw_items = [detect_item(cell) for cell in cells]

    if args.debug_dir:
        save_debug_cells(grid, cells, args.debug_dir)
        save_debug_report(raw_items, args.debug_dir)

    result = {
        "class": detect_class_name(image, args.class_rel),
        "items": aggregate_results(raw_items, min_confidence=args.min_confidence),
    }
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
