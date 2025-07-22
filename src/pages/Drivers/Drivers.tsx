import { notification, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { fetchDriverStandings } from "../../api/f1";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import './drivers.css';

interface Constructor {
    colorCode: string;
    name: string;
}

interface Driver {
    givenName: string;
    familyName: string;
    nationality: string;
    driverId: string;
}

interface DriverStanding {
    position: string;
    points: string;
    wins: string;
    Driver: Driver;
    Constructors: Constructor[];
}

const Drivers = () => {
    const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const { Title, Paragraph, Text } = Typography;

    const loadTopDrivers = async () => {
        setLoading(true);
        try {
            const data = await fetchDriverStandings();
            const standings = data || [];
            setDriverStandings(standings);
        } catch {
            notification.error({
                message: 'Error',
                description: 'Failed to load top drivers. Please try again later.',
                placement: 'bottomRight',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTopDrivers();
    }, []);

    return (
        <div className="drivers-list-container">
            <Title className="standings-title" level={2} >Formula 1 {dayjs().get('year')} Standings 🏆</Title>
            <div className="drivers-list-grid">
                {!loading && driverStandings.length > 0 && (
                    driverStandings.map((driver) => {
                        const { position, points, wins, Driver: { givenName, familyName, nationality, driverId } } = driver;
                        const constructorName = driver.Constructors[0].name;
                        const colorCode = driver.Constructors[0].colorCode;

                        return (
                            <motion.div
                                key={driverId}
                                className="driver-card"
                                style={{ borderTop: `5px solid ${colorCode}` }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.03 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Title level={4}>
                                    {position === "1" ? "👑" : `#${position}`} {`${givenName} ${familyName}`}
                                </Title>

                                <Paragraph strong>{constructorName}</Paragraph>

                                <div className="driver-stats">
                                    <Paragraph strong>🏁 {points} pts</Paragraph>
                                    <Paragraph strong>🏆 {wins} wins</Paragraph>
                                </div>

                                <Text strong>🌍 {nationality}</Text>
                            </motion.div>
                        );
                    })
                )}


            </div>

            {loading && driverStandings.length === 0 && <Spin size="large" />}

            {!loading && driverStandings.length === 0 && (
                <Text type="secondary">
                    No driver standings available at the moment. Please check back later.
                </Text>)
            }
        </div>
    );
};

export default Drivers;