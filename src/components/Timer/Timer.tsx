import { Typography } from "antd";
import React, { useEffect, useState } from "react";
import './timer.css';

type TimeLeft = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

interface TimerProps {
    utcDateTime: string; // Example: "2025-09-21T11:00:00Z"
}

const Timer: React.FC<TimerProps> = ({ utcDateTime }) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const { Title, Paragraph, Text } = Typography;

    useEffect(() => {
        if (!utcDateTime) return;

        const targetDate = new Date(utcDateTime);

        const updateTimer = () => {
            const now = new Date();
            const diff = targetDate.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft({ days, hours, minutes, seconds });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [utcDateTime]);

    return (
        <div className="timer-container">
            <Title level={4}>
                Next race in
            </Title>
            <div className="timer-values">
                <div className="timer-value">
                    <Paragraph strong type="secondary">{timeLeft.days}</Paragraph>
                    <Text>days</Text>
                </div>
                <div className="timer-value">
                    <Paragraph strong type="secondary">{timeLeft.hours}</Paragraph>
                    <Text>hours</Text>
                </div>
                <div className="timer-value">
                    <Paragraph strong type="secondary">{timeLeft.minutes}</Paragraph>
                    <Text>minutes</Text>
                </div>
                <div className="timer-value">
                    <Paragraph strong type="secondary">{timeLeft.seconds}</Paragraph>
                    <Text>seconds</Text>
                </div>
            </div>
        </div>
    );
};

export default Timer;