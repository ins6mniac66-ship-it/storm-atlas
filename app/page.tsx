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
    <div className="phone-wrap" aria-label="Real Storm Atlas app screenshots">
      <figure className="screen-card screen-card-left">
        <img src="/screenshots/build.png" alt="Storm Atlas build screen" width="390" height="844" />
      </figure>
      <figure className="screen-card screen-card-main">
        <img src="/screenshots/items.png" alt="Storm Atlas item catalog screen" width="390" height="844" />
      </figure>
      <figure className="screen-card screen-card-right">
        <img src="/screenshots/reference.png" alt="Storm Atlas reference screen" width="390" height="844" />
      </figure>
      <div className="phone-note note-top"><span>01</span>Actual app UI</div>
      <div className="phone-note note-bottom"><span>02</span>Offline reference</div>
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
