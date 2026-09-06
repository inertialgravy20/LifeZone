import { Link } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AccountMenu } from "@/components/account-menu";
import { Skeleton } from "@/components/ui/skeleton";

export function AppHeader({ solid = false }: { solid?: boolean }) {
  const { user, isPending } = useCurrentUserState();

  return (
    <header
      className={
        solid
          ? "sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur-md"
          : "absolute inset-x-0 top-0 z-30"
      }
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl italic tracking-tight text-fg">Replay</span>
          <span className="hidden text-xs uppercase tracking-[0.18em] text-subtle sm:inline">
            bacheca
          </span>
        </Link>
        {isPending ? (
          <Skeleton className="h-11 w-28 rounded-xl" />
        ) : user ? (
          <AccountMenu />
        ) : (
          <Link
            to="/login"
            className="inline-flex h-11 items-center rounded-lg border border-line-strong px-4 text-sm font-medium text-fg transition-colors duration-150 hover:bg-raised"
          >
            Entra
          </Link>
        )}
      </div>
    </header>
  );
}
