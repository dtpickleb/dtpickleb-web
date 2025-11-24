"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { createBracket } from "../api";
import type { DoubleElimVariant } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";

const doubleElimVariants: DoubleElimVariant[] = ["LB_CAN_WIN", "LB_BRONZE_ONLY"];

// Discriminated union schema for config
const seSchema = z.object({
  type: z.literal("SINGLE_ELIM"),
  seeds: z.number().min(2),
  thirdPlacePlayoff: z.boolean().optional(),
});

const deSchema = z.object({
  type: z.literal("DOUBLE_ELIM"),
  seeds: z.number().min(2),
  variant: z.enum(["LB_CAN_WIN", "LB_BRONZE_ONLY"]),
  grandFinalReset: z.boolean().optional(),
});

const rrSchema = z.object({
  type: z.literal("ROUND_ROBIN"),
  seeds: z.number().min(2),
  matchesPerPair: z.number().optional(),
});

const configSchema = z.discriminatedUnion("type", [seSchema, deSchema, rrSchema]);

const schema = z.object({
  name: z.string().min(2),
  config: configSchema,
});

type Values = z.infer<typeof schema>;

type Props = {
  tournamentId: number;
  onCreated?: (id: number) => void;
};

export default function CreateBracketDialog({ tournamentId, onCreated }: Props) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      config: { type: "SINGLE_ELIM", seeds: undefined as unknown as number, thirdPlacePlayoff: true },
    },
  });

  const onSubmit: SubmitHandler<Values> = async (values) => {
    const created = await createBracket(tournamentId, values);
    onCreated?.(created.id);
  };

  const t = form.watch("config.type");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create bracket</Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg border bg-background p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle>Create bracket</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <Input {...form.register("name")} placeholder="Main Bracket" />
          </div>

          {/* Seeds */}
          <div>
            <label className="mb-1 block text-sm font-medium">Seeds</label>
            <Input inputMode="numeric" {...form.register("config.seeds")} placeholder="8" />
          </div>

          {/* Type-specific */}
          <div className="space-y-2">
            <label className="mb-1 block text-sm font-medium">Type</label>
            <select
              className="w-full rounded border bg-transparent p-2"
              {...form.register("config.type")}
            >
              <option value="SINGLE_ELIM">Single Elimination</option>
              <option value="DOUBLE_ELIM">Double Elimination</option>
              <option value="ROUND_ROBIN">Round Robin</option>
            </select>
          </div>

          {t === "SINGLE_ELIM" && (
            <div className="flex items-center gap-2">
              <input id="bronze" type="checkbox" {...form.register("config.thirdPlacePlayoff")} />
              <label htmlFor="bronze">Include bronze match</label>
            </div>
          )}

          {t === "DOUBLE_ELIM" && (
            <>
              <div className="space-y-2">
                <label className="mb-1 block text-sm font-medium">Variant</label>
                <select
                  className="w-full rounded border bg-transparent p-2"
                  {...form.register("config.variant")}
                >
                  {doubleElimVariants.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input id="gfReset" type="checkbox" {...form.register("config.grandFinalReset")} />
                <label htmlFor="gfReset">Grand-final reset</label>
              </div>
            </>
          )}

          {t === "ROUND_ROBIN" && (
            <div>
              <label className="mb-1 block text-sm font-medium">Matches per pair</label>
              <Input inputMode="numeric" {...form.register("config.matchesPerPair")} placeholder="1" />
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
