"use client";

import * as React from "react";
import { useState } from "react";
import { Search, Mail, User, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { verifyMemberById } from "../api";

interface PartnerInviteCardProps {
  bracketId: number;
  bracketLabel: string;
  eventTypeLabel?: string;
  fee: number;
  dateDisplay: string;
  onInvite?: (data: { bracketId: number; personId?: number; email?: string }) => void;
}

interface VerifiedMember {
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  personId: number;
}

export function PartnerInviteCard({
  bracketId,
  bracketLabel,
  eventTypeLabel,
  fee,
  dateDisplay,
  onInvite,
}: PartnerInviteCardProps) {
  const [inputType, setInputType] = useState<"memberId" | "email">("memberId");
  const [memberIdInput, setMemberIdInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [verifiedMember, setVerifiedMember] = useState<VerifiedMember | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const feeDisplay = fee > 0 ? `$${(fee / 100).toFixed(2)}/person` : "Free";

  const handleVerifyMember = async () => {
    if (!memberIdInput.trim()) {
      toast.error("Please enter a member ID");
      return;
    }

    try {
      setIsVerifying(true);
      const result = await verifyMemberById(memberIdInput.trim());

      if (result) {
        setVerifiedMember(result);
        toast.success("Member verified!");
        // Automatically save to form when verified
        onInvite?.({
          bracketId,
          personId: result.personId,
        });
      } else {
        toast.error("Member not found. Try inviting by email instead.");
        setVerifiedMember(null);
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to verify member");
      setVerifiedMember(null);
    } finally {
      setIsVerifying(false);
    }
  };

  // const handleInvite = () => {
  //   if (inputType === "memberId" && verifiedMember) {
  //     onInvite?.({
  //       bracketId,
  //       personId: verifiedMember.personId,
  //     });
  //   } else if (inputType === "email" && emailInput.trim()) {
  //     onInvite?.({
  //       bracketId,
  //       email: emailInput.trim(),
  //     });
  //   }
  // };

  const handleReset = () => {
    setVerifiedMember(null);
    setMemberIdInput("");
    setEmailInput("");
    // Clear form data
    onInvite?.({
      bracketId,
    });
  };

  return (
    <Card className="p-4">
      <div className="space-y-3">
        {/* Bracket Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-sm">{dateDisplay}</span>
            <span className="text-sm text-muted-foreground">{feeDisplay}</span>
          </div>
          <p className="text-sm font-medium">
            {bracketLabel} {eventTypeLabel && `- ${eventTypeLabel}`}
          </p>
        </div>

        <Separator />

        {/* Input Type Toggle */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant={inputType === "memberId" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setInputType("memberId");
              handleReset();
            }}
            className="flex-1"
          >
            <User className="w-4 h-4 mr-2" />
            Member ID
          </Button>
          <Button
            type="button"
            variant={inputType === "email" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setInputType("email");
              handleReset();
            }}
            className="flex-1"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
        </div>

        {/* Member ID Input */}
        {inputType === "memberId" && !verifiedMember && (
          <div className="space-y-2">
            <Label htmlFor={`member-${bracketId}`}>Partner Member ID</Label>
            <div className="flex gap-2">
              <Input
                id={`member-${bracketId}`}
                type="text"
                placeholder="Enter member ID"
                value={memberIdInput}
                onChange={(e) => setMemberIdInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleVerifyMember();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleVerifyMember}
                disabled={isVerifying || !memberIdInput.trim()}
                size="sm"
              >
                <Search className="w-4 h-4 mr-2" />
                {isVerifying ? "Verifying..." : "Verify"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter the member ID to verify and invite your partner
            </p>
          </div>
        )}

        {/* Verified Member Display */}
        {inputType === "memberId" && verifiedMember && (
          <div className="space-y-3">
            <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 p-3">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Member Verified
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    {verifiedMember.firstName} {verifiedMember.lastName}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {verifiedMember.email}
                  </p>
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="w-full"
            >
              Change Partner
            </Button>
          </div>
        )}

        {/* Email Input */}
        {inputType === "email" && (
          <div className="space-y-2">
            <Label htmlFor={`email-${bracketId}`}>Partner Email</Label>
            <Input
              id={`email-${bracketId}`}
              type="email"
              placeholder="partner@example.com"
              value={emailInput}
              onChange={(e) => {
                const email = e.target.value;
                setEmailInput(email);
                // Automatically save to form when email is entered
                onInvite?.({
                  bracketId,
                  email: email || undefined,
                });
              }}
            />
            <p className="text-xs text-muted-foreground">
              An invitation will be sent to this email address
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
