import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Grid,
} from "@mui/material";
import { ManageableCompetition } from "./wcaApi";

export const ChooseCompetition = ({
  manageableComps,
  selectedCompId,
  setSelectedComp,
}: {
  manageableComps: Array<ManageableCompetition>;
  selectedCompId: string | null;
  setSelectedComp: (compId: string) => void;
}) => {
  const handleChooseComp = (e: SelectChangeEvent<string | null>) => {
    const newId = e.target.value;

    if (newId) {
      setSelectedComp(newId);
    }
  };

  return (
    <Grid item xs={12} md={4}>
      <FormControl fullWidth>
        <InputLabel id="choose-competition-label">Competition</InputLabel>
        <Select
          labelId="choose-competition-label"
          label="Competition"
          value={selectedCompId}
          onChange={handleChooseComp}
        >
          {manageableComps.map(({ id, name }) => (
            <MenuItem value={id} key={id}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
};
