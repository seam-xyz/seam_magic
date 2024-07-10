export const dynamic = 'force-dynamic'; // static by default, unless reading the request
import Anthropic from "@anthropic-ai/sdk";

export async function GET(request: Request) {
  const anthropic = new Anthropic({
    apiKey: process.env["ANTHROPIC_API_KEY"]
  });

  const userInput = new URL(request.url).searchParams.get("userInput");
  if (!userInput) {
    return new Response("Missing userInput query parameter", { status: 400 });
  }

  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 2551,
    temperature: 0.2,
    system: "You write code (and only code) to create miniapps for Seam, an app like Instagram that has an appstore. Miniapps are written in React Typescript and styled using Tailwind. Style the components to look like Instagram.\n\nAll miniapps need to use the following template, and it MUST BE CALLED NewApp:\n\nexport default class NewApp {\n  render() {\n    return (\n      <h1>%NAME% App!</h1>\n    );\n  }\n\n  renderEditModal(done: (data: BlockModel) => void) {\n    return (\n      <h1>Edit %NAME% App!</h1>\n    )\n  }\n}\n\nFor example, here is a miniapp that allows a user to post a text of their thoughts:\n\"\nimport { useState } from \"react\"\n\n\nconst ThoughtPreview: React.FC<{ content: string, textColor: string, bgColor: string }> = ({ content, textColor, bgColor }) => {\n  const [fontLoaded, setFontLoaded] = useState<boolean>(false);\n  return (\n    <p style={fontLoaded ? { fontFamily: 'Seam Community Font, fantasy', color: textColor, backgroundColor: bgColor, fontSize: \"20px\" } : {}}>{content}</p>\n  )\n}\n\ninterface ThoughtEditorProps {\n  model: BlockModel;\n  done: (data: BlockModel) => void;\n}\n\nconst ThoughtEditor: React.FC<ThoughtEditorProps> = ({ model, done }) => {\n  const [thought, setThought] = useState('');\n  const [bgColor, setBgColor] = useState('#ffffff');\n  const [textColor, setTextColor] = useState('#000000');\n\n  const handleSubmit = () => {\n    done({\n      ...model,\n      data: {\n        thought,\n        bgColor,\n        textColor\n      }\n    });\n  };\n\n  return (\n    <>\n      <h2 className=\"text-xl mb-4\">Just A Thought</h2>\n      <textarea\n        value={thought}\n        onChange={(e) => setThought(e.target.value)}\n        maxLength={120}\n        className=\"w-full p-2 mb-4 border rounded\"\n        placeholder=\"Enter your thought (max 120 characters)\"\n      />\n      <div className=\"mb-4\">\n        <label className=\"block mb-2\">Background Color:</label>\n        <input\n          type=\"color\"\n          value={bgColor}\n          onChange={(e) => setBgColor(e.target.value)}\n          className=\"w-full\"\n        />\n      </div>\n      <div className=\"mb-4\">\n        <label className=\"block mb-2\">Text Color:</label>\n        <input\n          type=\"color\"\n          value={textColor}\n          onChange={(e) => setTextColor(e.target.value)}\n          className=\"w-full\"\n        />\n      </div>\n      <div className=\"mb-4\">\n        <p>Preview:<br/></p>\n        <div className=\"inline-block\">\n          <ThoughtPreview content={thought} textColor={textColor} bgColor={bgColor} />\n        </div>\n      </div>\n      <button\n        onClick={handleSubmit}\n        className=\"bg-blue-500 text-white px-4 py-2 rounded\"\n      >\n        Post Thought\n      </button>\n    </>\n  )\n}\n\nexport default class JustAThoughtBlock extends Block {\n  render() {\n    const { bgColor, textColor, thought } = this.model.data;\n    return (\n      <div className=\"inline-block\">\n        <ThoughtPreview content={thought} bgColor={bgColor} textColor={textColor} />\n      </div>\n    );\n  }\n\n  renderEditModal(done: (data: BlockModel) => void) {\n    return (\n      <ThoughtEditor model={this.model} done={done} />\n    )\n  }\n}\n\"\n\nThe renderEditModal is where the user enters their data for the post they are making, like uploading an image. The render function is how a post will look in the feed.\n\nThe BlockModel data only accepts strings.\n\nexport type BlockModel = {\n  data: { [key: string]: string };\n};\n\nRemember to include imports, like useState!!\n\nDon't write any explanation, just write code. Return an error message for any prompts that are off-topic.",
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