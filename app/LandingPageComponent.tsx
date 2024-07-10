import { FormEvent, useState } from 'react';
import logo from './assets/dark_single_logo.png';
import appstore from './assets/appstore.svg';

export const LandingPageComponent = ({ onSubmit }: { onSubmit: (userInput: string) => void }) => {
  const [input, setInput] = useState('');
  return (
    <div className="flex flex-col w-full h-full">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64px', padding: 4 }}>
        <img src={logo.src} alt="Logo" style={{ height: 48, width: 96 }} />
      </div>
      <div className="bg-red">

      </div>
      <div className="flex flex-col items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Welcome to the Seam Mini app Ai Builder</h1>
          <p className="text-center text-gray-600 mb-4">
            Create & Discover Miniapps For builders, designers, and curators
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2 block">
            What miniapp do you want to create today?
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="A watercolor mini app..."
              value={input}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <button onClick={() => onSubmit(input)} type="submit"
            className="mt-4 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Magic
          </button>
        </div>

        <div className='flex flex-col items-center'>
          <p className="mt-4 text-gray-500">
            Learn more about miniapps at <a href="https://getseam.xyz" className="text-purple-600">getseam.xyz</a>
          </p>
          <button className="mt-2">
            <a href="https://apps.apple.com/us/app/seam-social/id6473547569">
              <img src={appstore.src} alt="Download on the App Store" />
            </a>
          </button>
        </div>

      </div>
    </div>
  );
}