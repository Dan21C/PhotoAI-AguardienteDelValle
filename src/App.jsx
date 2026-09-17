import TabletStage from "./components/TabletStage/TabletStage";
import HomeScreen from "./screens/HomeScreen/HomeScreen";
import InstructionsScreen from "./screens/InstructionsScreen/InstructionsScreen";
import { SessionProvider, useSession } from "./context/SessionContext";
import { SCREENS } from "./config/appConfig";
import "./App.css";

// Placeholder temporal: las pantallas posteriores a Home (Instructions,
// Camera, etc.) se implementan en sus fases correspondientes.
function TemporaryScreen({ screen }) {
  return (
    <div className="stage-placeholder">
      <p className="stage-placeholder__screen">
        Pantalla actual: <strong>{screen}</strong>
      </p>
    </div>
  );
}

function ExperienceRouter() {
  const { currentScreen } = useSession();

  if (currentScreen === SCREENS.HOME) {
    return <HomeScreen />;
  }

  if (currentScreen === SCREENS.INSTRUCTIONS) {
    return <InstructionsScreen />;
  }

  return <TemporaryScreen screen={currentScreen} />;
}

function App() {
  return (
    <SessionProvider>
      <TabletStage>
        <ExperienceRouter />
      </TabletStage>
    </SessionProvider>
  );
}

export default App;
