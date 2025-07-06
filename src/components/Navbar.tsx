import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-700">
              CleanModo
            </Link>
          </div>
          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="hover:text-blue-700 font-medium">
              Home
            </Link>
            <Link href="/blog" className="hover:text-blue-700 font-medium">
              Blog
            </Link>
            <Link href="/contact" className="hover:text-blue-700 font-medium">
              Contact
            </Link>
            <Link href="/login" className="hover:text-blue-700 font-medium">
              Login
            </Link>
            <Link href="/signup" className="hover:text-blue-700 font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
