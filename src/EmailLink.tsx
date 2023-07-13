import React from "react";

type EmailParams = {
  to: string;
  bcc: string;
  su: string;
  body: string;
};

export const EmailLink = ({ emailParams }: { emailParams: EmailParams }) => {
  const queryParams = Object.entries(emailParams)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  const link = `https://mail.google.com/mail/?view=cm&${queryParams}`;

  return (
    <div className="EmailLink">
      <a href={link} target="_blank">
        Test
      </a>
    </div>
  );
};
