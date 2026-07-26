import { DEFAULT_TEAM_COLOR, F1_TEAM_COLORS } from "../constants";
import type {
  ConstructorStanding,
  ConstructorStandingsResponse,
  DriverStanding,
  DriverStandingsResponse,
  ErgastConstructor,
  Race,
  RaceScheduleResponse,
  TeamConstructor,
} from "./types";

const BASE_URL =
  import.meta.env.VITE_F1_API_URL ?? "https://api.jolpi.ca/ergast/f1";

/**
 * Every fetcher in this module throws on failure — network error, non-2xx, or
 * an unusable payload. Callers get a single error path to handle, so don't
 * swallow errors here and return a fallback value instead.
 */
const fetchJson = async <T>(
  path: string,
  signal?: AbortSignal,
): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, { signal });

  if (!res.ok) {
    throw new Error(`F1 API request failed (${res.status}): ${path}`);
  }

  return (await res.json()) as T;
};

const withTeamColor = (constructor: ErgastConstructor): TeamConstructor => ({
  ...constructor,
  colorCode: F1_TEAM_COLORS[constructor.constructorId] ?? DEFAULT_TEAM_COLOR,
});

export const fetchDriverStandings = async (
  signal?: AbortSignal,
): Promise<DriverStanding[]> => {
  const data = await fetchJson<DriverStandingsResponse>(
    "/current/driverstandings.json",
    signal,
  );
  const standings =
    data.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];

  return standings.map((standing) => ({
    ...standing,
    Constructors: (standing.Constructors ?? []).map(withTeamColor),
  }));
};

export const fetchConstructorStandings = async (
  signal?: AbortSignal,
): Promise<ConstructorStanding[]> => {
  const data = await fetchJson<ConstructorStandingsResponse>(
    "/current/constructorstandings.json",
    signal,
  );
  const standings =
    data.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ??
    [];

  return standings.map((standing) => ({
    ...standing,
    Constructor: withTeamColor(standing.Constructor),
  }));
};

/**
 * Race schedule for a season — pass `"current"` for the running season, or a
 * year for a specific one.
 */
export const fetchRaceSchedule = async (
  season: string | number = "current",
  signal?: AbortSignal,
): Promise<Race[]> => {
  const data = await fetchJson<RaceScheduleResponse>(`/${season}.json`, signal);
  const races = data.MRData?.RaceTable?.Races;

  if (!races) {
    throw new Error(`Unexpected race schedule payload for season "${season}"`);
  }

  return races;
};
