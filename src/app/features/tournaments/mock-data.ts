import type { TournamentLite } from "./types";

const SPORTS = ["Pickleball", "Tennis"];
const COUNTRIES = ["India", "USA"];

function makeOne(id: number): TournamentLite {
  const start = new Date();
  start.setDate(start.getDate() + (id % 14) - 5);
  const end = new Date(start);
  end.setDate(start.getDate() + 2);

  const regOpen = new Date(start);
  regOpen.setDate(start.getDate() - 14);
  const regClose = new Date(start);
  regClose.setDate(start.getDate() - 1);

  const toISO = (d: Date) => d.toISOString();

  const t: TournamentLite = {
    id,
    name: `Demo Tournament #${id}`,
    countryId: (id % COUNTRIES.length) + 1,
    facilityId: (id % 10) + 1,
    sportsId: (id % SPORTS.length) + 1,
    coverImageUrl: "https://picsum.photos/seed/" + id + "/800/300",
    eventStartDate: toISO(start),
    eventEndDate: toISO(end),
    tournamentFee: id % 3 === 0 ? "25" : "0",
    registrationOpens: toISO(regOpen),
    registrationCloses: toISO(regClose),
  };
  return t;
}

export function mockTournaments(total = 36) {
  const arr = Array.from({ length: total }, (_, i) => makeOne(i + 1));
  return { data: arr, total, page: 1, limit: total };
}

export function mockTournamentsPage(page = 1, limit = 12) {
  const total = 36;
  const all = Array.from({ length: total }, (_, i) => makeOne(i + 1));
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);
  return { data, total, page, limit };
}

export function mockCounts() {
  const all = mockTournaments().data;
  const available = all.filter((t) => t.isRegistrationOpen).length;
  const active = all.filter(
    (t) => !t.isCompleted && Date.now() >= Date.parse(t.eventStartDate!) && Date.now() <= Date.parse(t.eventEndDate!)
  ).length;
  return { available, total: all.length, active, mine: Math.min(3, all.length) };
}
