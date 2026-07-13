"use client";

import { useMemo, useState } from "react";

type Tab = "items" | "saved" | "build" | "reference";
type Rarity = "All" | "Common" | "Uncommon" | "Legendary" | "Boss" | "Lunar" | "Void";

const items = [
  { name: "Shatterspleen", rarity: "Boss", effect: "Critical strikes bleed enemies. Bleeding enemies explode on death.", image: "/assets/135_Shatterspleen.b452230235d209b12d8e0a375aa7a83a.png", tags: ["Damage", "On-kill"] },
  { name: "Genesis Loop", rarity: "Boss", effect: "Falling below 25% health causes an electric explosion.", image: "/assets/123_Genesis_Loop.eb17f1594bb0489bd1ec1553e988917c.png", tags: ["Damage", "Health"] },
  { name: "Artifact Key", rarity: "Boss", effect: "A stone shard that resonates with the Bulwark's Ambry.", image: "/assets/115_Artifact_Key.b67b872f0213e983660fd7ff5e8374c4.png", tags: ["Utility"] },
  { name: "Exposed Cerebellum", rarity: "Uncommon", effect: "A strange remnant with an uncertain combat application.", image: "/assets/120_Exposed_Cerebellum.f6d32055238c15775ac7faf365e4236f.png", tags: ["Utility", "Needs review"] },
  { name: "Faulty Conductor", rarity: "Legendary", effect: "A volatile component recovered from the storm.", image: "/assets/121_Faulty_Conductor.7310e178d53ec396f1c321f9c03b58c9.png", tags: ["Damage"] },
  { name: "Functional Coupler", rarity: "Common", effect: "A field component catalogued for quick reference.", image: "/assets/122_Functional_Coupler.7facfac6242df6690f63e7dcd6950476.png", tags: ["Utility"] },
] as const;

const tabs: { id: Tab; icon: string; label: string }[] = [
  { id: "items", icon: "▦", label: "Items" },
  { id: "saved", icon: "★", label: "Saved" },
  { id: "build", icon: "⌁", label: "Build" },
  { id: "reference", icon: "▥", label: "Reference" },
];

const referenceTools = [
  ["Survivors", "Priorities, loadouts, and practical pivots", "◎"],
  ["Run systems", "Proc chains, armor, damage, and difficulty", "⚙"],
  ["Maps", "Stages, routes, and environment landmarks", "◇"],
  ["Shrines", "Costs, outcomes, and fast risk checks", "△"],
  ["Recipes", "Wandering Chef recipes and ingredients", "≋"],
  ["Glossary", "Short definitions for run terminology", "Aa"],
];

