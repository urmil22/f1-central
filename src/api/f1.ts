import { F1_TEAM_COLORS } from "../constants";

const BASE_URL = "https://api.jolpi.ca/ergast/f1";

export const fetchConstructorStandings = async () => {
    try {
        const res = await fetch(`${BASE_URL}/current/constructorstandings.json`);
        const data = await res.json();
        const standings = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings || [];
        const updatedStandings = standings.map((constructor: any) => {
            const colorCode = F1_TEAM_COLORS[constructor.Constructor.constructorId] || "#999";

            return {
                ...constructor,
                Constructors: [
                    {
                        ...constructor.Constructor,
                        colorCode,
                    },
                ],
            };
        });
        return updatedStandings;

    } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error', error);
        return [];
    }
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

export async function getNextYearRaceScheduleData() {
    const nextYear = new Date().getFullYear() + 1;
    const res = await fetch(`${BASE_URL}/${nextYear}.json`);
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
