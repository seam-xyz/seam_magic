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
    <div style={{
      width: '375px',
      height: '667px',
      border: '16px solid black',
      borderTopWidth: '60px',
      borderBottomWidth: '60px',
      borderRadius: '36px',
      backgroundColor: 'white',
      boxShadow: '0 0 10px 5px gray',
      margin: 'auto',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
      }}>
        {renderContent()}
      </div>
    </div>
  )
}
`;