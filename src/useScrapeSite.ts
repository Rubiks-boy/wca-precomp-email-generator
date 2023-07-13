import { useEffect, useState } from "react";
import { useAccessToken } from "./AccessTokenProvider";
import { wcaFetch } from "./wcaApi";

export const useScrapeSite = (competitionId: string | null): null => {
  const accessToken = useAccessToken();
  const [site, setSite] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken || !competitionId) {
      return;
    }

    const fetchSite = async () => {
      const s = await wcaFetch(
        `competitions/${competitionId}`,
        accessToken,
        {},
        "https://www.worldcubeassociation.org/"
      );

      console.log(s);

      if (s) {
        // setSite(s);
      }
    };

    fetchSite();
  }, [competitionId, accessToken]);

  console.log("site", site);

  return null;
};
