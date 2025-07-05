import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={{
      padding: "1rem 2rem",
      background: "#f6f6f6",
      display: "flex",
      gap: "2rem",
      justifyContent: "center",
      borderBottom: "1px solid #eee"
    }}>
      <Link href="/">Home</Link>
      <Link href="/about">About Us</Link>
      <Link href="/blog">Blog</Link>
      <Link href="/contact">Contact</Link>
      <Link href="/privacy-policy">Privacy Policy</Link>
      <Link href="/terms">Terms of Service</Link>
      <Link href="/login">Login</Link>
      <Link href="/signup">Sign Up</Link>
    </nav>
  );
}
