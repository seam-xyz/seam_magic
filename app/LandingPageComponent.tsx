import { useEffect, useState } from 'react';
import logo from './assets/dark_single_logo.png';
import appstore from './assets/appstore.svg';
import './LandingPage.css';
import { sendGAEvent } from '@next/third-parties/google'

export const LandingPageComponent = ({ onSubmit }: { onSubmit: (userInput: string) => void }) => {
  const [input, setInput] = useState('');
  const [placeholder, setPlaceholder] = useState('');

  const placeholders = [
    'a whiteboard miniapp to share doodles with friends',
    'a star rating slider to rate your hot takes',
    'A recipe sharing mini app...',
    // add more placeholders here
  ];

  useEffect(() => {
    let i = 0;
    const changePlaceholder = () => {
      setPlaceholder(placeholders[i]);
      i = (i + 1) % placeholders.length;
    };
    const intervalId = setInterval(changePlaceholder, 4000); // change every 4 seconds
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col w-full h-screen p-4">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64px', padding: 4 }}>
        <img src={logo.src} alt="Logo" style={{ height: 48, width: 96 }} />
      </div>
      <div className='flex flex-row h-full'>
        <div className="flex flex-col justify-between items-center w-full">
          <div>
            {/* <h3 className="text-lg mb-2">seam ✨ magic ✨ miniapp maker</h3> */}
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-8">
              What miniapp do you want to create today?
            </h1>
            <div className="items-center">
              <input
                type="text"
                value={input}
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 typewriter"
                placeholder={placeholder}
                onChange={(e) => setInput(e.target.value)}
              />
              <p className="mt-1 text-gray-400 text-xs">
                Powered by <a href="https://www.anthropic.com/news/claude-3-5-sonnet" className="text-blue-400">Claude 3.5</a>
              </p>
            </div>
            <button onClick={() => onSubmit(input)} type="submit"
              className="mt-4 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              cook
            </button>
          </div>

          <div className='flex flex-col items-center'>
            <p className="mt-4 text-gray-500">
              Learn more about miniapps at <a href="https://getseam.xyz" className="text-purple-600">getseam.xyz</a>
            </p>
            <button className="mt-2" onClick={() => {sendGAEvent('event', 'appstore_tapped')}}>
              <a href="https://apps.apple.com/us/app/seam-social/id6473547569">
                <img src={appstore.src} alt="Download on the App Store" />
              </a>
            </button>
          </div>
        </div>
        <div className="flex flex-col w-[40%] h-full rounded-lg border p-4 mr-4 items-center">
          <h1 className="text-xl font-bold mb-4"> Preview </h1>
          <h2 className="mb-2"> <a href="https://www.seam.so" className="text-blue-400">Seam</a> is a social network where the posts are made from user created miniapps. </h2>
          <iframe src={"/example_feed.html"} className="w-full h-full bg-white" />
        </div>
      </div>
    </div>
  );
}