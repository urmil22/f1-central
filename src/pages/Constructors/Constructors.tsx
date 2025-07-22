import { notification, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { fetchConstructorStandings } from "../../api/f1";
import { motion } from "framer-motion";
import './constructors.css';

interface Constructor {
    Constructor: {
        name: string;
    };
    Constructors: {
        colorCode: string;
    }[];
    constructorId: string;
    position: string;
    points: string;
}

const Constructors = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [constructors, setConstructors] = useState<Constructor[]>([]);

    const { Title, Text } = Typography;

    const loadConstructors = async () => {
        try {
            const response = await fetchConstructorStandings();
            setConstructors(response);
        } catch {
            notification.error({
                message: 'Error',
                description: 'Failed to load constructor standings. Please try again later.',
                placement: 'bottomRight',
            });
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadConstructors();
    }, []);

    return (
        <div className='constructors-container'>
            <Title level={2}>Constructor Standings</Title>
            {!isLoading && constructors.length > 0 && (
                <div className="constructors-list-grid">
                    {constructors.map((constructor) => {
                        const colorCode = constructor.Constructors[0].colorCode || "#999";

                        return (
                            <motion.div
                                key={constructor.constructorId}
                                style={{ borderTop: `5px solid ${colorCode}` }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.03 }}
                                transition={{ duration: 0.4 }}
                                className="constructor-card">
                                <Title level={5}>{constructor.position}</Title>
                                <Title level={4}>{constructor.Constructor.name}</Title>
                                <Title level={5}>
                                    Points:
                                    {' '}
                                    <Text strong>
                                        {constructor.points}
                                    </Text>

                                </Title>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {isLoading && constructors.length === 0 && <Spin size="large" />}

            {!isLoading && constructors.length === 0 && (
                <Text type="secondary">
                    No constructor standings available at the moment. Please check back later.
                </Text>)
            }
        </div>
    );
};

export default Constructors;