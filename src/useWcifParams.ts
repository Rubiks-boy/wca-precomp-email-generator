import { useEffect, useState } from "react";
import { useAccessToken } from "./AccessTokenProvider";
import { Competition } from "@wca/helpers";
import { fetchWcif } from "./wcaApi";

const formatTime = (date?: string) => {
  return new Date(date ?? 0).toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const useFetchWcif = (competitionId: string | null): Competition | null => {
  const accessToken = useAccessToken();
  const [competition, setCompetition] = useState<Competition | null>(null);

  useEffect(() => {
    if (!accessToken || !competitionId) {
      return;
    }

    const fetchManageableComps = async () => {
      const comp = await fetchWcif(competitionId, accessToken);

      if (comp) {
        setCompetition(comp);
      }
    };

    fetchManageableComps();
  }, [competitionId, accessToken]);

  return competition;
};

export const useWcifParams = (
  selectedCompId: string | null
): Record<string, string> => {
  const wcif = useFetchWcif(selectedCompId);

  if (!wcif) {
    return {};
  }

  const rooms = wcif.schedule.venues.flatMap((venue) => venue.rooms);
  const activities = rooms.flatMap((room) => room.activities);

  const checkinActivity = activities.find(
    (activity) =>
      activity.activityCode === "other-registration" ||
      activity.activityCode === "other-checkin"
  );

  const tutorialActivity = activities.find(
    (activity) => activity.activityCode === "other-tutorial"
  );

  const checkinStartTime = formatTime(checkinActivity?.startTime);
  const tutorialStartTime = formatTime(tutorialActivity?.startTime);

  const firstVenue = wcif.schedule.venues?.[0] || {
    latitudeMicrodegrees: 0,
    longitudeMicrodegrees: 0,
  };
  const latitude = firstVenue.latitudeMicrodegrees / 1000000;
  const longitude = firstVenue.longitudeMicrodegrees / 1000000;

  const templateParams: Record<string, string> = wcif
    ? {
        COMPETITION_ID: wcif.id,
        COMP_NAME: wcif.name,
        TIME_CHECKIN_BEGINS: checkinStartTime,
        TIME_OF_COMPETITOR_TUTORIAL: tutorialStartTime,
        GOOGLE_MAPS_LINK: `https://www.google.com/maps/place/${latitude},${longitude}`,
      }
    : {};

  return templateParams;
};
