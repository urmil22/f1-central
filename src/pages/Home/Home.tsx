import { useMemo } from "react";
import dayjs from "dayjs";
import {
  CalendarOutlined,
  FieldTimeOutlined,
  FlagOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { Button, Divider, Spin, Statistic, Tag, Typography } from "antd";
import { fetchDriverStandings, fetchRaceSchedule } from "../../api/f1";
import DriverCard from "../../components/DriverCard/DriverCard";
import RaceCard from "../../components/RaceCard/RaceCard";
import { DEFAULT_TEAM_COLOR } from "../../constants";
import { useAsyncData } from "../../hooks/useAsyncData";
import { filterUpcomingRaces, raceStartsAt } from "../../utils/race";
import "./home.css";

const RACE_SCHEDULE_ERROR = {
  message: "Unable to load race schedule",
  description: "Upcoming race information is currently unavailable.",
};

const Home = () => {
  const { Title, Paragraph, Text } = Typography;

  const {
    data: driverStandings,
    isLoading: driverLoading,
    reload: reloadDrivers,
  } = useAsyncData(fetchDriverStandings, {
    initialData: [],
    error: {
      message: "Unable to load standings",
      description:
        "The latest driver standings could not be retrieved. Try again shortly.",
    },
  });

  const { data: currentSeasonRaces, isLoading: raceLoading } = useAsyncData(
    (signal) => fetchRaceSchedule("current", signal),
    { initialData: [], error: RACE_SCHEDULE_ERROR },
  );

  const topDrivers = useMemo(
    () => driverStandings.slice(0, 5),
    [driverStandings],
  );

  const upcomingRaces = useMemo(
    () => filterUpcomingRaces(currentSeasonRaces).slice(0, 4),
    [currentSeasonRaces],
  );

  // Only fall back to next season once the current schedule has actually
  // resolved — an empty list while still loading isn't an exhausted calendar.
  const { data: nextSeasonRaces } = useAsyncData(
    (signal) => fetchRaceSchedule(dayjs().year() + 1, signal),
    {
      initialData: [],
      enabled: !raceLoading && upcomingRaces.length === 0,
      error: RACE_SCHEDULE_ERROR,
    },
  );

  const nextSeasonHighlight = useMemo(
    () => filterUpcomingRaces(nextSeasonRaces).slice(0, 1),
    [nextSeasonRaces],
  );

  const leadingDriver = topDrivers[0];
  const runnerUp = topDrivers[1];
  const nextRace = upcomingRaces[0];

  const nextRaceDateLabel = useMemo(() => {
    if (!nextRace) {
      return "To be announced";
    }
    const base = raceStartsAt(nextRace);
    if (!base) {
      return "To be announced";
    }
    return nextRace.time
      ? `${base.format("MMM D, HH:mm")} (local)`
      : base.format("MMM D, YYYY");
  }, [nextRace]);

  const leaderStats = useMemo(() => {
    if (!leadingDriver || !runnerUp) {
      return {
        leadGap: null,
        wins: leadingDriver?.wins ?? "0",
      };
    }

    const leadGap = Number(leadingDriver.points) - Number(runnerUp.points);
    return {
      leadGap,
      wins: leadingDriver.wins,
    };
  }, [leadingDriver, runnerUp]);

  const totalWins = useMemo(
    () =>
      topDrivers
        .reduce((acc, driver) => acc + Number.parseInt(driver.wins, 10), 0)
        .toString(),
    [topDrivers],
  );

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__background" aria-hidden="true">
          <div className="home-hero__glow home-hero__glow--left" />
          <div className="home-hero__glow home-hero__glow--right" />
        </div>

        <div className="home-hero__content">
          <div className="home-hero__eyebrow">
            <Tag color="red">Season {dayjs().format("YYYY")}</Tag>
            <Tag color="geekblue">Live Championship Insight</Tag>
          </div>

          <Title level={1} className="home-hero__title">
            Formula 1 Championship Command Center
          </Title>

          <Paragraph className="home-hero__subtitle">
            Immerse yourself in the ultimate F1 experience with live standings,
            dynamic race countdowns, and the stories shaping this season&apos;s
            championship.
          </Paragraph>

          <div className="home-hero__cta">
            <Button
              type="primary"
              size="large"
              icon={<FlagOutlined />}
              href="https://www.formula1.com/"
              target="_blank"
              rel="noreferrer"
            >
              Official F1 Hub
            </Button>
            <Button
              size="large"
              ghost
              loading={driverLoading}
              onClick={reloadDrivers}
            >
              Refresh Standings
            </Button>
          </div>

          <div className="home-hero__metrics">
            <div className="home-hero__metric-card">
              <Statistic
                title="Leader's Advantage"
                value={leaderStats.leadGap ?? "—"}
                suffix={leaderStats.leadGap ? "pts" : ""}
                prefix={<TrophyOutlined />}
              />
              <Text type="secondary">Gap to second place</Text>
            </div>

            <Divider type="vertical" className="home-hero__metric-divider" />

            <div className="home-hero__metric-card">
              <Statistic title="Wins among Top 5" value={totalWins} />
              <Text type="secondary">Collective victories this season</Text>
            </div>

            <Divider type="vertical" className="home-hero__metric-divider" />

            <div className="home-hero__metric-card home-hero__metric-card--highlight">
              <Statistic
                title="Next Grand Prix"
                value={nextRace ? nextRace.raceName : "Awaiting schedule"}
                prefix={<CalendarOutlined />}
              />
              <div className="home-hero__metric-meta">
                <FieldTimeOutlined />
                <span>{nextRaceDateLabel}</span>
              </div>
            </div>
          </div>
        </div>

        {leadingDriver && (
          <aside className="home-hero__leader-card">
            <Text className="home-hero__leader-title" strong>
              Championship Leader
            </Text>
            <Title level={3} className="home-hero__leader-name">
              #{leadingDriver.position} {leadingDriver.Driver.givenName}{" "}
              {leadingDriver.Driver.familyName}
            </Title>
            <Paragraph className="home-hero__leader-meta">
              {leadingDriver.Constructors[0]?.name} • {leadingDriver.points} pts
              • {leadingDriver.wins} wins
            </Paragraph>
            <Tag color={leadingDriver.Constructors[0]?.colorCode ?? "magenta"}>
              {leadingDriver.Driver.nationality}
            </Tag>
          </aside>
        )}
      </section>

      <section className="home-section home-section--drivers">
        <div className="home-section__header">
          <div>
            <Title level={2}>Elite Driver Standings</Title>
            <Paragraph type="secondary">
              Follow the fierce battle at the top of the leaderboard as drivers
              push their cars to the absolute limit.
            </Paragraph>
          </div>
          <Button
            size="large"
            type="default"
            loading={driverLoading}
            onClick={reloadDrivers}
          >
            Sync Standings
          </Button>
        </div>

        <div className="home-section__cards">
          {driverLoading ? (
            <div className="home-section__loading">
              <Spin size="large" />
            </div>
          ) : topDrivers.length > 0 ? (
            topDrivers.map((driver) => (
              <DriverCard
                key={driver.Driver.driverId}
                name={`${driver.Driver.givenName} ${driver.Driver.familyName}`}
                position={driver.position}
                points={driver.points}
                constructorName={
                  driver.Constructors[0]?.name ?? "Unknown Constructor"
                }
                nationality={driver.Driver.nationality}
                wins={driver.wins}
                colorCode={
                  driver.Constructors[0]?.colorCode ?? DEFAULT_TEAM_COLOR
                }
              />
            ))
          ) : (
            <Paragraph type="secondary" className="home-section__empty">
              Standings data is not available at the moment. Please return
              later.
            </Paragraph>
          )}
        </div>
      </section>

      <section className="home-section home-section--races">
        <div className="home-section__header">
          <div>
            <Title level={2}>Upcoming Grand Prix Weekends</Title>
            <Paragraph type="secondary">
              The roadshow continues. Explore the next stops on the calendar and
              count down to the lights going out.
            </Paragraph>
          </div>
          <div className="home-section__header-meta">
            {nextRace && (
              <>
                <Tag color="volcano">Round {nextRace.round}</Tag>
                <Tag color="processing">
                  {nextRace.Circuit.Location.country}
                </Tag>
              </>
            )}
          </div>
        </div>

        <div className="home-section__grid home-section__grid--races">
          {raceLoading ? (
            <div className="home-section__loading">
              <Spin size="large" />
            </div>
          ) : upcomingRaces.length > 0 ? (
            upcomingRaces.map((race, index) => (
              <RaceCard
                key={`${race.round}-${race.raceName}`}
                race={race}
                animationDelay={index * 0.06}
              />
            ))
          ) : // the current calendar is exhausted — preview next season instead
          nextSeasonHighlight.length > 0 ? (
            nextSeasonHighlight.map((race, index) => (
              <RaceCard
                key={`${race.round}-${race.raceName}`}
                race={race}
                animationDelay={index * 0.06}
              />
            ))
          ) : (
            <Paragraph type="secondary" className="home-section__empty">
              Season {new Date().getFullYear()} is over. Next season:{" "}
              {new Date().getFullYear() + 1}.
            </Paragraph>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;