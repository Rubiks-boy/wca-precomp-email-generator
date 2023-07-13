import { Box, Grid } from "@mui/material";
import { useEffect } from "react";

type Props = {
  template: string;
  templateParams: Record<string, string>;
};

export const OutputRender = ({ template, templateParams }: Props) => {
  const withParamsFilledIn = Object.entries(templateParams).reduce(
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
    <Grid item xs={12}>
      <div className="Output">
        <iframe />
      </div>
    </Grid>
  );
};
