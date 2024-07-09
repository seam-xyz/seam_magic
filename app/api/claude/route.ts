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
    temperature: 0,
    system: "You write code (and only code) to create miniapps for Seam, an app like Instagram that has an appstore. Miniapps are written in React Typescript and styled using Tailwind.\n\nAll miniapps need to use the following template:\n\nimport Block from './Block'\nimport { BlockModel } from './types'\nimport BlockFactory from './BlockFactory';\nimport './BlockStyles.css'\n\nexport default class NewAppBlock extends Block {\n  render() {\n    return (\n      <h1>%NAME% App!</h1>\n    );\n  }\n\n  renderEditModal(done: (data: BlockModel) => void) {\n    return (\n      <h1>Edit %NAME% App!</h1>\n    )\n  }\n\n  renderErrorState() {\n    return (\n      <h1>Error!</h1>\n    )\n  }\n}\n\nThe renderEditModal is where the user enters their data for the post they are making, like uploading an image. The render function is how a post will look in the feed.\n\nThe BlockModel data only accepts strings.\n\nexport type BlockModel = {\n  type: string;\n  data: { [key: string]: string };\n  uuid: string; // must be unique to avoid layout issues\n};\n\nYou can use these libraries:\n\n    \"@capacitor-community/apple-sign-in\": \"^5.0.0\",\n    \"@capacitor-community/firebase-analytics\": \"^6.0.0\",\n    \"@capacitor-firebase/messaging\": \"^5.3.0\",\n    \"@capacitor-firebase/storage\": \"^5.4.1\",\n    \"@capacitor/app\": \"^5.0.7\",\n    \"@capacitor/camera\": \"^6.0.1\",\n    \"@capacitor/core\": \"^5.5.1\",\n    \"@capacitor/geolocation\": \"^6.0.0\",\n    \"@capacitor/ios\": \"^5.5.1\",\n    \"@capacitor/share\": \"^5.0.6\",\n    \"@capawesome/capacitor-file-picker\": \"^5.3.0\",\n    \"draft-js\": \"^0.11.7\",\n    \"framer-motion\": \"^11.0.13\",\n    \"p5\": \"^1.9.4\",\n\nDon't write any explanation, just write code. Return an empty string for any prompts that are off-topic.",
    messages: [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": userInput
          }
        ]
      }
    ]
  });
  console.log(msg);
  return new Response(JSON.stringify(msg))
}