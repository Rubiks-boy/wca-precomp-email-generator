import { Competition } from "@wca/helpers";
import { WCA_ORIGIN } from "./auth";

export type ManageableCompetition = {
  id: string;
  name: string;
  start_date: string;
  delegates: Array<{ email: string }>;
};

export const wcaFetch = (
  path: string,
  wcaAccessToken: string,
  fetchOptions = {},
  baseUrl: string = `${WCA_ORIGIN}/api/v0`
) => {
  return fetch(
    `${baseUrl}${path}`,
    Object.assign({}, fetchOptions, {
      headers: new Headers({
        Authorization: `Bearer ${wcaAccessToken}`,
        "Content-Type": "application/json",
      }),
    })
  ).then((response) => response.json());
};

export const fetchUpcomingManageableCompetitions = (
  wcaAccessToken: string
): Promise<Array<ManageableCompetition>> => {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    managed_by_me: "true",
    start: oneWeekAgo.toISOString(),
  });
  return wcaFetch(
    `/competitions?${params.toString()}`,
    wcaAccessToken
  ) as Promise<Array<ManageableCompetition>>;
};

export const fetchWcif = (
  competitionId: string,
  wcaAccessToken: string
): Promise<Competition> => {
  return wcaFetch(`/competitions/${competitionId}/wcif`, wcaAccessToken);
};
