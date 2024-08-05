'use client';

import { useEffect, useState } from 'react';
import { App } from './MiniappHarness/App';
import logo from './assets/dark_single_logo.png';
import asciiStar from './assets/ascii-seam-logo-2.svg';
import { SandpackProvider, SandpackCodeEditor, SandpackPreview, SandpackLayout, useSandpack, SandpackCodeViewer } from "@codesandbox/sandpack-react";
import { LandingPageComponent } from './LandingPageComponent';
import { sendGAEvent } from '@next/third-parties/google'
import { useCompletion } from 'ai/react';

export default function Home() {
  const [blockBuilding, setBlockBuilding] = useState(false);
  const [isCodeStreamingDone, setIsCodeStreamingDone] = useState(false);
  const { completion: streamedCode, complete } = useCompletion({
    api: '/api/claude',
    onResponse: (response) => {
      setBlockBuilding(false);
    },
    onFinish: () => {
      setIsCodeStreamingDone(true);
    }
  });

  const handleSubmit = async (userInput: string) => {
    sendGAEvent('event', 'miniapp_created', { value: userInput })
    setBlockBuilding(true);
    await complete(userInput);
  };

  const isLoading = blockBuilding && streamedCode === ""
  return (
    <div className="min-h-screen">
      <AppLoader isLoading={isLoading} streamedCode={streamedCode} isCodeStreamingDone={isCodeStreamingDone} onSubmit={handleSubmit} />
    </div>
  );
}

interface AppLoaderProps {
  isLoading: boolean;
  streamedCode: any;
  isCodeStreamingDone: boolean;
  onSubmit: (userInput: string) => void;
}

const AppLoader: React.FC<AppLoaderProps> = ({ isLoading, streamedCode, isCodeStreamingDone, onSubmit }) => {
  if (isLoading) {
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

  if (streamedCode !== "") {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64px', padding: 4 }}>
          <img src={logo.src} alt="Logo" style={{ height: 48, width: 96 }} />
        </div>
        <SandpackProvider
          template="react"
          theme="auto"
          files={{
            "/NewApp.tsx": streamedCode,
            "/App.js": App,
          }}
          options={{
            autoReload: true,
            activeFile: "/NewApp.tsx",
            externalResources: ["https://cdn.tailwindcss.com"]
          }}
          customSetup={{
            dependencies: {
              "p5": "latest"
            }
          }}
          style={{ flex: 1 }}
        >
          <SandpackLayout style={{ display: "flex", height: '100%' }}>
            <SandpackCodeEditor showLineNumbers showTabs={false} style={{ height: "100%" }} />
            {isCodeStreamingDone && <SandpackPreview
              showOpenInCodeSandbox={false}
              actionsChildren={
                <button onClick={() => window.open("https://github.com/seam-xyz/Miniapp-Builder")}>
                  Ship to Seam
                </button>
              }
              style={{ height: `calc(100vh - 64px)` }}
            />}
          </SandpackLayout>
        </SandpackProvider>
      </div>
    );
  }

  return (
    <LandingPageComponent onSubmit={onSubmit} />
  );
};