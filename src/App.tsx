import { Container, CssBaseline, Typography } from "@mui/material";
import { AccessTokenProvider } from "./AccessTokenProvider";
import "./App.css";
import { EmailComposer } from "./EmailComposer";

function App() {
  return (
    <AccessTokenProvider>
      <CssBaseline />
      <Container sx={{ pt: 3 }}>
        <Typography
          variant="h1"
          component="div"
          sx={{ flexGrow: 1, fontSize: "2rem" }}
        >
          WCA pre-competition email generator
        </Typography>
        <EmailComposer />
      </Container>
    </AccessTokenProvider>
  );
}

export default App;
