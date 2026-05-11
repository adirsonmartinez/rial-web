export function AppStoreBadge() {
  return (
    <a
      href="https://apps.apple.com/us/app/rial-finanzas-personales/id6755372307"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Descargar en App Store"
      className="inline-block"
    >
      <svg width="165" height="54" viewBox="0 0 165 54" xmlns="http://www.w3.org/2000/svg">
        <rect width="165" height="54" rx="27" fill="#000" />
        <g fill="#fff">
          <path d="M38.5 27.4c0-3.3 2.7-4.9 2.8-5-1.5-2.3-3.9-2.6-4.8-2.6-2-.2-4 1.2-5 1.2s-2.6-1.2-4.3-1.1c-2.2 0-4.2 1.3-5.4 3.2-2.3 4-.6 9.9 1.6 13.2 1.1 1.6 2.4 3.3 4.2 3.2 1.7-.1 2.3-1.1 4.3-1.1s2.6 1.1 4.4 1 3-1.6 4.1-3.2c1.3-1.8 1.8-3.6 1.8-3.7 0-.1-3.5-1.3-3.7-5.3zM35 18c.9-1.1 1.5-2.7 1.4-4.2-1.3.1-2.9.9-3.9 2-.8 1-1.6 2.6-1.4 4.1 1.5.1 3-.7 3.9-1.9z" />
          <text x="55" y="21" fontSize="10" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="400" letterSpacing=".3">Descárgalo en el</text>
          <text x="55" y="40" fontSize="18" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" letterSpacing=".2">App Store</text>
        </g>
      </svg>
    </a>
  );
}

export function GooglePlayBadge() {
  return (
    <a
      href="https://play.google.com/store/apps/details?id=com.adimtnez.rial&hl=en"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Disponible en Google Play"
      className="inline-block"
    >
      <svg width="175" height="54" viewBox="0 0 175 54" xmlns="http://www.w3.org/2000/svg">
        <rect width="175" height="54" rx="27" fill="#000" />
        <g>
          <defs>
            <linearGradient id="gp-a" x1="28" y1="10" x2="15" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00A0FF" />
              <stop offset=".3" stopColor="#00A1FF" />
              <stop offset=".5" stopColor="#00BEFF" />
              <stop offset=".7" stopColor="#00D2FF" />
              <stop offset="1" stopColor="#00DFFF" />
            </linearGradient>
            <linearGradient id="gp-b" x1="42" y1="27" x2="14" y2="27" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFE000" />
              <stop offset=".4" stopColor="#FFBD00" />
              <stop offset=".8" stopColor="#FFA500" />
              <stop offset="1" stopColor="#FF9C00" />
            </linearGradient>
            <linearGradient id="gp-c" x1="32" y1="30" x2="10" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF3A44" />
              <stop offset="1" stopColor="#C31162" />
            </linearGradient>
            <linearGradient id="gp-d" x1="12" y1="2" x2="25" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#32A071" />
              <stop offset=".1" stopColor="#2DA771" />
              <stop offset=".5" stopColor="#15CF74" />
              <stop offset=".8" stopColor="#06E775" />
              <stop offset="1" stopColor="#00F076" />
            </linearGradient>
          </defs>
          <path d="M16.1 12.6c-.4.4-.6 1-.6 1.8v25.2c0 .8.2 1.4.6 1.8l.1.1L30.4 27v-.3L16.1 12.6z" fill="url(#gp-a)" />
          <path d="M35.1 31.8l-4.7-4.7v-.3l4.7-4.7.1.1 5.6 3.2c1.6.9 1.6 2.4 0 3.3l-5.7 3.1z" fill="url(#gp-b)" />
          <path d="M35.2 31.7L30.4 27 16.1 41.4c.5.6 1.4.6 2.4.1l16.7-9.8" fill="url(#gp-c)" />
          <path d="M35.2 22.3L18.5 12.5c-1-.6-1.9-.5-2.4.1L30.4 27l4.8-4.7z" fill="url(#gp-d)" />
        </g>
        <g fill="#fff">
          <text x="50" y="21" fontSize="10" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="400" letterSpacing=".3">Disponible en</text>
          <text x="50" y="40" fontSize="18" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" letterSpacing=".2">Google Play</text>
        </g>
      </svg>
    </a>
  );
}
