import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { Typography } from "antd";
import "./timer.css";

type TimeLeft = {
  totalSeconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

interface TimerProps {
  utcDateTime?: string | null;
  label?: string;
}

const createInitialState = (): TimeLeft => ({
  totalSeconds: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

const Timer = ({ utcDateTime, label = "Next race in" }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(createInitialState());
  const { Title, Paragraph, Text } = Typography;

  const targetDate = useMemo(() => {
    if (!utcDateTime) {
      return null;
    }

    const parsed = dayjs(utcDateTime);
    return parsed.isValid() ? parsed : null;
  }, [utcDateTime]);

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft(createInitialState());
      return;
    }

    const updateTimer = () => {
      const now = dayjs();
      const diffInSeconds = targetDate.diff(now, "second");

      if (diffInSeconds <= 0) {
        setTimeLeft(createInitialState());
        return;
      }

      const days = Math.floor(diffInSeconds / 86400);
      const hours = Math.floor((diffInSeconds % 86400) / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = diffInSeconds % 60;

      setTimeLeft({
        totalSeconds: diffInSeconds,
        days,
        hours,
        minutes,
        seconds,
      });
    };

    updateTimer();
    const intervalId = window.setInterval(updateTimer, 1000);

    return () => window.clearInterval(intervalId);
  }, [targetDate]);

  const segments = useMemo(
    () => [
      { label: "days", value: timeLeft.days },
      { label: "hours", value: timeLeft.hours },
      { label: "minutes", value: timeLeft.minutes },
      { label: "seconds", value: timeLeft.seconds },
    ],
    [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds],
  );

  const hasValidTarget = Boolean(targetDate);
  const hasCountdown = Boolean(hasValidTarget && timeLeft.totalSeconds > 0);
  const heading = hasCountdown
    ? label
    : hasValidTarget
      ? "Race imminent"
      : "Awaiting race confirmation";
  const statusMessage = useMemo(() => {
    if (!hasValidTarget) {
      return "Race schedule will be announced as soon as the FIA confirms the session timing.";
    }
    if (!hasCountdown) {
      return "Formation lap should be underway — refresh to sync with the latest timing.";
    }
    if (timeLeft.totalSeconds <= 3600) {
      return "Final hour before lights out. Teams are making their last-minute checks.";
    }
    return "";
  }, [hasValidTarget, hasCountdown, timeLeft.totalSeconds]);

  return (
    <div className="timer-container">
      <Title level={4}>{heading}</Title>
      <Text type="secondary">{statusMessage}</Text>
      <div className="timer-values">
        {segments.map((segment) => {
          const displayValue = hasCountdown
            ? segment.value.toString().padStart(2, "0")
            : "00";

          return (
            <div className="timer-value" key={segment.label}>
              <Paragraph strong type={!hasCountdown ? "secondary" : undefined}>
                {displayValue}
              </Paragraph>
              <Text>{segment.label}</Text>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timer;
