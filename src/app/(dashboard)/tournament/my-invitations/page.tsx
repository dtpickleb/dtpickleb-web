"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Users, Mail, Check, X } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

interface Invitation {
  bracketEntryId: number;
  bracketId: number;
  bracketLabel: string;
  tournamentId: number;
  tournamentName: string;
  eventTypeId: number;
  eventTypeLabel: string;
  teamId: number;
  teamName: string;
  invitedBy: {
    personId: number;
    memberId: string | null;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  status: string;
  invitedDate: string;
  bracketStartDate: string | null;
}

async function getMyInvitations() {
  const response = await apiClient.get("/player-registration/my-invitations");
  return response.data?.data || response.data;
}

async function acceptInvitation(data: {
  bracketEntryId: number;
  tournamentTeamId: number;
}) {
  const response = await apiClient.post(
    "/player-registration/accept-invitation",
    data
  );
  return response.data?.data || response.data;
}

const MyInvitations = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

  const loadInvitations = async () => {
    try {
      setIsLoading(true);
      const data = await getMyInvitations();
      setInvitations(data.invitations || []);
    } catch (error: any) {
      toast.error(error?.message || "Failed to load invitations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInvitations();
  }, []);

  const handleAccept = async (invitation: Invitation) => {
    try {
      setProcessingIds((prev) => new Set(prev).add(invitation.bracketEntryId));

      await acceptInvitation({
        bracketEntryId: invitation.bracketEntryId,
        tournamentTeamId: invitation.teamId,
      });

      toast.success("Invitation accepted successfully!");

      // Reload invitations
      await loadInvitations();
    } catch (error: any) {
      toast.error(error?.message || "Failed to accept invitation");
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(invitation.bracketEntryId);
        return next;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading invitations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Invitations</h1>
        <p className="text-muted-foreground">
          View and manage your pending tournament invitations
        </p>
      </div>

      {invitations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Mail className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Invitations</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {`You don't have any pending invitations at the moment. When someone
              invites you to join their team, it will appear here.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {invitations.map((invitation) => {
            const isProcessing = processingIds.has(invitation.bracketEntryId);
            const startDate = invitation.bracketStartDate
              ? new Date(invitation.bracketStartDate)
              : null;

            return (
              <Card key={invitation.bracketEntryId}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">
                        {invitation.tournamentName}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{invitation.eventTypeLabel}</Badge>
                        <Badge variant="secondary">{invitation.status}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAccept(invitation)}
                        disabled={isProcessing}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        {isProcessing ? "Accepting..." : "Accept"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isProcessing}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Decline
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Bracket Info */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Bracket Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{invitation.bracketLabel}</span>
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
                          <span>Team: {invitation.teamName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Inviter Info */}
                    {invitation.invitedBy && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">Invited By</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="font-medium">
                              {invitation.invitedBy.firstName}{" "}
                              {invitation.invitedBy.lastName}
                            </p>
                            <p className="text-muted-foreground">
                              {invitation.invitedBy.email}
                            </p>
                            {invitation.invitedBy.memberId && (
                              <p className="text-xs text-muted-foreground">
                                Member ID: {invitation.invitedBy.memberId}
                              </p>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Invited on{" "}
                            {new Date(invitation.invitedDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    )}
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

export default MyInvitations;
