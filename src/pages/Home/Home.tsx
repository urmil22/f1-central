import { useEffect, useState } from "react";
import { Spin, Typography, notification } from 'antd';
import { motion } from "framer-motion";
import dayjs from "dayjs";

import { fetchDriverStandings, getRaceScheduleData } from "../../api/f1";
import DriverCard from "../../components/DriverCard/DriverCard";
import RaceCard from "../../components/RaceCard";

import './home.css';

interface Driver {
    driverId: string;
    position: string;
    points: string;
    wins: string;
    nationality: string;
    constructor_name: string;
    Driver: {
        driverId: string;
        givenName: string;
        familyName: string;
        nationality: string;
    };
    Constructors: {
        name: string;
        colorCode: string;
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

const Home = () => {
    const [topDrivers, setTopDrivers] = useState<Driver[]>([]);
    const [races, setRaces] = useState<Race[]>([]);

    const { Title } = Typography;

    const loadTopDrivers = async () => {
        try {
            const data = await fetchDriverStandings();
            const standings = data?.slice(0, 5) || [];
            setTopDrivers(standings);
        } catch {
            notification.error({
                message: 'Error',
                description: 'Failed to load top drivers. Please try again later.',
                placement: 'bottomRight',
            });
        }
    };

    const loadUpcomingRaces = async () => {
        try {
            const data = await getRaceScheduleData();
            const now = dayjs();
            const upcoming = data?.filter((race: Race) => dayjs(`${race.date}T${race.time}`).isAfter(now)).slice(0, 3);
            setRaces(upcoming);
        } catch {
            notification.error({
                message: 'Error',
                description: 'Failed to load upcoming races. Please try again later.',
                placement: 'bottomRight',
            });
        }
    };

    useEffect(() => {
        loadTopDrivers();
        loadUpcomingRaces();
    }, []);

    return (
        <div className="home-container">
            <motion.div
                className="hero"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.03 }}
            >
                <Title level={1}>F1 Central</Title>
            </motion.div>
            <Title level={2}>Drivers Championship Standings 🏆</Title>
            <Title level={4}>
                {dayjs().get('year')} Formula 1 Season
            </Title>
            <div className="top-drivers-grid">
                {topDrivers.length > 0 ? topDrivers.map((driver) => (
                    <DriverCard
                        key={driver.Driver.driverId}
                        name={`${driver.Driver.givenName} ${driver.Driver.familyName}`}
                        position={driver.position}
                        points={driver.points}
                        constructor_name={driver.Constructors[0].name}
                        nationality={driver.Driver.nationality}
                        wins={driver.wins}
                        colorCode={driver.Constructors[0].colorCode}
                    />
                )) : (
                    <Spin size="large" />
                )}
            </div>

            <div className="upcoming-races-container">
                <Title level={2}>Upcoming Races 🏁</Title>

                <div className="upcoming-races-grid">
                    {races.length > 0 ? races.map((race) => <RaceCard key={race.time} race={race} />) : <Spin size="large" />}
                </div>
            </div>
        </div>
    );
};

export default Home;
