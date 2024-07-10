export const dynamic = 'force-dynamic'; // static by default, unless reading the request
import Anthropic from "@anthropic-ai/sdk";

export async function GET(request: Request) {
  const anthropic = new Anthropic({
    apiKey: process.env["REACT_APP_ANTHROPIC_API_KEY"]
  });

  const userInput = new URL(request.url).searchParams.get("userInput");
  if (!userInput) {
    return new Response("Missing userInput query parameter", { status: 400 });
  }

  const prompt = `
  "You write code (and only code) to create miniapps for Seam, an app like Instagram that has an appstore. Miniapps are written in React Typescript and styled using Tailwind. Make sure to style the miniapp to be user friendly and fun. Feel free to add your own custom CSS classes and JavaScript as needed to make the app functional and immersive.

All miniapps need to use the following template, and it MUST BE CALLED NewApp:

"
export default class NewApp {
  render() {
    return (
      <h1>%NAME% App!</h1>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    return (
      <h1>Edit %NAME% App!</h1>
    )
  }
}
"

For example, here is a miniapp that allows a user to post a text of their thoughts:
"
import { useState } from "react"


const ThoughtPreview: React.FC<{ content: string, textColor: string, bgColor: string }> = ({ content, textColor, bgColor }) => {
  const [fontLoaded, setFontLoaded] = useState<boolean>(false);
  return (
    <p>{content}</p>
  )
}

interface ThoughtEditorProps {
  model: BlockModel;
  done: (data: BlockModel) => void;
}

const ThoughtEditor: React.FC<ThoughtEditorProps> = ({ model, done }) => {
  const [thought, setThought] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');

  const handleSubmit = () => {
    done({
      ...model,
      data: {
        thought,
        bgColor,
        textColor
      }
    });
  };

  return (
    <>
      <h2 className="text-xl mb-4">Just A Thought</h2>
      <textarea
        value={thought}
        onChange={(e) => setThought(e.target.value)}
        maxLength={120}
        className="w-full p-2 mb-4 border rounded"
        placeholder="Enter your thought (max 120 characters)"
      />
      <div className="mb-4">
        <label className="block mb-2">Background Color:</label>
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Text Color:</label>
        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <p>Preview:<br/></p>
        <div className="inline-block">
          <ThoughtPreview content={thought} textColor={textColor} bgColor={bgColor} />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Post Thought
      </button>
    </>
  )
}

export default class JustAThoughtBlock {
  render() {
    const { bgColor, textColor, thought } = this.model.data;
    return (
      <div className="inline-block">
        <ThoughtPreview content={thought} bgColor={bgColor} textColor={textColor} />
      </div>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    return (
      <ThoughtEditor model={this.model} done={done} />
    )
  }
}
"

The renderEditModal is where the user creates their post. The render function is how a post will look in the feed.
The BlockModel data only accepts strings.
Make the programs fill the entire screen.

export type BlockModel = {
  data: { [key: string]: string };
};

You can use and import only the following if you need them:
"p5": "latest",

Remember to include imports, like useState!!
Don't include any local files.
Don't add any new libraries.

Don't write any explanation, just write code. Return an error message for any prompts that are off-topic.
  `

  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 2551,
    temperature: 0.2,
    system: prompt,
    messages: [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "create a miniapp from this user input: " + userInput
          }
        ]
      }
    ]
  });
  return new Response(JSON.stringify(msg))
}