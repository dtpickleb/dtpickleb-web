"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter } from "lucide-react";
import { useState } from "react";

export type Filters = {
  q?: string;
  sportId?: number;
  countryId?: number;
  facilityId?: number;
  city?: string;
  skillLevel?: string;
  status?: "upcoming" | "in_progress" | "completed";
};

const cities = [
  "All Cities",
  "Raleigh",
  "Durham",
  "Chapel Hill",
  "Cary",
  "Wake Forest",
  "Apex",
  "Morrisville",
  "Holly Springs",
];

const skillLevels = [
  "All Levels",
  "2.5",
  "3.0",
  "3.5",
  "4.0",
  "4.5",
  "5.0",
  "Open",
];

export function TournamentFilters({
  value,
  onChange,
}: {
  value: Filters;
  onChange: (v: Filters) => void;
}) {
  const [local, setLocal] = useState<Filters>(value);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Search</label>
            <Input
              placeholder="Search tournaments..."
              value={local.q ?? ""}
              onChange={(e) => setLocal({ ...local, q: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Location</label>
            <Select
              value={local.city ?? "All Cities"}
              onValueChange={(v) =>
                setLocal({ ...local, city: v === "All Cities" ? undefined : v })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Skill Level
            </label>
            <Select
              value={local.skillLevel ?? "All Levels"}
              onValueChange={(v) =>
                setLocal({
                  ...local,
                  skillLevel: v === "All Levels" ? undefined : v,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {skillLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select
              value={String(local.status ?? "All Status")}
              onValueChange={(v) =>
                setLocal({
                  ...local,
                  status: (v === "All Status" ? undefined : v) as any,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={() => onChange(local)}>Apply Filters</Button>
          <Button
            variant="outline"
            onClick={() => {
              setLocal({});
              onChange({});
            }}
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
