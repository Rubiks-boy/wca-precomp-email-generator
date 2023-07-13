import { useEffect } from "react";
import { EmailLink } from "./EmailLink";

type Props = {
  template: string;
  params: Record<string, string>;
};

export const Outputs = ({ template, params }: Props) => {
  const emailParams = {
    to: "test@example.com",
    bcc: "bcc@example.com",
    su: "subject",
    body: "body",
  };

  const withParamsFilledIn = Object.entries(params).reduce(
    (template, param) => template.replaceAll(`{{${param[0]}}}`, param[1]),
    template
  );
  const htmlContent = `${withParamsFilledIn}`;

  useEffect(() => {
    const iframe = window.frames[0];
    const { document } = iframe;

    document.open();
    document.write(htmlContent);
    document.close();
  }, [htmlContent]);

  return (
    <div className="Output">
      <iframe />
      <EmailLink emailParams={emailParams} />
    </div>
  );
};
