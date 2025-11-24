"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import DateTimePicker from "@/app/features/tournaments/components/DateTimePicker";
import { usePlayerProfile } from "@/app/features/registration/usePlayerProfile";
import { updatePlayerProfile } from "@/app/features/registration/api";
import { ProfileUpdateSchema, type ProfileUpdateForm } from "@/app/features/registration/types";
import { useAppDispatch } from "@/store/hooks";
import { loadPlayerProfile } from "@/app/features/registration/playerProfileSlice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const { profile, loading } = usePlayerProfile();
  const dispatch = useAppDispatch();

  const form = useForm<ProfileUpdateForm>({
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      gender: undefined,
      dateOfBirth: undefined,
    },
  });

  useEffect(() => {
    if (profile) {
      const genderValue = profile.gender === "MALE" || profile.gender === "FEMALE" || profile.gender === "OTHER"
        ? profile.gender
        : undefined;

      form.reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        gender: genderValue,
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const onSubmit = async (values: ProfileUpdateForm) => {
    try {
      // Convert dateOfBirth to ISO string if it's a Date object
      const payload = {
        ...values,
        dateOfBirth: values.dateOfBirth instanceof Date
          ? values.dateOfBirth.toISOString().split("T")[0]
          : values.dateOfBirth,
      };
      await updatePlayerProfile(payload);
      // Refresh profile in Redux
      dispatch(loadPlayerProfile());
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update profile");
    }
  };

  if (loading && !profile) {
    return (
      <div className="container mx-auto py-10">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <PhoneInput
                        value={field.value || ""}
                        onChange={(v) => field.onChange(v || "")}
                        placeholder="2015550123"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-sidebar">
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth (e.g. 2/23/1965)</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value instanceof Date ? field.value : undefined}
                        onChange={(date) => field.onChange(date)}
                        withTime={false}
                        futureOnly={false}
                        placeholder="Select date of birth"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button type="submit" className="w-full md:w-auto">
                  Update Profile
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
