import TabletStage from "./components/TabletStage/TabletStage";
import { SessionProvider, useSession } from "./context/SessionContext";
import { COPY } from "./config/copy";
import "./App.css";

// Placeholder temporal de Fase 1: confirma que TabletStage y SessionContext
// funcionan correctamente. Las pantallas reales (Home, Instructions, etc.)
// se implementan en las siguientes fases.
function StagePlaceholder() {
  const { currentScreen } = useSession();

  return (
    <div className="stage-placeholder">
      <p className="stage-placeholder__eyebrow">PhotoAI — Aguardiente Blanco del Valle Fiesta</p>
      <h1 className="stage-placeholder__title">{COPY.campaign.line1}</h1>
      <h2 className="stage-placeholder__title">{COPY.campaign.line2}</h2>
      <h2 className="stage-placeholder__title">{COPY.campaign.line3}</h2>
      <p className="stage-placeholder__screen">
        Pantalla actual: <strong>{currentScreen}</strong>
      </p>
    </div>
  );
}

function App() {
  return (
    <SessionProvider>
      <TabletStage>
        <StagePlaceholder />
      </TabletStage>
    </SessionProvider>
  );
}

export default App;
