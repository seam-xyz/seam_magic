'use client';

import { useState } from 'react';
import { App } from './MiniappHarness/App';
import logo from './assets/dark_single_logo.png';
import asciiStar from './assets/ascii-seam-logo-2.svg';
import { SandpackProvider, SandpackCodeEditor, SandpackPreview, SandpackLayout } from "@codesandbox/sandpack-react";
import { LandingPageComponent } from './LandingPageComponent';

export default function Home() {
  const [blockBuilding, setBlockBuilding] = useState(false);
  const [response, setResponse] = useState(null);

  const handleSubmit = async (userInput: string) => {
    setBlockBuilding(true);
    const response = await fetch(`/api/claude?userInput=${encodeURIComponent(userInput)}`);
    const data = await response.json();

    setResponse(data.content[0].text);
  };

  const isLoading = blockBuilding && !response;

  return (
    <div className="min-h-screen">
      <AppLoader isLoading={isLoading} response={response} onSubmit={handleSubmit} />
    </div>
  );
}

interface AppLoaderProps {
  isLoading: boolean;
  response: any;
  onSubmit: (userInput: string) => void;
}

const AppLoader: React.FC<AppLoaderProps> = ({ isLoading, response, onSubmit }) => {
  if (true) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <style>
            {`
          @keyframes rotation {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(359deg);
            }
          }
          
          @keyframes pulse {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
            100% {
              opacity: 1;
            }
          }
        `}
          </style>
          <img
            src={asciiStar.src}
            style={{ animation: "rotation 5s infinite linear, pulse 1.5s infinite ease-in-out" }}
            alt="Loading"
          />
          <h3>*dial up noises*</h3>
        </div>
      </div>
    );
  }

  if (response !== null) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64px', padding: 4 }}>
          <img src={logo.src} alt="Logo" style={{ height: 48, width: 96 }} />
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
              style={{ height: "100vh" }}
            />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    );
  }

  return (
    <LandingPageComponent onSubmit={onSubmit} />
  );
};