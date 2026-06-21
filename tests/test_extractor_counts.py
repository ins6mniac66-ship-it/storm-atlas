#!/usr/bin/env python3
from __future__ import annotations

import unittest
import sys
from pathlib import Path

try:
    import cv2
    import numpy as np
except ImportError as exc:  # pragma: no cover - environment-dependent skip
    raise unittest.SkipTest(f"extractor image dependencies are not installed: {exc}") from exc

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
try:
    import ror2_run_item_extractor as extractor
except ImportError as exc:  # pragma: no cover - environment-dependent skip
    raise unittest.SkipTest(f"extractor module dependencies are not installed: {exc}") from exc


def stack_cell(label: str) -> np.ndarray:
    cell = np.zeros((96, 96, 3), dtype=np.uint8)
    cv2.rectangle(cell, (8, 8), (88, 88), (38, 38, 38), thickness=-1)
    cv2.putText(cell, label, (8, 34), cv2.FONT_HERSHEY_SIMPLEX, 0.78, (255, 255, 255), 2, cv2.LINE_AA)
    return cell


@unittest.skipIf(extractor.pytesseract is None, "pytesseract is not installed")
class ExtractCountTests(unittest.TestCase):
    def test_reads_single_digit_stack(self) -> None:
        self.assertEqual(extractor.extract_count(stack_cell("x2")), 2)

    def test_reads_two_digit_stack(self) -> None:
        self.assertEqual(extractor.extract_count(stack_cell("x49")), 49)

    def test_reads_three_digit_stack(self) -> None:
        self.assertEqual(extractor.extract_count(stack_cell("x100")), 100)

    def test_defaults_to_one_without_stack_text(self) -> None:
        self.assertEqual(extractor.extract_count(stack_cell("")), 1)


if __name__ == "__main__":
    unittest.main()
