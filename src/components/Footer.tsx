export default function Footer() {
  return (
    <footer style={{
      padding: "1rem 2rem",
      background: "#222",
      color: "#fff",
      textAlign: "center",
      marginTop: "2rem"
    }}>
      <div>
        &copy; {new Date().getFullYear()} CleaningPlan. All rights reserved.
      </div>
      <div style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
        <a href="/privacy-policy" style={{ color: "#fff", textDecoration: "underline" }}>Privacy Policy</a>
        {" | "}
        <a href="/terms" style={{ color: "#fff", textDecoration: "underline" }}>Terms of Service</a>
      </div>
    </footer>
  );
}
