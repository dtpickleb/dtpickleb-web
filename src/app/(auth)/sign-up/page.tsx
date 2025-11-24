"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { signup } from "@/features/auth/api";
import { signup } from "@/app/features/auth/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isAuthedClient } from "@/lib/auth-cookies";
import { useEffect } from "react";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Min 6 characters"),
  userName: z.string().min(1, "Required"),
});
type Values = z.infer<typeof schema>;

export default function SignUpPage() {
  const router = useRouter();
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "", userName: "" } });

  useEffect(() => {
    if (isAuthedClient()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const onSubmit = async (values: Values) => {
    try {
      await signup(values);
      toast.success("Account created. Please sign in.");
      router.push("/sign-in");
    } catch (e: any) {
      toast.error(e.message ?? "Sign up failed");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <p className="mt-1 text-sm text-muted-foreground">Join Pickle to organize tournaments.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="userName" render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl><Input placeholder="yourname" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <Button type="submit" className="w-full">Create account</Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <a href="/sign-in" className="underline">Sign in</a>
          </p>
        </form>
      </Form>
    </div>
  );
}
