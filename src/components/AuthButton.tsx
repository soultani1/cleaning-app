"use client";

import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // New import
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, UserCircle } from 'lucide-react'; // For icons

const AuthButton = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); 
  };

  // While checking the auth state, show a placeholder for better UX
  if (loading) {
    return <div className="h-9 w-32 bg-gray-200 rounded-lg animate-pulse"></div>;
  }

  // If a user is logged in
  if (user) {
    const userInitial = user.email ? user.email.charAt(0).toUpperCase() : <UserCircle size={18} />;
    
    return (
      <div className="flex items-center gap-3">
        {/* Show full email on medium screens and up */}
        <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.email}</span>
        
        {/* Show Avatar on small screens */}
        <Avatar className="h-9 w-9 sm:hidden">
            <AvatarFallback className="bg-gray-200 text-gray-600 font-semibold">{userInitial}</AvatarFallback>
        </Avatar>

        {/* Logout button is now an icon for a cleaner look */}
        <Button onClick={handleLogout} variant="outline" size="icon" className="h-9 w-9 shrink-0">
          <LogOut size={16} />
        </Button>
      </div>
    );
  }

  // If no user is logged in (guest)
  return (
    <div className="flex items-center gap-2">
      <Link href="/login" passHref>
        {/* Changed variant to default with custom colors for perfect alignment */}
        <Button variant="outline" size="sm" className="bg-white border-gray-300">
          Login
        </Button>
      </Link>
      <Link href="/signup" passHref>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          Sign Up
        </Button>
      </Link>
    </div>
  );
};

export default AuthButton;
