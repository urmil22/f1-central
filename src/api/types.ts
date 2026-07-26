/**
 * Shapes returned by the Jolpica/Ergast F1 API, plus the augmented shapes the
 * app actually consumes.
 *
 * Envelope containers (`MRData`, `StandingsTable`, `StandingsLists`, …) are all
 * optional on purpose: the API legitimately returns empty envelopes — for
 * example `StandingsLists` is `[]` before the first race of a season has run —
 * so every read through them must be optional-chained.
 */

export type ErgastDriver = {
  driverId: string;
  permanentNumber?: string;
  code?: string;
  url?: string;
  givenName: string;
  familyName: string;
  dateOfBirth?: string;
  nationality: string;
};

export type ErgastConstructor = {
  constructorId: string;
  url?: string;
  name: string;
  nationality: string;
};

export type ErgastLocation = {
  lat?: string;
  long?: string;
  locality: string;
  country: string;
};

export type ErgastCircuit = {
  circuitId?: string;
  url?: string;
  circuitName: string;
  Location: ErgastLocation;
};

export type Race = {
  season: string;
  round: string;
  url?: string;
  raceName: string;
  date: string;
  /** UTC time of day, usually with a trailing `Z` (e.g. `"13:00:00Z"`). */
  time?: string;
  Circuit: ErgastCircuit;
};

export type ErgastDriverStanding = {
  position: string;
  positionText?: string;
  points: string;
  wins: string;
  Driver: ErgastDriver;
  Constructors?: ErgastConstructor[];
};

export type ErgastConstructorStanding = {
  position: string;
  positionText?: string;
  points: string;
  wins: string;
  Constructor: ErgastConstructor;
};

export type DriverStandingsResponse = {
  MRData?: {
    StandingsTable?: {
      StandingsLists?: { DriverStandings?: ErgastDriverStanding[] }[];
    };
  };
};

export type ConstructorStandingsResponse = {
  MRData?: {
    StandingsTable?: {
      StandingsLists?: { ConstructorStandings?: ErgastConstructorStanding[] }[];
    };
  };
};

export type RaceScheduleResponse = {
  MRData?: {
    RaceTable?: {
      Races?: Race[];
    };
  };
};

/** A constructor with its team accent colour resolved from `F1_TEAM_COLORS`. */
export type TeamConstructor = ErgastConstructor & { colorCode: string };

/** Driver standing as consumed by the app: `Constructors` is always an array. */
export type DriverStanding = Omit<ErgastDriverStanding, "Constructors"> & {
  Constructors: TeamConstructor[];
};

/** Constructor standing as consumed by the app: `Constructor` carries a colour. */
export type ConstructorStanding = Omit<
  ErgastConstructorStanding,
  "Constructor"
> & {
  Constructor: TeamConstructor;
};
