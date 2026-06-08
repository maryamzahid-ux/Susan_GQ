// Real BIZremedies logo from bizremedies.com
export const LOGO_URL = "https://bizremedies.com/wp-content/uploads/2025/05/cropped-Siteidentity-53x53.jpg";

export function SidebarLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <img src={LOGO_URL} alt="BIZremedies"
        style={{ width: 36, height: 36, borderRadius: 7, objectFit: "cover", flexShrink: 0 }}
        onError={(e) => { e.target.style.display = "none"; }}
      />
      <div>
        <p style={{ fontFamily: "'Playfair Display',serif", color: "#FFFFFF", fontSize: 14, fontWeight: 700, lineHeight: 1.1 }}>GQ Platform</p>
        <p style={{ color: "#D4A847", fontSize: 10 }}>Gut Intelligence® by Susan K. Wehrley</p>
      </div>
    </div>
  );
}

export function LandingLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
      <img src={LOGO_URL} alt="BIZremedies"
        style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
        onError={(e) => { e.target.style.display = "none"; }}
      />
      <div>
        <p style={{ fontFamily: "'Playfair Display',serif", color: "#FFFFFF", fontSize: 17, fontWeight: 700, lineHeight: 1.1 }}>GQ Platform</p>
        <p style={{ color: "#D4A847", fontSize: 10 }}>Gut Intelligence® by Susan K. Wehrley</p>
      </div>
    </div>
  );
}
