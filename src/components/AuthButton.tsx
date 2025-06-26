"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import supabase from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

/**
 * AuthButton component that dynamically displays login/signup or logout controls
 * based on the user's authentication state
 */
export default function AuthButton() {
  const { user } = useAuth();
  const router = useRouter();

  /**
   * Handle user logout
   */
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.refresh(); // Refresh the page to update auth state across the app
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // If the user is logged in, show their email and a logout button
  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700 hidden sm:inline">
          {user.email}
        </span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    );
  }

  // If the user is not logged in, show login and signup buttons
  return (
    <div className="flex items-center gap-2">
      <Link href="/login">
        <Button variant="outline" size="sm">
          Login
        </Button>
      </Link>
      <Link href="/signup">
        <Button size="sm">
          Sign Up
        </Button>
      </Link>
    </div>
  );
}