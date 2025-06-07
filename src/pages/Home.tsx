// src/pages/Home.tsx
import { useEffect, useMemo, useState } from "react";
import { fetchDriverStandings, getRaceScheduleData } from "../api/f1";
import DriverCard from "../components/DriverCard";
import HeroBanner from "../components/HeroBanner";

// import "../styles/global.css";
import RaceCard from "../components/RaceCard";
import { Spin, Typography } from "antd";

interface Driver {
    driverId: string;
    position: string;
    points: string;
    wins: string;
    nationality: string;
    constructor_name: string;
    Driver: {
        givenName: string;
        familyName: string;
        nationality: string;
    };
    Constructors: {
        name: string;
    }[];
}


interface Race {
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

interface RaceWithDateTime extends Race {
    dateTime: Date;
}

const Home = () => {
    const [topDrivers, setTopDrivers] = useState<Driver[]>([]);
    const [races, setRaces] = useState({});

    useEffect(() => {
        fetchDriverStandings().then((data) => {
            // console.log('data', data);
            const standings = data?.DriverStandings?.slice(0, 3) || [];
            setTopDrivers(standings);
        }).catch(() => {
            // console.log("Error fetching driver standings:", error);
        });


        getRaceScheduleData().then((data) => {
            // console.log('data', data);
            setRaces(data);
        }).catch(() => {
            // console.error("Error fetching race schedule:", error);
        });
    }, []);

    const upcomingRace = useMemo(() => {
        if (Object.keys(races).length > 0) {
            const now = new Date();

            const upcoming: RaceWithDateTime[] = (races as Race[])
                .map((race: Race): RaceWithDateTime => ({
                    ...race,
                    dateTime: new Date(`${race.date}T${race.time}`),
                }))
                .filter((race: RaceWithDateTime): boolean => race.dateTime > now)
                .sort((a: RaceWithDateTime, b: RaceWithDateTime): number => a.dateTime.getTime() - b.dateTime.getTime());
            return upcoming?.[0];
        }
        return null;
    }, [races]);

    return (
        <div className="container">
            <HeroBanner />

            <section>
                <Typography.Title level={2}>🏆 Top 3 Drivers</Typography.Title>
                <div className="grid">
                    {topDrivers.map((driver) => (
                        <DriverCard
                            key={driver.driverId}
                            name={`${driver.Driver.givenName} ${driver.Driver.familyName}`}
                            position={driver.position}
                            points={driver.points}
                            constructor_name={driver.Constructors[0].name}
                            nationality={driver.Driver.nationality}
                            wins={driver.wins}
                        />
                    ))}
                </div>
            </section>

            <section style={{ marginTop: "3rem" }}>
                <Typography.Title level={2}>Next Race</Typography.Title>
                {Object.keys(races).length > 0 ? <RaceCard race={upcomingRace} /> : <Spin />}
            </section>
        </div>
    );
};

export default Home;
