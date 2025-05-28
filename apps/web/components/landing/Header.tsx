"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User } from "@workspace/supabase/types";
import { Menu, X, ExternalLink } from "lucide-react";
import { createClient } from "@workspace/supabase/client/client";
import { signOutAction } from "@workspace/supabase/lib/auth-actions";
import { UserDropdownMenu } from "./UserDropdownMenu";
import { Tenant, TenantConfig } from "@workspace/supabase/types";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@workspace/ui/components/button";

const nav_items = [
  {
    "ext": true,
    "href": "/docs/getting-started",
    "label": "Getting Started"
  }
];

// A reusable hook to handle clicks outside a referenced element
function useOnClickOutside<T extends HTMLElement>(ref: React.RefObject<T | null>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
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
        className="w-full bg-background border-t absolute top-full left-0 z-50"
      >
        <div className="container px-8 py-4 flex flex-col gap-4 border-b">
          {nav_items && nav_items.map((item, index) =>
            item.ext ? (
              <Link
                key={index}
                href={item.href || "/"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex items-center text-lg font-medium transition-colors hover:text-primary"
              >
                {item.label || "no label"}
                <ExternalLink className="ml-1" size={12} />
              </Link>
            ) : (
              <Link
                key={index}
                href={item.href || "/"}
                onClick={onClose}
                className="text-lg font-medium transition-colors hover:text-primary"
              >
                {item.label || "no label"}
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
      const session = data.session;
      setUser(session?.user ? (session.user as unknown as User) : null);
      setIsLoggedIn(!!session?.user);
    };

    getSessionAndUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? (session.user as unknown as User) : null);
      setIsLoggedIn(!!session?.user);
      if (session?.user) {
        router.refresh();
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleLogoutClick = async () => {
    setIsLoggedIn(false);
    await signOutAction();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-20 w-full flex flex-col items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-8 flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/logoipsum-5.svg" 
              alt="Logo" 
              width={64} height={64} 
            />
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 items-center" aria-label="Desktop Navigation">
            {nav_items.map((item, index) =>
              item.ext ? (
                <Link
                  key={index}
                  href={item.href || "/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-row text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.label || "no label"}
                  <ExternalLink className="ml-1" size={12} />
                </Link>
              ) : (
                <Link
                  key={index}
                  href={item.href || "/"}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.label || "no label"}
                </Link>
              )
            )}
          </nav>
          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-200"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <button className="border border-muted-foreground px-3 py-1 text-sm rounded hover:bg-muted">
                    Dashboard
                  </button>
                </Link>
                <UserDropdownMenu userRole={userRole} user={user} onLogout={handleLogoutClick} />
              </div>
            ) : (
              <Link href="/sign-in">
                <Button className="cursor-pointer bg-primary text-primary-foreground px-3 py-1 rounded">Login</Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
      {/* Mobile Navigation Menu Overlay */}
      {mobileMenuOpen && <MobileMenu onClose={() => setMobileMenuOpen(false)} />}
    </header>
  );
}
