import { Box, Checkbox, Grid } from "@mui/material";
import { Competition } from "@wca/helpers";
import { useEffect, useState } from "react";
import { BasicCheckbox } from "./BasicCheckbox";
import { BasicInput } from "./BasicInput";
import { ChooseCompetition } from "./ChooseCompetition";
import { EmailLink, EmailParams } from "./EmailLink";
import { OutputRender } from "./OutputRender";
import { useFetchWcif } from "./useFetchWcif";
import { useManageableComps } from "./useManageableComps";
import { useWcifParams } from "./useWcifParams";
import { ManageableCompetition } from "./wcaApi";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const makeEmailParams = ({
  organizerEmail,
  selectedComp,
  wcif,
  dryRun,
}: {
  organizerEmail: string;
  selectedComp?: ManageableCompetition;
  wcif?: Competition | null;
  dryRun: boolean;
}): EmailParams => {
  if (!selectedComp) {
    return {
      to: "",
      cc: "",
      bcc: "",
      su: "",
      body: "Something went wrong.",
    };
  }

  const competitorEmails = wcif?.persons?.map((person) => person.email) || [];
  const delegateEmails = selectedComp.delegates.map(({ email }) => email);

  const startDate = new Date(selectedComp.start_date);
  const dayOfWeek = DAYS_OF_WEEK[startDate.getUTCDay()];

  return {
    to: organizerEmail,
    cc: delegateEmails.join(","),
    bcc: dryRun ? "" : competitorEmails.join(","),
    su: `[${selectedComp.name}] See you this ${dayOfWeek}!`,
    body: "Copy the email rendering here.",
  };
};

export const EmailComposer = () => {
  const [template, setTemplate] = useState<string>("");
  const [organizerName, setOrganizerName] = useState<string>("");
  const [organizerEmail, setOrganizerEmail] = useState<string>("");
  const [sponsorTab, setSponsorTab] = useState<string>("");
  const [parkingTab, setParkingTab] = useState<string>("");
  const [selectedCompId, setSelectedCompId] = useState<string>("");
  const [isDryrun, setIsDryrun] = useState<boolean>(true);

  const manageableComps = useManageableComps();
  const wcif = useFetchWcif(selectedCompId);
  const wcifTemplateParams = useWcifParams(wcif);

  const selectedComp = manageableComps.find(({ id }) => id === selectedCompId);

  const templateParams = {
    ...wcifTemplateParams,
    PARKING_TAB: parkingTab.split("#")[1] ?? "",
    SPONSOR_TAB: sponsorTab.split("#")[1] ?? "",
    ORGANIZER_NAME: organizerName,
  };

  useEffect(() => {
    fetch("template.html")
      .then((res) => res.text())
      .then(setTemplate)
      .catch(() => {
        setTemplate("Couldn't render the email :(");
      });
  }, []);

  const inputForm = (
    <Grid container spacing={2}>
      <ChooseCompetition
        manageableComps={manageableComps}
        selectedCompId={selectedCompId}
        setSelectedComp={setSelectedCompId}
      />
      <BasicInput
        label="Organizer name"
        value={organizerName}
        setValue={setOrganizerName}
      />
      <BasicInput
        label="Organizer email"
        value={organizerEmail}
        setValue={setOrganizerEmail}
      />
      <BasicInput
        label="Link to sponsors tab"
        placeholder="https://worldcubeassociation.org/competitions/..."
        value={sponsorTab}
        setValue={setSponsorTab}
      />
      <BasicInput
        label="Link to parking tab"
        placeholder="https://worldcubeassociation.org/competitions/..."
        value={parkingTab}
        setValue={setParkingTab}
      />
    </Grid>
  );

  const hasAllInfo =
    !!selectedCompId &&
    !!organizerName &&
    !!organizerEmail &&
    !!sponsorTab &&
    !!parkingTab &&
    !!template;

  const emailParams = makeEmailParams({
    selectedComp,
    organizerEmail,
    dryRun: isDryrun,
    wcif,
  });

  const outputs = (
    <Grid container spacing={2}>
      <OutputRender template={template} templateParams={templateParams} />
      <EmailLink emailParams={emailParams} />
      <BasicCheckbox
        label="Send test email"
        checked={isDryrun}
        setChecked={setIsDryrun}
      />
    </Grid>
  );

  return (
    <Box sx={{ mt: 3 }}>
      <Box>{inputForm}</Box>
      <Box sx={{ mt: 3 }}>{hasAllInfo && outputs}</Box>
    </Box>
  );
};
