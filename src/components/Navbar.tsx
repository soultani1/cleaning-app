// Navbar.tsx
"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, LogOut, User, LayoutDashboard, Menu } from "lucide-react";

export default function Navbar() {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  // جلب صورة البروفايل
  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        const { supabase } = await import("@/lib/supabaseClient");
        let { data } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", user.id)
          .single();
        setAvatarUrl(data?.avatar_url ?? null);
      }
    }
    fetchProfile();
  }, [user]);

  function handleLogout() {
    import("@/lib/supabaseClient").then(({ supabase }) => {
      supabase.auth.signOut().then(() => {
        window.location.href = "/";
      });
    });
  }

  // اغلاق المنيو عند الضغط خارجها
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("#profile-menu")) setMenuOpen(false);
    };
    if (menuOpen) window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <nav className="bg-white border-b shadow-sm z-30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-700">
            CleanModo
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-blue-700 font-medium">
              Home
            </Link>
            <Link href="/blog" className="hover:text-blue-700 font-medium">
              Blog
            </Link>
            <Link href="/contact" className="hover:text-blue-700 font-medium">
              Contact
            </Link>
            {!user && (
              <>
                <Link href="/login" className="hover:text-blue-700 font-medium">
                  Login
                </Link>
                <Link href="/signup" className="hover:text-blue-700 font-medium">
                  Sign Up
                </Link>
              </>
            )}
            {user && (
              <div className="relative" id="profile-menu">
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center space-x-1 group"
                  aria-label="Profile menu"
                >
                  <Avatar className="size-8 border-2 border-blue-100 group-hover:ring-2 group-hover:ring-blue-200">
                    <AvatarImage
                      src={avatarUrl || "/default-avatar.png"}
                      alt={user.email || "Profile"}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {user.email?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-4 h-4 text-blue-700 group-hover:rotate-180 transition" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border shadow-lg rounded-xl overflow-hidden animate-fade-in-up z-50">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 hover:bg-blue-50 text-gray-800"
                      onClick={() => setMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" /> Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 hover:bg-blue-50 text-gray-800"
                      onClick={() => setMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 hover:bg-red-50 text-red-700"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden block"
            onClick={() => setMobileMenu((v) => !v)}
          >
            <Menu className="w-7 h-7 text-blue-700" />
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden bg-white shadow-lg border-b p-4 space-y-4 absolute w-full left-0 z-40">
          <Link href="/" className="block font-medium" onClick={() => setMobileMenu(false)}>Home</Link>
          <Link href="/blog" className="block font-medium" onClick={() => setMobileMenu(false)}>Blog</Link>
          <Link href="/contact" className="block font-medium" onClick={() => setMobileMenu(false)}>Contact</Link>
          {!user && (
            <>
              <Link href="/login" className="block font-medium" onClick={() => setMobileMenu(false)}>Login</Link>
              <Link href="/signup" className="block font-medium" onClick={() => setMobileMenu(false)}>Sign Up</Link>
            </>
          )}
          {user && (
            <>
              <Link href="/profile" className="block font-medium" onClick={() => setMobileMenu(false)}>Profile</Link>
              <Link href="/dashboard" className="block font-medium" onClick={() => setMobileMenu(false)}>Dashboard</Link>
              <button
                onClick={handleLogout}
                className="block text-left font-medium text-red-600 w-full mt-2"
              >Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}