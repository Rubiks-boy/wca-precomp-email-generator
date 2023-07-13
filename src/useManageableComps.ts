import { Competition } from "@wca/helpers";
import { useEffect, useState } from "react";
import { useAccessToken } from "./AccessTokenProvider";
import {
  fetchUpcomingManageableCompetitions,
  ManageableCompetition,
} from "./wcaApi";

export const useManageableComps = (): Array<ManageableCompetition> => {
  const accessToken = useAccessToken();
  const [hasFetched, setHasFetched] = useState(false);
  const [manageableComps, setManageableComps] = useState<
    Array<ManageableCompetition>
  >([]);

  useEffect(() => {
    if (hasFetched || !accessToken) {
      return;
    }

    const fetchManageableComps = async () => {
      const manageableComps = await fetchUpcomingManageableCompetitions(
        accessToken
      );

      if (manageableComps) {
        setManageableComps(manageableComps);
      }
    };

    setHasFetched(true);
    fetchManageableComps();
  }, [hasFetched, accessToken]);

  return manageableComps;
};
