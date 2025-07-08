"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  // Fetch profile from Supabase
  useEffect(() => {
    if (!user) return;
    async function fetchProfile() {
      const { supabase } = await import("@/lib/supabaseClient");
      const { data } = await supabase
        .from("profiles")
        .select("name, avatar_url")
        .eq("id", user.id)
        .single();
      setName(data?.name ?? "");
      setAvatarUrl(data?.avatar_url ?? "");
      setEmail(user.email ?? "");
    }
    fetchProfile();
  }, [user]);

  // Handle avatar change
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setLoading(true);
    try {
      const { supabase } = await import("@/lib/supabaseClient");
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}.${fileExt}`;
      // upload to storage
      let { error } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true });
      if (error) throw error;
      // get public url
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      // update profile in db
      await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", user.id);
      setAvatarUrl(data.publicUrl);
      setMessage({ type: "success", text: "Profile photo updated!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to upload avatar." });
    } finally {
      setLoading(false);
    }
  };

  // Save changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { supabase } = await import("@/lib/supabaseClient");
      const updates = { name };
      let { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
      if (error) throw error;
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Update failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-5">
            {/* Avatar & Upload */}
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="size-20 shadow">
                <AvatarImage src={avatarUrl || "/default-avatar.png"} alt="avatar" />
                <AvatarFallback>{user?.email?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInput}
                onChange={handleAvatarChange}
              />
              <Button
                type="button"
                variant="secondary"
                className="mt-1"
                onClick={() => fileInput.current?.click()}
                disabled={loading}
              >
                Change Photo
              </Button>
            </div>
            {/* Fields */}
            <div>
              <label className="block font-medium mb-1">Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block font-medium mb-1">Email</label>
              <Input value={email} disabled />
            </div>
            {/* Message */}
            {message && (
              <Alert className={message.type === "error" ? "bg-red-50" : "bg-green-50"}>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-gray-400 mx-auto">You can update your information anytime.</p>
        </CardFooter>
      </Card>
    </div>
  );
}