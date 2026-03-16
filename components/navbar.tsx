"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad2,
  Trophy,
  Users,
  Swords,
  BarChart3,
  Menu,
  X,
  LogIn,
  User,
  LogOut,
  Settings,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/app/auth/actions";
import type { Profile } from "@/lib/types";

const navLinks = [
  { href: "/tournaments", label: "Tournaments", icon: Trophy },
  { href: "/guilds", label: "Guilds", icon: Users },
  { href: "/scrims", label: "Scrims", icon: Swords },
  { href: "/leaderboard", label: "Leaderboard", icon: BarChart3 },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function getUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();
        setUser(profile);
      }
      setLoading(false);
    }

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setUser(profile);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight hidden sm:block">
                Arena<span className="text-primary">Wars</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {loading ? (
                <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
              ) : user ? (
                <div className="flex items-center gap-3">
                  {/* Notifications */}
                  <Link
                    href="/notifications"
                    className="relative p-2 rounded-xl hover:bg-muted transition-colors"
                  >
                    <Bell className="w-5 h-5 text-muted-foreground" />
                  </Link>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-muted transition-colors"
                    >
                      <Avatar
                        src={user.avatar_url}
                        fallback={user.display_name || user.username || "U"}
                        size="sm"
                      />
                      <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
                        {user.display_name || user.username}
                      </span>
                    </button>

                    <AnimatePresence>
                      {profileMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setProfileMenuOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-56 glass rounded-xl p-2 z-50"
                          >
                            <div className="px-3 py-2 border-b border-border mb-2">
                              <p className="font-medium truncate">{user.display_name || user.username}</p>
                              <p className="text-xs text-muted-foreground">{user.mlbb_rank}</p>
                            </div>
                            <Link
                              href="/dashboard"
                              onClick={() => setProfileMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                            >
                              <User className="w-4 h-4" />
                              Dashboard
                            </Link>
                            <Link
                              href={`/profile/${user.username || user.id}`}
                              onClick={() => setProfileMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                            >
                              <User className="w-4 h-4" />
                              Profile
                            </Link>
                            <Link
                              href="/settings"
                              onClick={() => setProfileMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                            >
                              <Settings className="w-4 h-4" />
                              Settings
                            </Link>
                            <form action={signOut}>
                              <button
                                type="submit"
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                              >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                              </button>
                            </form>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm" className="hidden sm:flex">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up">
                    <Button size="sm">
                      <LogIn className="w-4 h-4 sm:hidden" />
                      <span className="hidden sm:inline">Get Started</span>
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-muted transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => {
                  const isActive = pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
                        isActive
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
