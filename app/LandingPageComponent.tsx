import { FormEvent } from 'react';
import logo from './assets/dark_single_logo.png';

export const LandingPageComponent = ({input, setInput, onSubmit}: {input: string, setInput: (input: string) => void, onSubmit: (event: FormEvent<HTMLFormElement>) => void}) => {
  return (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64px', padding: 4 }}>
      <img src={logo.src} alt="Logo" style={{ height: 48, width: 96 }} />
    </div>
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
}