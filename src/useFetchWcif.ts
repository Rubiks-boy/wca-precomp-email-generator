import { useEffect, useState } from "react";
import { useAccessToken } from "./AccessTokenProvider";
import { Competition } from "@wca/helpers";
import { fetchWcif } from "./wcaApi";

export const useFetchWcif = (
  competitionId: string | null
): Competition | null => {
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
