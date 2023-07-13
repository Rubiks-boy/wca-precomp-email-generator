import { Checkbox, Switch, FormLabel, Grid } from "@mui/material";

export const BasicToggleInput = ({
  label,
  checked,
  setChecked,
  type = "checkbox",
}: {
  label: string;
  checked: boolean;
  setChecked: (checked: boolean) => void;
  type?: "checkbox" | "switch";
}) => {
  const Component = type === "switch" ? Switch : Checkbox;

  return (
    <Grid item xs={6} sm={4} sx={{ display: "flex", alignItems: "center" }}>
      <Component
        sx={type === "checkbox" ? { pl: 0 } : {}}
        checked={checked}
        onChange={() => setChecked(!checked)}
      />
      <FormLabel>{label}</FormLabel>
    </Grid>
  );
};
