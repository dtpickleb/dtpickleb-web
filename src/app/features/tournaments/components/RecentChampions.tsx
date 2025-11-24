"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";

type Champion = {
  name: string;
  tournament: string;
  division: string;
  avatar?: string;
};

type RecentChampionsProps = {
  champions: Champion[];
};

export function RecentChampions({ champions }: RecentChampionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Recent Champions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {champions.map((champion, index) => (
            <div key={index} className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={champion.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {champion.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm">{champion.name}</p>
                <p className="text-xs text-muted-foreground">{champion.division}</p>
              </div>
              <Trophy className="w-5 h-5 text-yellow-500" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