export default function Home() {
  const [tab, setTab] = useState<Tab>("items");
  const [query, setQuery] = useState("");
  const [rarity, setRarity] = useState<Rarity>("All");
  const [saved, setSaved] = useState<string[]>(["Shatterspleen"]);
  const [build, setBuild] = useState<Record<string, number>>({ "Genesis Loop": 1 });
  const [brief, setBrief] = useState(true);

  const filtered = useMemo(() => items.filter((item) => {
    const matchesText = `${item.name} ${item.effect} ${item.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase());
    return matchesText && (rarity === "All" || item.rarity === rarity);
  }), [query, rarity]);

  const visibleItems = tab === "saved" ? filtered.filter((item) => saved.includes(item.name)) : filtered;
  const stacks = Object.values(build).reduce((total, count) => total + count, 0);

  function toggleSaved(name: string) {
    setSaved((current) => current.includes(name) ? current.filter((entry) => entry !== name) : [...current, name]);
  }

  function addToBuild(name: string) {
    setBuild((current) => ({ ...current, [name]: (current[name] ?? 0) + 1 }));
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="identity">
          <img src="/assets/storm-atlas-icon.png" alt="" width="42" height="42" />
          <div><h1>Storm Atlas</h1><p>Offline run companion</p></div>
        </div>
        <div className="header-status"><i /> LOCAL DATA <strong>READY</strong></div>
      </header>

      <section className="workspace">
        <aside className="side-nav" aria-label="Primary navigation">
          <div className="nav-label">Run tools</div>
          {tabs.map((item) => (
            <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)}>
              <span>{item.icon}</span>{item.label}
              {item.id === "saved" && saved.length > 0 ? <b>{saved.length}</b> : null}
              {item.id === "build" && stacks > 0 ? <b>{stacks}</b> : null}
            </button>
          ))}
          <div className="side-note"><span>OFFLINE FIRST</span><p>Core catalog and run tools stay available without a connection.</p></div>
        </aside>

        <section className="content">
          {(tab === "items" || tab === "saved") && (
            <>
              <div className="screen-heading"><div><span>CATALOG / {tab.toUpperCase()}</span><h2>{tab === "saved" ? "Saved items" : "Item catalog"}</h2><p>{tab === "saved" ? "Your quick-access field list." : "Search effects, stacks, sources, and expansion scope."}</p></div><div className="count-badge">{visibleItems.length}</div></div>
              {brief && tab === "items" ? <div className="launch-brief"><div><span>STORM ATLAS</span><h3>Built for active runs, not wiki wandering.</h3></div><button aria-label="Dismiss introduction" onClick={() => setBrief(false)}>×</button><p>Search items fast, track the build you have, and keep the useful reference close while the clock keeps moving.</p><div><b>OFFLINE</b><b>FAST SEARCH</b><b>BASE + DLC FILTERS</b></div></div> : null}
              <div className="controls">
                <label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search items, effects, or tags" />{query ? <button onClick={() => setQuery("")}>×</button> : null}</label>
                <div className="rarities">{(["All", "Common", "Uncommon", "Legendary", "Boss", "Lunar", "Void"] as Rarity[]).map((name) => <button key={name} data-rarity={name} className={rarity === name ? "active" : ""} onClick={() => setRarity(name)}>{name}</button>)}</div>
                <div className="control-row"><div className="segmented"><button className="active">Base Game</button><button>Expansions</button></div><button className="filter-button">Advanced filters <span>⌄</span></button></div>
              </div>
              <div className="results-row"><strong>{visibleItems.length} items</strong><span>Default order · Grid view</span></div>
              <div className="summary"><div><strong>184</strong><span>ITEMS</span></div><div><strong>6</strong><span>RARITIES</span></div><div><strong>23</strong><span>TAGS</span></div><button onClick={() => setTab("build")}><span><b>Active build</b><small>{stacks} stacks across {Object.keys(build).length} items</small></span><strong>Review →</strong></button></div>
              <div className="item-grid">
                {visibleItems.map((item) => <article className="item-card" key={item.name} data-rarity={item.rarity}><div className="rarity-strip" /><button className={saved.includes(item.name) ? "save saved" : "save"} aria-label={`Save ${item.name}`} onClick={() => toggleSaved(item.name)}>★</button><div className="item-icon"><img src={item.image} alt="" /></div><div className="item-copy"><div className="card-title"><h3>{item.name}</h3><span>{item.rarity}</span></div><p>{item.effect}</p><div className="tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><button className="add-button" onClick={() => addToBuild(item.name)}>＋ Add to build {build[item.name] ? <b>{build[item.name]}</b> : null}</button></div></article>)}
                {visibleItems.length === 0 ? <div className="empty"><span>⌕</span><h3>No items found</h3><p>Try another search or clear the rarity filter.</p><button onClick={() => { setQuery(""); setRarity("All"); }}>Clear filters</button></div> : null}
              </div>
            </>
          )}

          {tab === "build" && <BuildView build={build} setBuild={setBuild} />}
          {tab === "reference" && <ReferenceView />}
        </section>
      </section>

      <nav className="bottom-tabs" aria-label="Mobile navigation">
        {tabs.map((item) => <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)}><span>{item.icon}</span>{item.label}</button>)}
      </nav>
    </main>
  );
}

function BuildView({ build, setBuild }: { build: Record<string, number>; setBuild: React.Dispatch<React.SetStateAction<Record<string, number>>> }) {
  const entries = Object.entries(build).filter(([, count]) => count > 0);
  const stacks = entries.reduce((total, [, count]) => total + count, 0);
  return <><div className="screen-heading"><div><span>RUN / BUILD</span><h2>Active build</h2><p>Track what you have. Decide what helps next.</p></div><button className="clear-build" onClick={() => setBuild({})}>Clear build</button></div><div className="build-stats"><div><span>TOTAL STACKS</span><strong>{stacks}</strong></div><div><span>UNIQUE ITEMS</span><strong>{entries.length}</strong></div><div><span>RUN STATUS</span><strong className="ready">READY</strong></div></div><section className="build-panel"><div className="panel-heading"><div><span>TRACKED ITEMS</span><h3>Your current run</h3></div><b>{entries.length}</b></div>{entries.length ? entries.map(([name, count]) => { const item = items.find((entry) => entry.name === name); return <div className="build-item" key={name}><img src={item?.image} alt="" /><div><strong>{name}</strong><span>{item?.rarity}</span></div><div className="stepper"><button onClick={() => setBuild((current) => ({ ...current, [name]: Math.max(0, count - 1) }))}>−</button><b>{count}</b><button onClick={() => setBuild((current) => ({ ...current, [name]: count + 1 }))}>＋</button></div></div>; }) : <div className="empty"><span>⌁</span><h3>No items tracked</h3><p>Add items from the catalog as they drop.</p></div>}</section><section className="decision-panel"><span>NEXT PICKUP CHECK</span><h3>Prioritize what fixes the run.</h3><p>Check movement and recovery before adding more damage. Use item tags to compare the gaps in your current build.</p><div><b>1</b><span>Can you reposition safely?</span></div><div><b>2</b><span>Can you recover after a hit?</span></div><div><b>3</b><span>Then scale damage and proc chains.</span></div></section></>;
}

function ReferenceView() {
  return <><div className="screen-heading"><div><span>FIELD / REFERENCE</span><h2>Reference</h2><p>Practical answers without losing your place in the run.</p></div><div className="count-badge">6</div></div><div className="reference-grid">{referenceTools.map(([title, copy, icon]) => <button key={title}><i>{icon}</i><div><h3>{title}</h3><p>{copy}</p></div><span>›</span></button>)}</div><section className="verified-note"><span>DATA STATUS</span><h3>Uncertainty stays visible.</h3><p>Mechanics are labeled by source and verification status. Base-game and expansion content remain clearly separated.</p><div><b>VERIFIED</b><b>WIKI-DERIVED</b><b>NEEDS REVIEW</b></div></section></>;
}
