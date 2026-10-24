// Decorative layers behind the hero: gradient, drifting oversized type,
// the motion-blurred figure with its ghosts, grain and vignette.

const ROWS = ["coming soon", "soon coming", "coming soon", "soon coming"];

export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__light" />

      <div className="giant-type giant-type--back">
        {ROWS.slice(0, 2).map((row, i) => (
          <div key={i} className={`giant-type__row giant-type__row--${i}`}>
            <span>{row}&nbsp;{row}&nbsp;</span>
            <span>{row}&nbsp;{row}&nbsp;</span>
          </div>
        ))}
      </div>

      <div className="figure">
        {/* eslint-disable-next-line @next/next/no-img-element -- pre-blurred 17 KB asset, no optimisation needed */}
        <img className="figure__layer figure__layer--ghost-far" src="/figure.webp" alt="" width={706} height={680} decoding="async" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="figure__layer figure__layer--ghost-near" src="/figure.webp" alt="" width={706} height={680} decoding="async" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="figure__layer figure__layer--main" src="/figure.webp" alt="" width={706} height={680} fetchPriority="high" />
      </div>

      <div className="giant-type giant-type--front">
        {ROWS.slice(2).map((row, i) => (
          <div key={i} className={`giant-type__row giant-type__row--${i + 2}`}>
            <span>{row}&nbsp;{row}&nbsp;</span>
            <span>{row}&nbsp;{row}&nbsp;</span>
          </div>
        ))}
      </div>

      <div className="backdrop__scrim" />
      <div className="backdrop__grain" />
      <div className="backdrop__vignette" />
    </div>
  );
}
