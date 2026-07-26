import dayjs from "dayjs";
import type { Race } from "../api/types";

/**
 * Combines a race's date and time into an ISO instant.
 *
 * The API reports times in UTC and usually includes the `Z` suffix, but it
 * isn't guaranteed — append it when missing so the value is never parsed as
 * local time (which would shift the countdown by the viewer's offset).
 */
export const raceStartIso = (race: Race): string | undefined => {
  if (!race.time) {
    return undefined;
  }

  return race.time.endsWith("Z")
    ? `${race.date}T${race.time}`
    : `${race.date}T${race.time}Z`;
};

/** Race start instant, falling back to the date when no time is published. */
export const raceStartsAt = (race: Race) => {
  const iso = raceStartIso(race);
  const parsed = iso ? dayjs(iso) : dayjs(race.date);

  return parsed.isValid() ? parsed : null;
};

/** Races that haven't started yet, preserving schedule order. */
export const filterUpcomingRaces = (
  races: Race[],
  from = dayjs(),
): Race[] => races.filter((race) => raceStartsAt(race)?.isAfter(from) ?? false);
