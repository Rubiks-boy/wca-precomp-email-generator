import { Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  template: string;
  boilerplate: string;
  templateParams: Record<string, string>;
  allowEditing: boolean;
};

export const OutputRender = ({
  template: baseTemplate,
  boilerplate,
  templateParams,
  allowEditing,
}: Props) => {
  const [template, setTemplate] = useState<string>(baseTemplate);
  const withParamsFilledIn = Object.entries(templateParams).reduce(
    (template, param) => template.replaceAll(`{{${param[0]}}}`, param[1]),
    template
  );
  const htmlContent = boilerplate.replace("<body></body>", withParamsFilledIn);

  useEffect(() => {
    const iframe = window.frames[0];
    const { document } = iframe;

    document.open();
    document.write(htmlContent);
    document.close();
  }, [htmlContent]);

  return (
    <Grid className="OutputRender" container item xs={12} spacing={2}>
      {allowEditing && (
        <Grid item xs={12} md={6}>
          <TextField
            id="outlined-multiline-flexible"
            multiline
            fullWidth
            defaultValue={baseTemplate}
            onChange={(e) => setTemplate(e.target.value)}
            maxRows={25}
          />
        </Grid>
      )}
      <Grid item xs={12} md={allowEditing ? 6 : 12}>
        <div className="OutputRender-frameContainer">
          <iframe />
        </div>
      </Grid>
    </Grid>
  );
};
