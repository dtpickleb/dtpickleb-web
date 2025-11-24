"use client";
import { useEffect, useState } from "react";
import RegistrationForm from "@/app/features/registration/RegistrationForm";
import { fetchPlayerProfile } from "@/app/features/registration/api";
import type { PlayerProfile } from "@/app/features/registration/types";

export default function Register() {
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await fetchPlayerProfile();
        setPlayerProfile(profile);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-2">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-2">
      <RegistrationForm
        userName="Maulik Shah"
        playerProfile={playerProfile}
      />
    </div>
  );
}
