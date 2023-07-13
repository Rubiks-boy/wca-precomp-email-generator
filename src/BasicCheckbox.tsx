import { Checkbox, FormLabel, Grid } from "@mui/material";

export const BasicCheckbox = ({
  label,
  checked,
  setChecked,
}: {
  label: string;
  checked: boolean;
  setChecked: (checked: boolean) => void;
}) => {
  return (
    <Grid item xs={6} sm={4} sx={{ display: "flex", alignItems: "center" }}>
      <Checkbox
        sx={{ pl: 0 }}
        checked={checked}
        onChange={() => setChecked(!checked)}
      />
      <FormLabel>{label}</FormLabel>
    </Grid>
  );
};
