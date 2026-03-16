import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Users, Trophy, DollarSign, Clock, ArrowLeft, Share2, MapPin, Gamepad2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency, formatDateTime, formatDate } from "@/lib/utils";
import { TournamentBracket } from "@/components/tournaments/tournament-bracket";
import { TournamentTeams } from "@/components/tournaments/tournament-teams";

interface TournamentPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TournamentPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: tournament } = await supabase
    .from("tournaments")
    .select("name, description")
    .eq("id", id)
    .single();

  return {
    title: tournament?.name || "Tournament",
    description: tournament?.description || "View tournament details",
  };
}

export default async function TournamentPage({ params }: TournamentPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: tournament, error } = await supabase
    .from("tournaments")
    .select(`
      *,
      organizer:profiles!organizer_id(id, username, display_name, avatar_url)
    `)
    .eq("id", id)
    .single();

  if (error || !tournament) {
    notFound();
  }

  // Get registrations
  const { data: registrations } = await supabase
    .from("tournament_registrations")
    .select(`
      *,
      guild:guilds(id, name, tag, logo_url),
      captain:profiles!captain_id(id, username, display_name, avatar_url)
    `)
    .eq("tournament_id", id)
    .order("registered_at", { ascending: true });

  // Get matches
  const { data: matches } = await supabase
    .from("matches")
    .select("*")
    .eq("tournament_id", id)
    .order("round", { ascending: true })
    .order("match_number", { ascending: true });

  const registeredTeams = registrations?.length || 0;
  const spotsLeft = tournament.max_teams - registeredTeams;

  const statusColors = {
    draft: "outline",
    registration: "success",
    ongoing: "live",
    completed: "secondary",
    cancelled: "destructive",
  } as const;

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary/20 via-secondary/10 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.20_0.12_195),transparent_70%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <Link href="/tournaments">
            <Button variant="glass" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        {/* Tournament Header */}
        <div className="glass rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Tournament Icon */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center shrink-0">
              <Trophy className="w-12 h-12 text-primary" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant={statusColors[tournament.status as keyof typeof statusColors]}>
                  {tournament.status === "registration"
                    ? "Open for Registration"
                    : tournament.status === "ongoing"
                    ? "In Progress"
                    : tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                </Badge>
                {tournament.entry_fee > 0 && (
                  <Badge variant="accent">Paid Entry</Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-2">{tournament.name}</h1>
              
              <p className="text-muted-foreground mb-4">
                {tournament.description || "No description provided."}
              </p>

              {/* Organizer */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Organized by</span>
                <Avatar
                  src={tournament.organizer?.avatar_url}
                  fallback={tournament.organizer?.display_name || "O"}
                  size="sm"
                />
                <span className="font-medium text-foreground">
                  {tournament.organizer?.display_name || tournament.organizer?.username || "Unknown"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 md:items-end shrink-0">
              {tournament.status === "registration" && spotsLeft > 0 && (
                <Link href={`/tournaments/${id}/register`}>
                  <Button size="lg" className="w-full md:w-auto">
                    Register Now
                  </Button>
                </Link>
              )}
              {spotsLeft <= 0 && tournament.status === "registration" && (
                <Badge variant="destructive" className="py-2 px-4">
                  Registration Full
                </Badge>
              )}
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bracket Section */}
            {(tournament.status === "ongoing" || tournament.status === "completed") && matches && matches.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6">Tournament Bracket</h2>
                <TournamentBracket matches={matches} registrations={registrations || []} />
              </div>
            )}

            {/* Registered Teams */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Registered Teams</h2>
                <span className="text-sm text-muted-foreground">
                  {registeredTeams}/{tournament.max_teams} teams
                </span>
              </div>
              <TournamentTeams registrations={registrations || []} />
            </div>

            {/* Rules Section */}
            {tournament.rules && (
              <div className="glass rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Rules & Guidelines</h2>
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="text-muted-foreground whitespace-pre-wrap">{tournament.rules}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tournament Info Card */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Tournament Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Gamepad2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Format</p>
                    <p className="font-medium">{tournament.format} - {tournament.bracket_type.replace("_", " ")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">
                      {tournament.start_date ? formatDateTime(tournament.start_date) : "TBD"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Team Size</p>
                    <p className="font-medium">{tournament.min_team_size}-{tournament.max_team_size} players</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Registration Ends</p>
                    <p className="font-medium">
                      {tournament.registration_end ? formatDateTime(tournament.registration_end) : "TBD"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Prize Pool Card */}
            <div className="glass rounded-2xl p-6 border border-accent/30">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent" />
                Prize Pool
              </h3>
              <p className="text-4xl font-bold text-accent mb-4">
                {formatCurrency(tournament.prize_pool)}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">1</span>
                    1st Place
                  </span>
                  <span className="font-semibold">
                    {formatCurrency((tournament.prize_pool * (tournament.prize_distribution?.["1st"] || 60)) / 100)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">2</span>
                    2nd Place
                  </span>
                  <span className="font-semibold">
                    {formatCurrency((tournament.prize_pool * (tournament.prize_distribution?.["2nd"] || 30)) / 100)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">3</span>
                    3rd Place
                  </span>
                  <span className="font-semibold">
                    {formatCurrency((tournament.prize_pool * (tournament.prize_distribution?.["3rd"] || 10)) / 100)}
                  </span>
                </div>
              </div>
            </div>

            {/* Entry Fee Card */}
            {tournament.entry_fee > 0 && (
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold mb-2">Entry Fee</h3>
                <p className="text-2xl font-bold text-foreground mb-2">
                  {formatCurrency(tournament.entry_fee)}
                </p>
                <p className="text-sm text-muted-foreground">per team</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
