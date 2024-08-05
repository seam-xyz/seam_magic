export const dynamic = 'force-dynamic'; // static by default, unless reading the request
import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

export async function POST(req: Request, res: Response) {
  console.log("hi, the server is being called")
  const anthropic = createAnthropic({
    apiKey: process.env["REACT_APP_ANTHROPIC_API_KEY"]
  });

  const { prompt }: { prompt: string } = await req.json();
  if (!prompt) {
    return new Response("Missing userInput query parameter", { status: 400 });
  }

  const system = `
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

  const result = await streamText({
    model: anthropic("claude-3-5-sonnet-20240620"),
    //max_tokens: 2551,
    temperature: 1,
    system: system,
    messages: [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "create a miniapp from this user input: " + prompt
          }
        ]
      }
    ]
  });

  return result.toDataStreamResponse();
}