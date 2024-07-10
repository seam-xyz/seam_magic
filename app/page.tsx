'use client';

import { useState } from 'react';
import { SandpackProvider, SandpackCodeEditor, SandpackPreview, SandpackLayout } from "@codesandbox/sandpack-react";

const App = `
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
    <div>
      {renderContent()}
    </div>
  )
}
`;

export default function Home() {
  const [input, setInput] = useState('');
  const [blockBuilding, setBlockBuilding] = useState(false);
  const [response, setResponse] = useState(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBlockBuilding(true);
    const response = await fetch(`/api/claude?userInput=${encodeURIComponent(input)}`);
    const data = await response.json();
    
    setResponse(data.content[0].text);
  };

  const isLoading = blockBuilding && !response;

  return (
    <div className="min-h-screen">
      <AppLoader isLoading={isLoading} response={response} onSubmit={handleSubmit} input={input} setInput={setInput} />
    </div>
  );
}

interface AppLoaderProps {
  isLoading: boolean;
  response: any;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  input: string;
  setInput: (input: string) => void;
}

const AppLoader: React.FC<AppLoaderProps> = ({ isLoading, response, onSubmit, input, setInput }) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (response) {
    return (
      <SandpackProvider
        template="react"
        theme="auto"
        files={{
          "/NewApp.tsx": response!,
          "/App.js": App,
        }}
        options={{
          autoReload: true,
          activeFile: "/NewApp.tsx"
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <SandpackLayout style={{ display: "flex", width: '100%', height: '100vh' }} >
          <SandpackCodeEditor showLineNumbers showTabs={false} />
          <SandpackPreview />
        </SandpackLayout>
      </SandpackProvider>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-white p-24">
      <h1 className="mb-4 text-2xl font-bold">What miniapp do you want to create today?</h1>
      <form className="flex flex-col items-center" onSubmit={onSubmit}>
        <input
          type="text"
          className="mb-4 p-2 border border-gray-300 rounded"
          placeholder="Enter miniapp name"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Magic</button>
      </form>
    </div>
  );
};