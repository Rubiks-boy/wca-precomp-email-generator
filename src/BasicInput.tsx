import { Grid, TextField } from "@mui/material";

export const BasicInput = ({
  label,
  placeholder,
  value,
  setValue,
}: {
  label: string;
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
}) => {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <TextField
        fullWidth
        placeholder={placeholder}
        label={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Grid>
  );
};
