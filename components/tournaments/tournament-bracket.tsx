"use client";

import { Badge } from "@/components/ui/badge";
import type { Match, TournamentRegistration, Guild } from "@/lib/types";

interface TournamentBracketProps {
  matches: Match[];
  registrations: (TournamentRegistration & { guild?: Guild })[];
}

export function TournamentBracket({ matches, registrations }: TournamentBracketProps) {
  // Group matches by round
  const rounds = matches.reduce((acc, match) => {
    if (!acc[match.round]) {
      acc[match.round] = [];
    }
    acc[match.round].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  const roundNumbers = Object.keys(rounds).map(Number).sort((a, b) => a - b);

  const getTeamName = (teamId: string | null) => {
    if (!teamId) return "TBD";
    const reg = registrations.find((r) => r.id === teamId);
    return reg?.guild?.tag || reg?.team_name || "TBD";
  };

  const getRoundName = (round: number, totalRounds: number) => {
    const roundsFromEnd = totalRounds - round;
    if (roundsFromEnd === 0) return "Finals";
    if (roundsFromEnd === 1) return "Semi-Finals";
    if (roundsFromEnd === 2) return "Quarter-Finals";
    return `Round ${round}`;
  };

  if (roundNumbers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Bracket will be generated when the tournament starts.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-8 min-w-max p-4">
        {roundNumbers.map((round) => (
          <div key={round} className="flex flex-col">
            <h4 className="text-sm font-semibold text-muted-foreground mb-4 text-center">
              {getRoundName(round, roundNumbers.length)}
            </h4>
            <div className="flex flex-col gap-4 justify-around flex-1">
              {rounds[round].map((match) => (
                <div
                  key={match.id}
                  className="w-52 glass rounded-xl overflow-hidden"
                >
                  {/* Match Header */}
                  <div className="px-3 py-2 bg-muted/30 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Match {match.match_number}
                    </span>
                    <Badge
                      variant={
                        match.status === "live"
                          ? "live"
                          : match.status === "completed"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {match.status}
                    </Badge>
                  </div>

                  {/* Team 1 */}
                  <div
                    className={`flex items-center justify-between px-3 py-2 ${
                      match.winner_id === match.team1_id
                        ? "bg-success/10"
                        : ""
                    }`}
                  >
                    <span className="font-medium truncate">
                      {getTeamName(match.team1_id)}
                    </span>
                    <span
                      className={`font-bold ${
                        match.winner_id === match.team1_id
                          ? "text-success"
                          : ""
                      }`}
                    >
                      {match.team1_score}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-border" />

                  {/* Team 2 */}
                  <div
                    className={`flex items-center justify-between px-3 py-2 ${
                      match.winner_id === match.team2_id
                        ? "bg-success/10"
                        : ""
                    }`}
                  >
                    <span className="font-medium truncate">
                      {getTeamName(match.team2_id)}
                    </span>
                    <span
                      className={`font-bold ${
                        match.winner_id === match.team2_id
                          ? "text-success"
                          : ""
                      }`}
                    >
                      {match.team2_score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
