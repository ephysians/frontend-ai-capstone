export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
        <p className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} Emmanuel Chukwukere Obinna
        </p>
        <a
          href="https://internship.flyrank.ai/verify?id=E0EE4D3E-334F-4EA8-A625-33E7C6F49642&first_name=Obinna"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Verify Emmanuel Chuks's FlyRank AI Internship credential E0EE4D3E-334F-4EA8-A625-33E7C6F49642"
          style={{
            boxSizing: "border-box",
            margin: "0",
            padding: "0",
            border: "0",
            background: "none",
            textDecoration: "none",
            fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
            fontStyle: "normal",
            lineHeight: "1.25",
            textTransform: "none",
            float: "none",
            WebkitFontSmoothing: "antialiased",
            display: "inline-block",
            width: "164px",
            height: "164px",
          }}
        >
          <svg
            width="164"
            height="164"
            viewBox="0 0 164 164"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block", opacity: "1", transform: "none", maxWidth: "none" }}
          >
            <circle cx="82" cy="82" r="81" fill="#FFFFFF" stroke="#DDE4E7" strokeWidth="1" />
            <circle cx="82" cy="82" r="65" fill="none" stroke="#E4EAED" strokeWidth="1" />
            <path id="fr-e0ee4d3e-334f-4ea8-a625-33e7c6f49642-top" d="M12.4 82A69.6 69.6 0 0 1 151.6 82" fill="none" />
            <path id="fr-e0ee4d3e-334f-4ea8-a625-33e7c6f49642-btm" d="M5.6 82A76.4 76.4 0 0 0 158.4 82" fill="none" />
            <text fontFamily="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" fontSize="9" fontWeight="700" letterSpacing="1.9" fill="rgba(5,31,33,0.5)">
              <textPath href="#fr-e0ee4d3e-334f-4ea8-a625-33e7c6f49642-top" startOffset="50%" textAnchor="middle">FLYRANK AI INTERNSHIP</textPath>
            </text>
            <text fontFamily="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" fontSize="9" fontWeight="700" letterSpacing="1.6" fill="#1A7A4A">
              <textPath href="#fr-e0ee4d3e-334f-4ea8-a625-33e7c6f49642-btm" startOffset="50%" textAnchor="middle">E0EE4D3E-334F-4EA8-A625-33E7C6F49642</textPath>
            </text>
            <svg x="68" y="48" width="28" height="38" viewBox="26 18 44 60" fill="none" style={{ opacity: "1", transform: "none" }}>
              <path d="M28.2354 74.2202V67.9039C29.6419 68.4369 31.3724 68.7055 33.4311 68.7055C35.3235 68.7055 36.8153 68.2396 37.8979 67.3079C38.9805 66.3762 39.9566 64.8695 40.8218 62.792L42.6887 58.3139L29.8976 29.2879C35.0038 29.2879 39.6028 32.3307 41.5294 36.9893L47.0746 50.3985L56.0126 28.6038C57.9221 23.9452 62.5168 20.894 67.6187 20.894L50.0795 63.5936C48.4556 67.5933 46.5205 70.5102 44.2743 72.3484C42.0281 74.1867 39.1169 75.1058 35.5451 75.1058C32.6212 75.1058 30.1875 74.812 28.2354 74.2244V74.2202Z" fill="#1A7A4A" />
            </svg>
            <text x="82" y="103" textAnchor="middle" fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif" fontSize="13" fontWeight="600" fill="#051F21">Verified</text>
            <text x="82" y="117" textAnchor="middle" fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif" fontSize="9.5" fill="rgba(5,31,33,0.5)">Front-end AI Engineering</text>
          </svg>
        </a>
      </div>
    </footer>
  );
}
