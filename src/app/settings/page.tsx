"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sun, Moon, Monitor } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  description: string | null;
  slug: string | null;
}

const themes = [
  { key: "light", label: "Light", icon: Sun },
  { key: "dark", label: "Dark", icon: Moon },
  { key: "system", label: "System", icon: Monitor },
] as const;

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data: Profile) => {
        setProfile(data);
        setName(data.name || "");
        setDescription(data.description || "");
        setImage(data.image || "");
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, image }),
    });

    if (res.ok) {
      const updated = await res.json();
      setProfile(updated);
      toast.success("Profile updated");
    } else {
      toast.error("Failed to update profile");
    }
    setSaving(false);
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const hasChanges =
    name !== (profile.name || "") ||
    description !== (profile.description || "") ||
    image !== (profile.image || "");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <h1 className="text-2xl font-semibold mb-8">Settings</h1>

        {/* Profile section */}
        <section>
          <h2 className="text-lg font-medium mb-4">Profile</h2>
          <div className="space-y-4">
            {/* Avatar preview */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                {image ? (
                  <AvatarImage src={image} alt={name} />
                ) : null}
                <AvatarFallback className="text-xl">
                  {name?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{name || "Anonymous"}</p>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            {/* Profile picture URL */}
            <div className="space-y-1.5">
              <Label htmlFor="image">Profile picture URL</Label>
              <Input
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description">Bio</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A short bio about you..."
                rows={3}
              />
            </div>

            <Button onClick={handleSave} disabled={saving || !hasChanges}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Appearance section */}
        <section>
          <h2 className="text-lg font-medium mb-4">Appearance</h2>
          <div className="flex gap-2">
            {themes.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors",
                  theme === key
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground/30"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
