const BARS = Array.from({ length: 12 }, (_, i) => i);

export function Spinner() {
  return (
    <div className="spinner" role="status">
      {BARS.map((i) => (
        <span key={i} className="spinner__bar" style={{ "--i": i } as React.CSSProperties} />
      ))}
      <span className="sr-only">The full website is being built.</span>
    </div>
  );
}
