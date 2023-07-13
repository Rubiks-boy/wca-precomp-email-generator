import { Link, Button, Grid } from "@mui/material";

export type EmailParams = {
  to: string;
  cc: string;
  bcc: string;
  su: string;
  body: string;
};

export const EmailLink = ({
  emailParams,
  dryRun,
}: {
  emailParams: EmailParams;
  dryRun: boolean;
}) => {
  const queryParams = Object.entries(emailParams)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  const link = `https://mail.google.com/mail/?view=cm&${queryParams}`;

  const openLink = () => {
    window.open(link, "_blank");
  };

  return (
    <Grid item xs={12}>
      <Button variant="contained" onClick={openLink}>
        Compose {dryRun ? "test" : ""} email in gmail
      </Button>
    </Grid>
  );
};
