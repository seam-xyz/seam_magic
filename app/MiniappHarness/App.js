export const App = `
import { useState } from 'react';
import NewApp from "./NewApp";

export default function App() {
  const [step, setStep] = useState("editBlock");
  const initialModel = {
    type: "test",
    data: {},
    uuid: "test-uuid"
  };
  const [model, setModel] = useState(initialModel);

  const editBlockStep = () => {
    const appInstance = new NewApp(model);
    appInstance.model = model;
    const handleDone = (data) => {
      let updatedModel = model.data = data;
      setModel(updatedModel);
      setStep("previewPost");
    };

    return (
      <div
        style={{
          maxHeight: "100%",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: '100%',
        }}
      >
        {appInstance.renderEditModal(handleDone)};
      </div>
    );
  };

  const previewBlockStep = () => {
    const appInstance = new NewApp(model);
    appInstance.model = model;

    return (
      <div
        style={{
          maxHeight: "100%",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: '100%',
        }}
      >
        {appInstance.render()}
      </div>
    );
  }

  const renderContent = () => {
    switch (step) {
      case "editBlock":
        return editBlockStep();
      case "previewPost":
        return previewBlockStep();
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '600px', borderRadius: '0.5rem', border: '1px solid rgba(0, 0, 0, 0.05)', margin: '1rem', padding: '1rem', alignItems: 'center' }}>
      {renderContent()}
    </div>
  )
}
`