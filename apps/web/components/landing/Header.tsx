"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ExternalLink } from "lucide-react";
import { createClient } from "@workspace/supabase/client/client";
import { signOutAction } from "@workspace/supabase/lib/auth-actions";
import { UserDropdownMenu } from "./UserDropdownMenu";
import { Tenant, TenantConfig, User } from "@workspace/supabase/types";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@workspace/ui/components/button";

const navOff = true; // Placeholder for future use
const nav_items = [
  { ext: true, href: "/docs/getting-started", label: "Getting Started" },
  { href: "/roadmap", label: "Roadmap" },
];

function useOnClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

interface MobileMenuProps {
  onClose: () => void;
}

function MobileMenu({ onClose }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(menuRef, onClose);

  return (
    <AnimatePresence>
      <motion.nav
        ref={menuRef}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        aria-label="Mobile Navigation"
        className="w-full bg-background/80 backdrop-blur absolute top-full left-0 z-50"
      >
        <div className="px-8 py-4 flex flex-col gap-4 border-b">
          {!navOff && nav_items.map((item, idx) =>
            item.ext ? (
              <Link
                key={idx}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex items-center text-lg font-medium hover:text-primary"
              >
                {item.label}
                <ExternalLink className="ml-1" size={12} />
              </Link>
            ) : (
              <Link
                key={idx}
                href={item.href}
                onClick={onClose}
                className="text-lg font-medium hover:text-primary"
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </motion.nav>
    </AnimatePresence>
  );
}

interface HeaderProps {
  tenant: Tenant;
  userRole: string | null;
  tenantConfig: TenantConfig;
}

export default function Header({ tenant, userRole, tenantConfig }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getSessionAndUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ? (data.session.user as unknown as User) : null);
      setIsLoggedIn(!!data.session?.user);
    };
    getSessionAndUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? (session.user as unknown as User) : null);
      setIsLoggedIn(!!session?.user);
      if (session?.user) router.refresh();
    });
    return () => authListener?.subscription.unsubscribe();
  }, [supabase, router]);

  const handleLogoutClick = async () => {
    setIsLoggedIn(false);
    await signOutAction();
  };

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto px-8 flex h-16 items-center justify-between">
          <div className="flex gap-6 md:gap-10 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logoipsum-2.svg" alt="Logo" width={44} height={44} />
            </Link>
            <nav className="hidden md:flex gap-6 items-center" aria-label="Desktop Navigation">
              {!navOff && nav_items.map((item, idx) =>
                item.ext ? (
                  <Link
                    key={idx}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm font-medium hover:text-primary"
                  >
                    {item.label}
                    <ExternalLink className="ml-1" size={12} />
                  </Link>
                ) : (
                  <Link
                    key={idx}
                    href={item.href}
                    className="text-sm font-medium hover:text-primary"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>
            <Button
              className="md:hidden"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              variant={"outline"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant={"default"} size={"sm"}>
                    Dashboard
                  </Button>
                </Link>
                <UserDropdownMenu userRole={userRole} user={user} onLogout={handleLogoutClick} />
              </div>
            ) : (
              <Link href="/sign-in">
                <Button className="bg-primary text-primary-foreground px-3 py-1 rounded">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
        {mobileMenuOpen && <MobileMenu onClose={() => setMobileMenuOpen(false)} />}
      </header>
      {/* spacer to offset fixed header height */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
}