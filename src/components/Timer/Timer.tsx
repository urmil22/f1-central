import React, { useEffect, useState, useMemo, useCallback } from 'react';
import './timer.css';

interface TimerProps {
    targetDate: Date;
    className?: string;
    style?: React.CSSProperties;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
}

const Timer: React.FC<TimerProps> = ({ targetDate }) => {
    const calculateTimeLeft = useCallback((): TimeLeft => {
        const now = new Date().getTime();
        const target = targetDate.getTime();
        const difference = target - now;

        if (difference <= 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                isExpired: true,
            };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / (1000 * 60)) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            isExpired: false,
        };
    }, [targetDate]);

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

    useEffect(() => {
        if (!targetDate || isNaN(targetDate.getTime())) {
            return;
        }

        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate, calculateTimeLeft]);

    const timeUnits = useMemo(() => [
        { value: timeLeft.days, label: 'day', labels: 'days' },
        { value: timeLeft.hours, label: 'hour', labels: 'hours' },
        { value: timeLeft.minutes, label: 'minute', labels: 'minutes' },
        { value: timeLeft.seconds, label: 'second', labels: 'seconds' }
    ], [timeLeft]);

    const formatValue = (value: number): string => {
        return value.toString().padStart(2, '0');
    };

    if (timeLeft.isExpired) {
        return (
            <div
                className='timer-container'
            >
                <div className="expired-message">
                    Time&apos;s up!
                </div>
            </div>
        );
    }

    return (
        <div className='timer-container'>
            {timeUnits.map(({ value, label, labels }) => (
                <div key={label} className="time-block">
                    <span className="time-value">
                        {formatValue(value)}
                    </span>
                    <span className="time-label">
                        {value === 1 ? label : labels}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default Timer;