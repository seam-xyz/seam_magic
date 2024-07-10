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
    const handleDone = (data) => {
      setModel(model => ({ ...model, data }));
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
    <div className={`flex flex-col overflow-y-scroll justify-between h-full ${classes.noScrollBar}`}>
      {renderContent()}
    </div>
  )
}
