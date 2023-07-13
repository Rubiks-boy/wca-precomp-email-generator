import { AccessTokenProvider } from "./AccessTokenProvider";
import "./App.css";
import { EmailComposer } from "./EmailComposer";

function App() {
  return (
    <AccessTokenProvider>
      <div>
        <h1>Vite + React</h1>
        <EmailComposer />
      </div>
    </AccessTokenProvider>
  );
}

export default App;
