import { useState, useSyncExternalStore } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { signOut } from "@/lib/auth/client";
import { hasGateSessionMarker } from "@/lib/auth/gate-session-marker";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { Avatar } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/lib/api";
import { cn } from "@/lib/utils";

const subscribeToNothing = () => () => {};
const noGateOnServer = () => false;

export function AccountMenu() {
  const user = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const gateSession = useSyncExternalStore(
    subscribeToNothing,
    hasGateSessionMarker,
    noGateOnServer,
  );
  const profile = useQuery({
    queryKey: ["me"],
    queryFn: () => getMyProfile(),
    enabled: Boolean(user),
  });

  if (!user) return null;

  const handle = profile.data?.handle;
  const name = profile.data?.displayName ?? user.displayName ?? "Account";
  const avatar = profile.data?.avatarUrl ?? user.profileImageUrl;

  return (
    <div className="relative">
      <button
        type="button"
        className="flex h-11 items-center gap-2 rounded-xl border border-line bg-surface pl-1.5 pr-3 transition-[background-color,border-color] duration-150 hover:bg-raised"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Avatar name={name} src={avatar} size="sm" />
        <span className="hidden max-w-28 truncate text-sm font-medium sm:inline">
          {handle ? `@${handle}` : name}
        </span>
        <ChevronDown className={cn("size-4 text-muted transition-transform duration-150", open && "rotate-180")} />
      </button>
      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Chiudi menu"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 z-50 mt-2 w-52 origin-top-right rounded-xl border border-line bg-surface p-1.5 shadow-soft"
          >
            {handle ? (
              <Link
                to="/u/$handle"
                params={{ handle }}
                className="block rounded-md px-3 py-2.5 text-sm text-fg hover:bg-raised"
                onClick={() => setOpen(false)}
              >
                Il tuo profilo
              </Link>
            ) : null}
            {!gateSession ? (
              <button
                type="button"
                role="menuitem"
                disabled={signingOut}
                className="block w-full rounded-md px-3 py-2.5 text-left text-sm text-muted hover:bg-raised hover:text-fg disabled:opacity-50"
                onClick={() => {
                  setSigningOut(true);
                  void signOut().catch(() => setSigningOut(false));
                }}
              >
                {signingOut ? "Uscita…" : "Esci"}
              </button>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
