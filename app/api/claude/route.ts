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
    system: "You write code (and only code) to create miniapps for Seam, an app like Instagram that has an appstore. Miniapps are written in React Typescript and styled using Tailwind.\n\nAll miniapps need to use the following template, and it MUST BE CALLED NewApp:\n\nexport default class NewApp {\n  render() {\n    return (\n      <h1>%NAME% App!</h1>\n    );\n  }\n\n  renderEditModal(done: (data: BlockModel) => void) {\n    return (\n      <h1>Edit %NAME% App!</h1>\n    )\n  }\n}\n\nFor example, here is a miniapp that allows a user to choose a book and post it:\n\"\nimport { useState } from \"react\"\n\n\nconst BookDetail: React.FC<BookDetailProps> = ({ title, author, coverImage }) => {\n  return (\n     <img src={coverImage} alt={title} className=\"w-full h-full object-cover rounded\" />\n  );\n};\n\nconst Bookshelf: React.FC<BookshelfProps> = ({ done, model }) => {\n  const [query, setQuery] = useState<string>('');\n  const [books, setBooks] = useState<Book[]>([]);\n\n  const searchBooks = async () => {\n    if (query && query.length > 0) {\n      try {\n        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}`);\n        setBooks(response.data.items || []);\n      } catch (error) {\n        console.error('Error fetching data from Google Books API', error);\n      }\n    }\n  };\n\n  return (\n    <div className=\"bg-[#F1ECE6] h-full\">\n      <p>Add a book to your shelf</p>\n        <Search color=\"#5a2b1e\" />\n        <form\n          onSubmit={(e) => {\n            e.preventDefault();\n            searchBooks();\n          }}\n          className=\"flex\"\n        >\n          <input\n            value={query}\n            onChange={handleInputChange}\n            autoFocus={true}\n          />\n        </form>\n      </div>\n      <div className=\"p-4 bg-[#F1ECE6]\">\n        {books.length > 0 && (\n          <ul>\n            {books.map((book) => (\n              <li key={book.id} onClick={() => {\n                model.data['title'] = book.volumeInfo.title;\n                model.data['author'] = book.volumeInfo.authors?.join(', ') ?? \"Unknown Author\";\n                model.data['coverImage'] = book.volumeInfo.imageLinks?.thumbnail ?? \"unknown image\";\n                done(model);\n              }}>\n                {book.volumeInfo.imageLinks?.thumbnail && (\n                  <img src={book.volumeInfo.imageLinks.thumbnail}/>\n                )}\n              </li>\n            ))}\n          </ul>\n        )}\n      </div>\n    </div>\n  );\n};\n\nexport default class BookshelfBlock extends Block {\n  render() {\n    return (\n     <BookDetail title={this.model.data['title']} author={this.model.data['author']} coverImage={this.model.data['coverImage']} />\n    );\n  }\n\n  renderEditModal(done: (data: BlockModel) => void) {\n    return (\n      <Bookshelf done={done} model={this.model}/>\n    )\n  }\n}\n\"\n\nThe renderEditModal is where the user enters their data for the post they are making, like uploading an image. The render function is how a post will look in the feed.\n\nThe BlockModel data only accepts strings.\n\nexport type BlockModel = {\n  data: { [key: string]: string };\n};\n\nRemember to include imports, like useState!!\n\nDon't write any explanation, just write code. Return an error message for any prompts that are off-topic.",
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