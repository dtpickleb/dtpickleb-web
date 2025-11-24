"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { BracketConfig } from "../types";
import { Button } from "@/components/ui/button";

// ONLY Single Elim here; no `variant` on SingleElimConfig.
const schema = z.object({
  name: z.string().min(2),
  config: z.object({
    type: z.literal("SINGLE_ELIM"),
    seeds: z.number().min(2),
    thirdPlacePlayoff: z.boolean().optional(),
  }),
});

type Values = z.infer<typeof schema>;

type Props = {
  tournamentId: number;
  onCreate: (payload: { name: string; config: BracketConfig }) => Promise<void>;
};

export default function CreatePlayoffFromRRDialog({ onCreate }: Props) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "Playoffs",
      config: { type: "SINGLE_ELIM", seeds: undefined as unknown as number, thirdPlacePlayoff: true },
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit((v) => onCreate(v))}
      className="space-y-3 rounded-md border p-4"
    >
      <div>
        <label className="mb-1 block text-sm font-medium">Name</label>
        <input className="w-full rounded border p-2" {...form.register("name")} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Seeds</label>
        <input className="w-full rounded border p-2" {...form.register("config.seeds")} />
      </div>
      <div className="flex items-center gap-2">
        <input id="bronze" type="checkbox" {...form.register("config.thirdPlacePlayoff")} />
        <label htmlFor="bronze">Include bronze match</label>
      </div>
      <div className="flex justify-end">
        <Button type="submit">Create playoff</Button>
      </div>
    </form>
  );
}
