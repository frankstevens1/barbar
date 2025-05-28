"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@workspace/ui/components/command";
import { LogOut, Moon, Sun, User2 as User2Icon, Search } from "lucide-react";
import ThemeSwitcher from "./theme-switcher";
import { User } from "@workspace/supabase/types";
import { useTenant } from "@workspace/supabase/hooks/use-tenant";

interface UserDropdownMenuProps {
  onLogout: () => void;
  user: User | null;
  userRole: string | null; // e.g., "df_admin", "df_user", etc.
}

export function UserDropdownMenu({ onLogout, user, userRole }: UserDropdownMenuProps) {
  const { tenants, loadingTenants, fetchTenants, selectTenant } = useTenant();
  const [searchTerm, setSearchTerm] = useState("");
  const [tenantDialogOpen, setTenantDialogOpen] = useState(false);

  // If user has an admin-type role and opens the dialog, fetch tenants
  useEffect(() => {
    if (tenantDialogOpen && userRole?.includes("admin")) {
      fetchTenants();
    }
  }, [tenantDialogOpen, userRole, fetchTenants]);

  // Filter the tenants by name, case-insensitive
  const filteredTenants = tenants.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleSelectTenant(tenantId: string) {
    await selectTenant(tenantId);
    setTenantDialogOpen(false);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="border-2 border-muted-foreground">
            <AvatarImage src={`https://api.dicebear.com/9.x/identicon/svg?seed=${user?.id}`} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <div className="flex items-center gap-4 pr-1">
            <div>
              <DropdownMenuLabel className="py-0 pt-1">
                {user?.user_metadata?.name || "User"}
              </DropdownMenuLabel>
              <DropdownMenuLabel className="font-extralight py-0 pb-1 text-xs">
                {user?.email}
              </DropdownMenuLabel>
            </div>
          </div>

          <DropdownMenuSeparator />

          <Link href="/dashboard/account">
            <DropdownMenuItem className="hover:cursor-pointer h-10">
              <User2Icon size={18} />
              <span className="font-light">Account</span>
            </DropdownMenuItem>
          </Link>

          <ThemeSwitcher>
            {({ resolvedTheme }) => (
              <DropdownMenuItem className="hover:cursor-pointer h-10 w-full">
                {resolvedTheme === "light" ? <Sun size={18} /> : <Moon size={18} />}
                <span className="font-light">Change Theme</span>
              </DropdownMenuItem>
            )}
          </ThemeSwitcher>

          {userRole?.includes("admin") && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="hover:cursor-pointer h-10"
                onClick={() => setTenantDialogOpen(true)}
              >
                <Search size={18} />
                <span className="font-light">Switch Tenant</span>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={onLogout} className="hover:cursor-pointer">
            <LogOut size={16} />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog for searching & selecting tenants */}
      <Dialog open={tenantDialogOpen} onOpenChange={setTenantDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Tenant</DialogTitle>
          </DialogHeader>

          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search tenant by name..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              <CommandEmpty>
                {loadingTenants ? "Loading tenants..." : "No tenants found."}
              </CommandEmpty>
              {!loadingTenants &&
                filteredTenants.map((tenant) => (
                  <CommandItem
                    key={tenant.id}
                    onSelect={() => handleSelectTenant(tenant.id)}
                  >
                    {tenant.name}
                  </CommandItem>
                ))}
            </CommandList>
          </Command>

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setTenantDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
