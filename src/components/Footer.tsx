import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-8">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-gray-600 text-sm">
          © 2025 <span className="font-bold text-blue-700">CleanModo</span>. All rights reserved.
        </div>
        <div className="flex space-x-4">
          <Link href="/about" className="text-gray-600 hover:text-blue-700 text-sm">
            About Us
          </Link>
          <Link href="/privacy-policy" className="text-gray-600 hover:text-blue-700 text-sm">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-gray-600 hover:text-blue-700 text-sm">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
