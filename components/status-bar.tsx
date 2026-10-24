// Browser and phone chrome from the reference: window dots on the left,
// signal, wi-fi and a battery that charges during the intro on the right.

export function StatusBar() {
  return (
    <div className="status-bar" aria-hidden="true">
      <div className="status-bar__dots">
        <span />
        <span />
        <span />
      </div>

      <div className="status-bar__icons">
        <svg className="status-bar__signal" viewBox="0 0 22 14" width="22" height="14">
          <rect x="0" y="9" width="4" height="5" rx="1" />
          <rect x="6" y="6" width="4" height="8" rx="1" />
          <rect x="12" y="3" width="4" height="11" rx="1" />
          <rect x="18" y="0" width="4" height="14" rx="1" />
        </svg>

        <svg className="status-bar__wifi" viewBox="0 0 20 15" width="20" height="15">
          <path d="M10 14.5a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8Z" />
          <path d="M5.1 9.6a7 7 0 0 1 9.8 0l-1.6 1.7a4.7 4.7 0 0 0-6.6 0L5.1 9.6Z" />
          <path d="M1.7 6.2a11.8 11.8 0 0 1 16.6 0l-1.6 1.7a9.5 9.5 0 0 0-13.4 0L1.7 6.2Z" />
        </svg>

        <span className="status-bar__battery">
          <span className="status-bar__battery-fill" />
        </span>
      </div>
    </div>
  );
}
