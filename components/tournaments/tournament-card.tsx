"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Users, Trophy, DollarSign, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { Tournament, Profile } from "@/lib/types";

interface TournamentCardProps {
  tournament: Tournament & {
    registered_teams?: number;
    organizer?: Profile;
  };
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const spotsLeft = tournament.max_teams - (tournament.registered_teams || 0);
  const isAlmostFull = spotsLeft <= 3 && spotsLeft > 0;
  const isFull = spotsLeft <= 0;

  const statusColors = {
    draft: "outline",
    registration: "success",
    ongoing: "live",
    completed: "secondary",
    cancelled: "destructive",
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Tournament Image */}
          <div className="w-full md:w-48 h-32 md:h-auto rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
            <Trophy className="w-12 h-12 text-primary" />
          </div>

          {/* Tournament Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={statusColors[tournament.status]}>
                    {tournament.status === "registration"
                      ? "Open for Registration"
                      : tournament.status === "ongoing"
                      ? "In Progress"
                      : tournament.status}
                  </Badge>
                  {tournament.entry_fee > 0 && (
                    <Badge variant="accent">
                      <DollarSign className="w-3 h-3 mr-1" />
                      Entry Fee
                    </Badge>
                  )}
                </div>
                <h3 className="text-xl font-bold truncate">{tournament.name}</h3>
              </div>
            </div>

            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {tournament.description || "No description provided."}
            </p>

            {/* Tournament Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="truncate">
                  {tournament.start_date
                    ? formatDateTime(tournament.start_date)
                    : "TBD"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className={isFull ? "text-destructive" : isAlmostFull ? "text-accent" : ""}>
                  {tournament.registered_teams || 0}/{tournament.max_teams} teams
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="w-4 h-4 text-muted-foreground shrink-0" />
                <span>{tournament.format}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-accent shrink-0" />
                <span className="text-accent font-semibold">
                  {formatCurrency(tournament.prize_pool)} Prize
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link href={`/tournaments/${tournament.id}`} className="flex-1 sm:flex-none">
                <Button variant="glass" className="w-full sm:w-auto">
                  View Details
                </Button>
              </Link>
              {tournament.status === "registration" && !isFull && (
                <Link href={`/tournaments/${tournament.id}/register`} className="flex-1 sm:flex-none">
                  <Button className="w-full sm:w-auto">
                    Register Now
                  </Button>
                </Link>
              )}
              {isFull && (
                <Badge variant="destructive">Registration Full</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Entry Fee Banner */}
      {tournament.entry_fee > 0 && (
        <div className="px-6 py-3 bg-accent/10 border-t border-accent/20 flex items-center justify-between">
          <span className="text-sm">
            Entry Fee: <strong className="text-accent">{formatCurrency(tournament.entry_fee)}</strong> per team
          </span>
          {tournament.prize_pool > 0 && (
            <span className="text-sm text-muted-foreground">
              Prize Pool: <strong className="text-foreground">{formatCurrency(tournament.prize_pool)}</strong>
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
