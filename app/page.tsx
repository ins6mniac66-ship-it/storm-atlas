const itemIcons = [
  "/assets/120_Exposed_Cerebellum.f6d32055238c15775ac7faf365e4236f.png",
  "/assets/121_Faulty_Conductor.7310e178d53ec396f1c321f9c03b58c9.png",
  "/assets/135_Shatterspleen.b452230235d209b12d8e0a375aa7a83a.png",
  "/assets/123_Genesis_Loop.eb17f1594bb0489bd1ec1553e988917c.png",
  "/assets/115_Artifact_Key.b67b872f0213e983660fd7ff5e8374c4.png",
  "/assets/122_Functional_Coupler.7facfac6242df6690f63e7dcd6950476.png",
];

const features = [
  ["01", "Items", "Find effects, stacks, sources, and expansion scope fast."],
  ["02", "Build", "Track the run you have and spot the next useful pickup."],
  ["03", "Survivors", "Keep survivor priorities and pivots close during play."],
  ["04", "Reference", "Maps, shrines, recipes, mechanics, and proc chains."],
];

function Radar() {
  return (
    <div className="radar" aria-hidden="true">
      <span className="radar-ring ring-one" />
      <span className="radar-ring ring-two" />
      <span className="radar-ring ring-three" />
      <span className="radar-axis axis-x" />
      <span className="radar-axis axis-y" />
      <span className="radar-sweep" />
      <i className="ping ping-one" />
      <i className="ping ping-two" />
      <i className="ping ping-three" />
    </div>
  );
}

function Phone() {
  return (
    <div className="phone-wrap" aria-label="Storm Atlas app preview">
      <div className="phone">
        <div className="phone-speaker" />
        <div className="phone-screen">
          <div className="app-bar">
            <div className="app-id">
              <img src="/assets/storm-atlas-icon.png" alt="" width="36" height="36" />
              <div><b>Storm Atlas</b><span>Offline // Ready</span></div>
            </div>
            <span className="signal">● 100%</span>
          </div>

          <div className="run-head">
            <div><span>Current run</span><strong>Railgunner</strong></div>
            <div className="stage"><span>Stage 04</span><b>32:47</b></div>
          </div>

          <div className="decision">
            <span>Next priority</span>
            <strong>Stack crit, then add a safer movement option.</strong>
            <small>Based on 14 tracked items</small>
          </div>

          <div className="inventory-title"><b>Build inventory</b><span>14 items</span></div>
          <div className="item-grid">
            {itemIcons.map((src, index) => (
              <div className="item" key={src}>
                <img src={src} alt="" width="58" height="58" />
                <span>x{index % 3 + 1}</span>
              </div>
            ))}
          </div>

          <div className="quick-grid">
            <div><span>Damage</span><b>+48%</b></div>
            <div><span>Mobility</span><b>Stable</b></div>
            <div><span>Defense</span><b>Low</b></div>
          </div>

          <nav className="phone-nav" aria-label="App preview navigation">
            <b>Items</b><span>Build</span><span>Survivors</span><span>Reference</span>
          </nav>
        </div>
      </div>
      <div className="phone-note note-top"><span>01</span>Run state</div>
      <div className="phone-note note-bottom"><span>02</span>Decision support</div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Storm Atlas home">
          <img src="/assets/storm-atlas-icon.png" alt="" width="42" height="42" />
          <span>Storm Atlas</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#capabilities">Capabilities</a>
          <a href="#offline">Offline first</a>
          <a className="nav-cta" href="https://github.com/ins6mniac66-ship-it" target="_blank" rel="noreferrer">GitHub ↗</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span />Risk of Rain 2 companion // Android</div>
          <h1>Your run.<br /><em>Under control.</em></h1>
          <p className="lede">Storm Atlas keeps item lookup, build tracking, survivor planning, and practical reference tools one tap away while the clock keeps moving.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#capabilities">Explore the toolkit <span>↓</span></a>
            <a className="button button-secondary" href="https://github.com/ins6mniac66-ship-it" target="_blank" rel="noreferrer">View project <span>↗</span></a>
          </div>
          <div className="status-row">
            <span><i />No account</span>
            <span><i />No connection required</span>
            <span><i />Base + expansion filters</span>
          </div>
        </div>
        <div className="hero-visual">
          <Radar />
          <Phone />
          <div className="telemetry telemetry-top"><span>SYS</span>CATALOG_READY</div>
          <div className="telemetry telemetry-bottom"><span>MODE</span>OFFLINE_FIRST</div>
        </div>
      </section>

      <section className="feature-rail" id="capabilities">
        {features.map(([number, title, copy]) => (
          <article key={title}>
            <span>{number}</span><div><h2>{title}</h2><p>{copy}</p></div>
          </article>
        ))}
      </section>

      <section className="offline-band" id="offline">
        <div>
          <span className="section-index">05 / Field reliability</span>
          <h2>Built for the moment between “what dropped?” and “what now?”</h2>
        </div>
        <div className="offline-copy">
          <p>Storm Atlas is designed as a second screen for active runs. The catalog stays on-device, uncertain data stays labeled, and base-game content never gets silently mixed with expansions.</p>
          <div className="meter"><span>Local catalog</span><b><i /></b><strong>READY</strong></div>
          <div className="meter"><span>Run support</span><b><i /></b><strong>READY</strong></div>
        </div>
      </section>

      <footer>
        <a className="brand" href="#top"><img src="/assets/storm-atlas-icon.png" alt="" width="34" height="34" /><span>Storm Atlas</span></a>
        <p>Unofficial companion for Risk of Rain 2. Not affiliated with Hopoo Games or Gearbox Publishing.</p>
        <a href="https://buymeacoffee.com/ins6mniac66" target="_blank" rel="noreferrer">Support development ↗</a>
      </footer>
    </main>
  );
}
