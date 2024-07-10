'use client';

import { useState } from 'react';
import { App } from './MiniappHarness/App';
import logo from './assets/dark_single_logo.png';
import { SandpackProvider, SandpackCodeEditor, SandpackPreview, SandpackLayout } from "@codesandbox/sandpack-react";

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

  if (response !== null) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64px', padding: 4 }}>
          <img src={logo.src} alt="Logo" style={{height: 48, width: 96}} />
        </div>
        <SandpackProvider
          template="react"
          theme="auto"
          files={{
            "/NewApp.tsx": response!,
            "/App.js": App,
          }}
          dependencies={{

          }}
          options={{
            autoReload: true,
            activeFile: "/NewApp.tsx"
          }}
          style={{ flex: 1 }}
        >
          <SandpackLayout style={{ display: "flex", height: '100%' }}>
            <SandpackCodeEditor showLineNumbers showTabs={false} style={{ height: "100%" }} />
            <SandpackPreview 
            showOpenInCodeSandbox={false} 
            actionsChildren={
              <button onClick={() => window.open("https://github.com/seam-xyz/Miniapp-Builder")}>
                Ship to Seam
              </button>
            }
            />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col items-center justify-center p-24">
        <h1 className="mb-4 text-2xl font-bold">What miniapp do you want to create today?</h1>
        <form className="flex flex-col items-center" onSubmit={onSubmit}>
          <input
            type="text"
            className="mb-4 p-2 border border-gray-300 rounded"
            placeholder="Enter miniapp name"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <p> powered by claude </p>
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">Magic</button>
        </form>
      </div>
      <div className="flex-1 overflow-auto bg-red">
        {/* Replace this with your image feed */}
        {/* <img src="image1.jpg" alt="Image 1" />
        <img src="image2.jpg" alt="Image 2" />
        <img src="image3.jpg" alt="Image 3" /> */}
        {/* ... */}
      </div>
    </div>
  );
};