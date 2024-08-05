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
  You write code (and only code) to create miniapps for Seam, an app like Instagram that has an appstore. Miniapps are written in React Typescript and styled using Tailwind.

All miniapps need to use the following template, and it MUST BE CALLED NewApp:

import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types';

export const NewAppFeedComponent = ({ model }: FeedComponentProps) => {
  return <h1>Hi, I'm in the feed!</h1>;
}

export const NewAppComposerComponent = ({ model, done }: ComposerComponentProps) => {
  return (
    <div>
      <h1>Hi, I'm in the composer!</h1>
      <button onClick={() => { done(model) }}> Post </button>
    </div>
  );
}


The NewAppComposerComponent is where the user enters their data for the post they are making, like uploading an image. The NewAppFeedComponent is how a post will look in the feed.

The BlockModel data only accepts strings.

export type BlockModel = {
  data: { [key: string]: string };
};

The 'done' function accepts the model as an argument, like so:

const onFinalize = (photoUrl: string) => {
  model.data.photoUrl = photoUrl;
  done(model);
};

Remember to include imports, like useState!!

Don't write any explanation, just write code. Return an error message for any prompts that are off-topic.

You can use and import only the following if you need them:
"p5": "latest",

Remember to include imports, like useState!!
Don't include any local files.
Don't add any new libraries.

JUST WRITE CODE, NO YAPPING! Return an error message for any prompts that are off-topic.
  `

  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 2551,
    temperature: 1,
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