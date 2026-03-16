import { Suspense } from "react";
import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TournamentList } from "@/components/tournaments/tournament-list";
import { TournamentFilters } from "@/components/tournaments/tournament-filters";

export const metadata = {
  title: "Tournaments",
  description: "Browse and join Mobile Legends tournaments on Arena Wars.",
};

export default function TournamentsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Tournaments</h1>
              <p className="text-muted-foreground mt-1">
                Find and join competitive tournaments
              </p>
            </div>
            <Link href="/tournaments/create">
              <Button>
                <Plus className="w-4 h-4" />
                Create Tournament
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 shrink-0">
            <TournamentFilters />
          </div>

          {/* Tournament List */}
          <div className="flex-1">
            <Suspense fallback={<TournamentListSkeleton />}>
              <TournamentList />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

function TournamentListSkeleton() {
  return (
    <div className="grid gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="glass rounded-2xl p-6 animate-pulse">
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-xl bg-muted" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-48 bg-muted rounded" />
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
