"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock data for live matches
const liveMatches = [
  {
    id: "1",
    tournament: "Arena Wars Championship",
    round: "Semi-Finals",
    team1: { name: "Phoenix Rising", tag: "PHX", score: 2 },
    team2: { name: "Shadow Legion", tag: "SHD", score: 1 },
    viewers: 1234,
    status: "live",
  },
  {
    id: "2",
    tournament: "Weekly Showdown #45",
    round: "Quarter-Finals",
    team1: { name: "Nexus Gaming", tag: "NXS", score: 0 },
    team2: { name: "Thunder Strike", tag: "THN", score: 0 },
    viewers: 567,
    status: "starting",
  },
  {
    id: "3",
    tournament: "Pro League Season 4",
    round: "Group Stage",
    team1: { name: "Crimson Wolves", tag: "CRW", score: 1 },
    team2: { name: "Azure Knights", tag: "AZK", score: 1 },
    viewers: 892,
    status: "live",
  },
];

export function LiveMatchesSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
              <h2 className="text-3xl sm:text-4xl font-bold">Live Now</h2>
            </div>
            <p className="text-muted-foreground">Watch the action as it happens</p>
          </motion.div>

          <Link href="/matches/live">
            <Button variant="ghost" className="hidden sm:flex">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Live Matches Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveMatches.map((match, i) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl overflow-hidden group hover:border-primary/30 transition-all duration-300"
            >
              {/* Match Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={match.status === "live" ? "live" : "outline"}>
                    {match.status === "live" ? "LIVE" : "Starting Soon"}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    {match.viewers.toLocaleString()}
                  </div>
                </div>
                <p className="text-sm font-medium truncate">{match.tournament}</p>
                <p className="text-xs text-muted-foreground">{match.round}</p>
              </div>

              {/* Teams */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  {/* Team 1 */}
                  <div className="flex-1 text-center">
                    <div className="w-14 h-14 mx-auto mb-2 rounded-xl bg-muted flex items-center justify-center text-lg font-bold">
                      {match.team1.tag}
                    </div>
                    <p className="text-sm font-medium truncate">{match.team1.name}</p>
                  </div>

                  {/* Score */}
                  <div className="px-4">
                    <div className="text-3xl font-bold flex items-center gap-2">
                      <span className={match.team1.score > match.team2.score ? "text-success" : ""}>
                        {match.team1.score}
                      </span>
                      <span className="text-muted-foreground">:</span>
                      <span className={match.team2.score > match.team1.score ? "text-success" : ""}>
                        {match.team2.score}
                      </span>
                    </div>
                  </div>

                  {/* Team 2 */}
                  <div className="flex-1 text-center">
                    <div className="w-14 h-14 mx-auto mb-2 rounded-xl bg-muted flex items-center justify-center text-lg font-bold">
                      {match.team2.tag}
                    </div>
                    <p className="text-sm font-medium truncate">{match.team2.name}</p>
                  </div>
                </div>
              </div>

              {/* Watch Button */}
              <div className="p-4 pt-0">
                <Link href={`/matches/${match.id}`}>
                  <Button variant="glass" className="w-full">
                    <Play className="w-4 h-4" />
                    Watch Match
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/matches/live">
            <Button variant="outline">
              View All Live Matches
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
