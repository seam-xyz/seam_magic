'use client';

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [blockBuilding, setBlockBuilding] = useState(false);
  const [response, setResponse] = useState(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBlockBuilding(true);
    const response = await fetch(`/api/claude?userInput=${encodeURIComponent(input)}`);
    const data = await response.json();
    console.log(data);
    // handle the response data
    setResponse(data.content[0].text);
  };

  const isLoading = blockBuilding && !response;

  return (
    <main className="flex min-h-screen flex-row">
      <AppLoader isLoading={isLoading} response={response} onSubmit={handleSubmit} input={input} setInput={setInput} />
      <div className="flex-1">
        {blockBuilding && (
          <iframe src="https://codesandbox.io/p/github/seam-xyz/Miniapp-Builder/quickstart?embed=1&file=%2Fsrc%2Fblocks%2FNewApp.tsx"
            style={{width: '100%', height: '100%', border: '0', borderRadius: '4px', overflow: 'hidden'}}
            title="seam-xyz/Miniapp-Builder/csb-9wmzc3/draft/recursing-moore"
            allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          ></iframe>
        )}
      </div>
    </main>
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
      <div className="flex-1 flex flex-col justify-center">
        {response.split('\n').map((line: string, index: number) => (
          <p key={index}>{line}</p>
        ))}
      </div>
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