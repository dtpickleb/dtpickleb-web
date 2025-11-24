"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ScheduleConfig({ onMake }:{
  onMake: (opts:{ courts:number; start:string; matchM:number; bufferM:number; slotsPerCourt:number }) => void;
}) {
  const [courts, setCourts] = useState(4);
  const [start, setStart] = useState(() => new Date().toISOString().slice(0,16));
  const [matchM, setMatchM] = useState(15);
  const [bufferM, setBufferM] = useState(5);
  const [slots, setSlots] = useState(12);

  return (
    <div className="grid gap-3 sm:grid-cols-5 items-end">
      <div><label className="text-xs">Courts</label><Input type="number" value={courts} onChange={e=>setCourts(Number(e.target.value))}/></div>
      <div><label className="text-xs">Start</label><Input type="datetime-local" value={start} onChange={e=>setStart(e.target.value)}/></div>
      <div><label className="text-xs">Match (min)</label><Input type="number" value={matchM} onChange={e=>setMatchM(Number(e.target.value))}/></div>
      <div><label className="text-xs">Buffer (min)</label><Input type="number" value={bufferM} onChange={e=>setBufferM(Number(e.target.value))}/></div>
      <div className="flex gap-2">
        <div className="grow">
          <label className="text-xs">Slots per court</label>
          <Input type="number" value={slots} onChange={e=>setSlots(Number(e.target.value))}/>
        </div>
        <Button onClick={()=>onMake({ courts, start, matchM, bufferM, slotsPerCourt: slots })}>Build</Button>
      </div>
    </div>
  );
}
