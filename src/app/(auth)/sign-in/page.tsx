"use client";

import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { login } from "@/features/auth/api";
import { login } from "@/app/features/auth/api";
import { useRouter, useSearchParams } from "next/navigation";
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
import Link from "next/link";
import { signInSchema, type SignInValues } from "@/validations/auth";
import { isAuthedClient } from "@/lib/auth-cookies";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { loadPlayerProfile } from "@/app/features/registration/playerProfileSlice";

function SignInForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/dashboard";
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthedClient()) {
      router.replace(next);
    }
  }, [router, next]);

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: SignInValues) => {
    try {
      await login(values);
      // Fetch and store player profile in Redux
      dispatch(loadPlayerProfile());
      toast.success("Welcome back!");
      router.replace(next);
    } catch (e: any) {
      toast.error(e.message ?? "Invalid email or password");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Access your dashboard.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Sign in
          </Button>
          <div className="text-center text-sm">
            <Link
              href="/forgot-password"
              className="text-muted-foreground underline"
            >
              Forgot password?
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-14">Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
