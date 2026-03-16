"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TOURNAMENT_FORMATS, BRACKET_TYPES } from "@/lib/utils";

export function TournamentFilters() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [format, setFormat] = useState("all");
  const [entryFee, setEntryFee] = useState("all");

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setFormat("all");
    setEntryFee("all");
  };

  const hasFilters = search || status !== "all" || format !== "all" || entryFee !== "all";

  return (
    <div className="glass rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium mb-2">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tournament name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium mb-2">Status</label>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="registration">Open Registration</option>
          <option value="ongoing">In Progress</option>
          <option value="completed">Completed</option>
        </Select>
      </div>

      {/* Format */}
      <div>
        <label className="block text-sm font-medium mb-2">Format</label>
        <Select value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="all">All Formats</option>
          {TOURNAMENT_FORMATS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Entry Fee */}
      <div>
        <label className="block text-sm font-medium mb-2">Entry Fee</label>
        <Select value={entryFee} onChange={(e) => setEntryFee(e.target.value)}>
          <option value="all">Any</option>
          <option value="free">Free Entry</option>
          <option value="paid">Paid Entry</option>
        </Select>
      </div>

      <Button variant="glass" className="w-full">
        Apply Filters
      </Button>
    </div>
  );
}
