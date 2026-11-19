import {ImageResponse} from "next/og";

function GoldenDreamMark() {
  return <svg width="250" height="250" viewBox="0 0 64 64" aria-label="Golden Dream Safaris">
    <defs>
      <radialGradient id="share-sky" cx="50%" cy="58%" r="62%">
        <stop offset="0" stopColor="#fff5a8"/>
        <stop offset=".32" stopColor="#ffd15a"/>
        <stop offset=".68" stopColor="#ef8a33"/>
        <stop offset="1" stopColor="#a94b17"/>
      </radialGradient>
      <linearGradient id="share-ring" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffd36b"/>
        <stop offset=".55" stopColor="#ef8a33"/>
        <stop offset="1" stopColor="#a74a18"/>
      </linearGradient>
      <clipPath id="share-sunset"><circle cx="32" cy="32" r="22"/></clipPath>
    </defs>
    <circle cx="32" cy="32" r="31" fill="#0b0907"/>
    <circle cx="32" cy="32" r="24" fill="none" stroke="url(#share-ring)" strokeWidth="2"/>
    <circle cx="32" cy="32" r="22" fill="url(#share-sky)"/>
    <g clipPath="url(#share-sunset)" fill="#17100b">
      <path d="M8 43.5c7-1.8 13.5-2.6 20.1-2.3 8.2.3 14.3 2 27.9 5.8V58H8z"/>
      <path d="M11 29.4c3.5-4.4 8.8-6 15.7-4.8 2.8-3.8 7.4-5.2 12.8-2.7 5.6-1.2 10.7 1.2 13.5 5.6-4.8 2.5-10.3 2.8-16.1 1.3-4 3.5-11.9 4.2-17.6 1.6-3 .4-5.8.1-8.3-1z"/>
      <path d="M30.4 46.8l1.5-12.2-5.1-4.7 1.5-1.5 4.2 3.4.3-6.3h2l.2 7 5.6-4 1.4 1.7-6.3 5.4 1.9 11.2z"/>
      <path d="M7 45c7.7-1.5 14.2-1.9 21-1.1 7.5.8 14.2 2.8 29 7.3v8.2H7z" opacity=".9"/>
    </g>
    <circle cx="32" cy="32" r="29" fill="none" stroke="#f5b34d" strokeOpacity=".35"/>
  </svg>;
}

export function createSocialShareCard() {
  return new ImageResponse(
    <div style={{
      position: "relative",
      display: "flex",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      background: "#0b0907",
      color: "#ffffff",
      fontFamily: "Arial, sans-serif",
    }}>
      <div style={{position: "absolute", top: -230, right: -130, width: 720, height: 720, borderRadius: "50%", background: "#f68b2c", opacity: 0.92}}/>
      <div style={{position: "absolute", right: 130, bottom: -290, width: 600, height: 600, borderRadius: "50%", border: "2px solid rgba(255,255,255,.16)"}}/>
      <div style={{position: "absolute", top: 76, right: 86, display: "flex", alignItems: "center", justifyContent: "center", width: 318, height: 318, borderRadius: "50%", background: "rgba(11,9,7,.96)", boxShadow: "0 28px 80px rgba(0,0,0,.35)"}}>
        <GoldenDreamMark/>
      </div>
      <div style={{display: "flex", flexDirection: "column", justifyContent: "center", width: 730, padding: "72px 0 72px 78px"}}>
        <div style={{display: "flex", color: "#f68b2c", fontSize: 25, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase"}}>Local safari company · Arusha</div>
        <div style={{display: "flex", marginTop: 26, fontSize: 72, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3}}>Golden Dream<br/>Safaris</div>
        <div style={{display: "flex", marginTop: 28, color: "#ded8d0", fontSize: 30, lineHeight: 1.35}}>Wildlife safaris, Kilimanjaro treks<br/>and tailor-made Tanzania journeys.</div>
      </div>
    </div>,
    {width: 1200, height: 630},
  );
}
