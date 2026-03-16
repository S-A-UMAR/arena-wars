import { createClient } from "@/lib/supabase/server";
import { TournamentCard } from "./tournament-card";
import type { Tournament } from "@/lib/types";

export async function TournamentList() {
  const supabase = await createClient();
  
  const { data: tournaments, error } = await supabase
    .from("tournaments")
    .select(`
      *,
      organizer:profiles!organizer_id(id, username, display_name, avatar_url),
      registrations:tournament_registrations(count)
    `)
    .in("status", ["registration", "ongoing"])
    .order("start_date", { ascending: true });

  if (error) {
    console.error("Error fetching tournaments:", error);
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load tournaments. Please try again.</p>
      </div>
    );
  }

  if (!tournaments || tournaments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <span className="text-2xl">🏆</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">No Tournaments Yet</h3>
        <p className="text-muted-foreground mb-4">
          Be the first to create a tournament and start competing!
        </p>
      </div>
    );
  }

  // Transform the data to match our types
  const transformedTournaments = tournaments.map((t) => ({
    ...t,
    registered_teams: t.registrations?.[0]?.count || 0,
  })) as (Tournament & { registered_teams: number })[];

  return (
    <div className="grid gap-6">
      {transformedTournaments.map((tournament) => (
        <TournamentCard key={tournament.id} tournament={tournament} />
      ))}
    </div>
  );
}
