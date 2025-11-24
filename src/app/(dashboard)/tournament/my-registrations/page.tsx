"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Users, ClipboardList, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";

interface Teammate {
  personId: number;
  memberId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
}

interface Registration {
  bracketEntryId: number;
  bracketId: number;
  bracketLabel: string;
  tournamentId: number;
  tournamentName: string;
  eventTypeId: number;
  eventTypeLabel: string;
  status: string;
  teamId: number;
  teamName: string;
  teammates: Teammate[];
  registrationDate: string;
  bracketStartDate: string | null;
}

async function getMyRegistrations() {
  const response = await apiClient.get("/player-registration/my-registrations");
  return response.data?.data || response.data;
}

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadRegistrations = async () => {
    try {
      setIsLoading(true);
      const data = await getMyRegistrations();
      setRegistrations(data.registrations || []);
    } catch (error: any) {
      toast.error(error?.message || "Failed to load registrations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading registrations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Registrations</h1>
        <p className="text-muted-foreground">
          View all your tournament registrations and team details
        </p>
      </div>

      {registrations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ClipboardList className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Registrations</h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              {`You haven't registered for any tournaments yet. Browse available
              tournaments to get started!`}
            </p>
            <Button asChild>
              <Link href="/tournaments">Browse Tournaments</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {registrations.map((registration) => {
            const startDate = registration.bracketStartDate
              ? new Date(registration.bracketStartDate)
              : null;
            const registeredDate = new Date(registration.registrationDate);

            // Separate current user and teammates
            const pendingTeammates = registration.teammates.filter(
              (t) => t.status === "pending"
            );
            const confirmedTeammates = registration.teammates.filter(
              (t) => t.status === "accepted"
            );

            return (
              <Card key={registration.bracketEntryId}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">
                        {registration.tournamentName}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">
                          {registration.eventTypeLabel}
                        </Badge>
                        <Badge
                          variant={
                            registration.status === "confirmed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {registration.status}
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link
                        href={`/tournaments/${registration.tournamentId}`}
                      >
                        View Tournament
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Bracket Info */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Bracket Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{registration.bracketLabel}</span>
                        </div>
                        {startDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {startDate.toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>Team: {registration.teamName}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Registered on{" "}
                          {registeredDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Team Members */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Team Members</h4>
                      <div className="space-y-3">
                        {confirmedTeammates.length > 0 && (
                          <div className="space-y-2">
                            {confirmedTeammates.map((teammate) => (
                              <div
                                key={teammate.personId}
                                className="flex items-start justify-between text-sm"
                              >
                                <div>
                                  <p className="font-medium">
                                    {teammate.firstName} {teammate.lastName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {teammate.email}
                                  </p>
                                  {teammate.memberId && (
                                    <p className="text-xs text-muted-foreground">
                                      ID: {teammate.memberId}
                                    </p>
                                  )}
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {teammate.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}

                        {pendingTeammates.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground">
                              Pending Invitations:
                            </p>
                            {pendingTeammates.map((teammate) => (
                              <div
                                key={teammate.personId}
                                className="flex items-start justify-between text-sm"
                              >
                                <div>
                                  <p className="font-medium">
                                    {teammate.firstName} {teammate.lastName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {teammate.email}
                                  </p>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {teammate.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}

                        {registration.teammates.length === 1 && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <UserPlus className="h-4 w-4" />
                            <span>Playing solo / Waiting for partner</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;
