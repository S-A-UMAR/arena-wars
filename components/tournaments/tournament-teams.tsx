"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import type { TournamentRegistration, Guild, Profile } from "@/lib/types";

interface TournamentTeamsProps {
  registrations: (TournamentRegistration & {
    guild?: Guild;
    captain?: Profile;
  })[];
}

export function TournamentTeams({ registrations }: TournamentTeamsProps) {
  if (registrations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No teams have registered yet.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Be the first to register!
        </p>
      </div>
    );
  }

  const statusColors = {
    pending: "outline",
    confirmed: "success",
    checked_in: "primary",
    eliminated: "destructive",
    winner: "accent",
  } as const;

  return (
    <div className="space-y-3">
      {registrations.map((reg, index) => (
        <div
          key={reg.id}
          className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          {/* Seed Number */}
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold shrink-0">
            {reg.seed || index + 1}
          </div>

          {/* Team Logo */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
            {reg.guild?.logo_url ? (
              <Avatar src={reg.guild.logo_url} fallback={reg.guild.tag} size="lg" />
            ) : (
              <span className="text-lg font-bold">{reg.guild?.tag || reg.team_name.slice(0, 3).toUpperCase()}</span>
            )}
          </div>

          {/* Team Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link
                href={reg.guild ? `/guilds/${reg.guild.id}` : "#"}
                className="font-semibold hover:text-primary transition-colors truncate"
              >
                {reg.team_name}
              </Link>
              {reg.guild && (
                <span className="text-xs text-muted-foreground">[{reg.guild.tag}]</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Captain:</span>
              <span className="truncate">
                {reg.captain?.display_name || reg.captain?.username || "Unknown"}
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <Badge variant={statusColors[reg.status]}>
              {reg.status === "checked_in" ? "Checked In" : reg.status}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(reg.registered_at)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
