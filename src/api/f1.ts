import { F1_TEAM_COLORS } from "../constants";

const BASE_URL = "https://api.jolpi.ca/ergast/f1";

export const fetchCurrentSeason = async () => {
    const res = await fetch(`${BASE_URL}/season`);
    if (!res.ok) throw new Error("Failed to fetch current season");
    return res.json();
};

export const fetchRaceSchedule = async () => {
    const res = await fetch(`${BASE_URL}/schedule`);
    if (!res.ok) throw new Error("Failed to fetch race schedule");
    return res.json();
};

export const fetchDrivers = async () => {
    const res = await fetch(`${BASE_URL}/drivers`);
    if (!res.ok) throw new Error("Failed to fetch drivers");
    return res.json();
};

export const fetchDriverDetails = async (driverId: string) => {
    const res = await fetch(`${BASE_URL}/driver/${driverId}`);
    if (!res.ok) throw new Error("Failed to fetch driver details");
    return res.json();
};

export const fetchConstructorStandings = async () => {
    const res = await fetch(`${BASE_URL}/standings/constructors`);
    if (!res.ok) throw new Error("Failed to fetch constructor standings");
    return res.json();
};

export const fetchRaceResults = async (round: number) => {
    const res = await fetch(`${BASE_URL}/results/${round}`);
    if (!res.ok) throw new Error("Failed to fetch race results");
    return res.json();
};

export async function fetchDriverStandings() {
    try {
        const res = await fetch(`${BASE_URL}/current/driverstandings.json`);
        const data = await res.json();
        const standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings || {};
        const updatedStandings = standings.map((driver: { Constructors: any[]; }) => {
            const constructor = driver.Constructors[0];
            const colorCode = F1_TEAM_COLORS[constructor.constructorId] || "#999";

            return {
                ...driver,
                Constructors: [
                    {
                        ...constructor,
                        colorCode,
                    },
                ],
            };
        });
        return updatedStandings;

    } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error', error);
    }
}

export async function getRaceScheduleData() {
    const res = await fetch(`${BASE_URL}/current.json`);
    if (!res.ok) {
        throw new Error("Failed to fetch race data");
    }
    const data = await res.json();

    if (data.MRData && data.MRData.RaceTable && data.MRData.RaceTable.Races) {
        interface race {
            season: string;
            round: string;
            raceName: string;
            date: string;
            time: string;
            Circuit: {
                circuitName: string;
                Location: {
                    locality: string;
                    country: string;
                };
            };
        }
        return data.MRData.RaceTable.Races.map((race: race) => ({
            season: race.season,
            round: race.round,
            raceName: race.raceName,
            date: race.date,
            time: race.time,
            Circuit: {
                circuitName: race.Circuit.circuitName,
                Location: {
                    locality: race.Circuit.Location.locality,
                    country: race.Circuit.Location.country,
                },
            },
        }));
    } else {
        throw new Error("Invalid data format");
    }
}