"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trophy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { TOURNAMENT_FORMATS, BRACKET_TYPES } from "@/lib/utils";

export default function CreateTournamentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to create a tournament");
      router.push("/auth/login?redirect=/tournaments/create");
      return;
    }

    const tournamentData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      format: formData.get("format") as string,
      bracket_type: formData.get("bracket_type") as string,
      max_teams: parseInt(formData.get("max_teams") as string) || 16,
      min_team_size: parseInt(formData.get("min_team_size") as string) || 5,
      max_team_size: parseInt(formData.get("max_team_size") as string) || 7,
      entry_fee: Math.round(parseFloat(formData.get("entry_fee") as string || "0") * 100),
      prize_pool: Math.round(parseFloat(formData.get("prize_pool") as string || "0") * 100),
      rules: formData.get("rules") as string,
      registration_start: formData.get("registration_start") || null,
      registration_end: formData.get("registration_end") || null,
      start_date: formData.get("start_date") || null,
      organizer_id: user.id,
      status: "draft",
    };

    const { data, error } = await supabase
      .from("tournaments")
      .insert(tournamentData)
      .select()
      .single();

    if (error) {
      toast.error("Failed to create tournament: " + error.message);
      setLoading(false);
      return;
    }

    toast.success("Tournament created successfully!");
    router.push(`/tournaments/${data.id}`);
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/tournaments" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Tournaments
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Create Tournament</h1>
              <p className="text-muted-foreground">Set up a new competitive tournament</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Tournament Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="e.g., Arena Wars Championship Season 1"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Describe your tournament..."
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Format Settings */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Format & Structure</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="format" className="block text-sm font-medium mb-2">
                  Game Format *
                </label>
                <Select id="format" name="format" required>
                  {TOURNAMENT_FORMATS.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label htmlFor="bracket_type" className="block text-sm font-medium mb-2">
                  Bracket Type *
                </label>
                <Select id="bracket_type" name="bracket_type" required>
                  {BRACKET_TYPES.map((b) => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label htmlFor="max_teams" className="block text-sm font-medium mb-2">
                  Maximum Teams
                </label>
                <Select id="max_teams" name="max_teams">
                  <option value="8">8 Teams</option>
                  <option value="16">16 Teams</option>
                  <option value="32">32 Teams</option>
                  <option value="64">64 Teams</option>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="min_team_size" className="block text-sm font-medium mb-2">
                    Min Players
                  </label>
                  <Input
                    id="min_team_size"
                    name="min_team_size"
                    type="number"
                    min={1}
                    max={10}
                    defaultValue={5}
                  />
                </div>
                <div>
                  <label htmlFor="max_team_size" className="block text-sm font-medium mb-2">
                    Max Players
                  </label>
                  <Input
                    id="max_team_size"
                    name="max_team_size"
                    type="number"
                    min={1}
                    max={10}
                    defaultValue={7}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Prize & Fees */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Prize Pool & Entry Fee</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="entry_fee" className="block text-sm font-medium mb-2">
                  Entry Fee (USD)
                </label>
                <Input
                  id="entry_fee"
                  name="entry_fee"
                  type="number"
                  min={0}
                  step={0.01}
                  defaultValue={0}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Set to 0 for free entry
                </p>
              </div>
              <div>
                <label htmlFor="prize_pool" className="block text-sm font-medium mb-2">
                  Prize Pool (USD)
                </label>
                <Input
                  id="prize_pool"
                  name="prize_pool"
                  type="number"
                  min={0}
                  step={0.01}
                  defaultValue={0}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Schedule</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="registration_start" className="block text-sm font-medium mb-2">
                  Registration Opens
                </label>
                <Input
                  id="registration_start"
                  name="registration_start"
                  type="datetime-local"
                />
              </div>
              <div>
                <label htmlFor="registration_end" className="block text-sm font-medium mb-2">
                  Registration Closes
                </label>
                <Input
                  id="registration_end"
                  name="registration_end"
                  type="datetime-local"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="start_date" className="block text-sm font-medium mb-2">
                  Tournament Start Date
                </label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="datetime-local"
                />
              </div>
            </div>
          </div>

          {/* Rules */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Rules & Guidelines</h2>
            <textarea
              id="rules"
              name="rules"
              rows={6}
              placeholder="Enter tournament rules, regulations, and guidelines..."
              className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-4">
            <Link href="/tournaments">
              <Button variant="ghost" type="button">Cancel</Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Tournament"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
