import { Box, Grid } from "@mui/material";
import { Competition } from "@wca/helpers";
import { useEffect, useRef, useState } from "react";
import { BasicToggleInput } from "./BasicToggleInput";
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
    su: `${dryRun ? "[Test]" : ""}[${
      selectedComp.name
    }] See you this ${dayOfWeek}!`,
    body: "Select all and copy the email rendering in the other tab. Then, paste it here.",
  };
};

export const EmailComposer = () => {
  const [template, setTemplate] = useState<[string, string]>(["", ""]);
  const [organizerName, setOrganizerName] = useState<string>("");
  const [organizerEmail, setOrganizerEmail] = useState<string>("");
  const [sponsorTab, setSponsorTab] = useState<string>("");
  const [parkingTab, setParkingTab] = useState<string>("");
  const [selectedCompId, setSelectedCompId] = useState<string>("");
  const [isDryrun, setIsDryrun] = useState<boolean>(true);
  const [allowEditing, setAllowEditing] = useState<boolean>(false);
  const [hasVending, setHasVending] = useState<boolean>(true);
  const shouldRenderOutput = useRef<boolean>(false);

  const manageableComps = useManageableComps();
  const wcif = useFetchWcif(selectedCompId);
  const wcifTemplateParams = useWcifParams(wcif);

  const selectedComp = manageableComps.find(({ id }) => id === selectedCompId);

  const templateParams = {
    ...wcifTemplateParams,
    PARKING_TAB: parkingTab.split("#")[1] ?? "",
    SPONSOR_TAB: sponsorTab.split("#")[1] ?? "",
    ORGANIZER_NAME: organizerName,
    VENDING_SENTENCE: hasVending
      ? "We will also have a small booth vending competition and PNW merch!"
      : "",
  };

  useEffect(() => {
    Promise.all([
      fetch("template.html").then((res) => res.text()),
      fetch("boilerplate.html").then((res) => res.text()),
    ])
      .then(setTemplate)
      .catch(() => {
        setTemplate(["", "Couldn't render the email :("]);
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
      <BasicToggleInput
        label="Comp has vending"
        checked={hasVending}
        setChecked={setHasVending}
      />
    </Grid>
  );

  if (
    !!selectedCompId &&
    !!organizerName &&
    !!organizerEmail &&
    !!sponsorTab &&
    !!parkingTab &&
    !!template
  ) {
    shouldRenderOutput.current = true;
  }

  const emailParams = makeEmailParams({
    selectedComp,
    organizerEmail,
    dryRun: isDryrun,
    wcif,
  });

  const outputs = (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <OutputRender
        template={template[0]}
        boilerplate={template[1]}
        templateParams={templateParams}
        allowEditing={allowEditing}
      />
      <EmailLink emailParams={emailParams} dryRun={isDryrun} />
      <BasicToggleInput
        label="Send test email"
        checked={isDryrun}
        setChecked={setIsDryrun}
      />
      <BasicToggleInput
        label="Edit email template"
        checked={allowEditing}
        setChecked={setAllowEditing}
        type="switch"
      />
    </Grid>
  );

  return (
    <Box sx={{ mt: 3 }}>
      <Box>{inputForm}</Box>
      <Box sx={{ mt: 3 }}>{shouldRenderOutput.current && outputs}</Box>
    </Box>
  );
};
