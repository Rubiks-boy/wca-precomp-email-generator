import React, { useEffect, useState } from "react";
import { Inputs } from "./Inputs";
import { Outputs } from "./Outputs";
import { useManageableComps } from "./useManageableComps";
import { useScrapeSite } from "./useScrapeSite";
import { useWcifParams } from "./useWcifParams";

type Props = {
  organizerName: string;
};

export const EmailComposer = ({ organizerName }: Props) => {
  const [template, setTemplate] = useState<string>("");

  const manageableComps = useManageableComps();
  const selectedCompId = manageableComps?.[0]?.id ?? null;
  const wcifTemplateParams = useWcifParams(selectedCompId);

  useScrapeSite(selectedCompId);

  const templateParams = {
    ...wcifTemplateParams,
    PARKING_TAB: "",
    SPONSOR_TAB: "",
    ORGANIZER_NAME: "",
  };

  useEffect(() => {
    fetch("template.html")
      .then((res) => res.text())
      .then(setTemplate)
      .catch(() => {
        setTemplate("Couldn't render the email :(");
      });
  }, []);

  return (
    <div>
      <Inputs />
      <Outputs template={template} params={templateParams} />
    </div>
  );
};
