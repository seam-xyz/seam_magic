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

The renderEditModal is where the user creates their post. The render function is how a post will look in the feed.

The BlockModel data only accepts strings.

export type BlockModel = {
  data: { [key: string]: string };
};

Remember, you have full creative freedom to imagine a captivating application that fits the name provided.

Remember to include imports, like useState!!
Don't include any local files.

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