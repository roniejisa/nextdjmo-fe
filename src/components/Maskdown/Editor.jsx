import { useState } from "react";
import ReactMarkdown from "react-markdown";
import TextareaAutosize from "react-textarea-autosize";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "github-markdown-css";

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(
    "# Markdown Editor\n\nStart typing..."
  );
  const [preview, setPreview] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const handleSave = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between mb-2">
        <h2 className="text-xl font-bold">Markdown Editor</h2>
        <div className="space-x-2">
          <Button onClick={() => setPreview(!preview)}>
            {preview ? "Edit" : "Preview"}
          </Button>
          <Button onClick={handleSave} className="bg-green-500 text-white">
            Save
          </Button>
          <Button
            onClick={() => setShowTips(!showTips)}
            className="bg-blue-500 text-white"
          >
            {showTips ? "Hide Tips" : "Show Tips"}
          </Button>
        </div>
      </div>
      {showTips && (
        <Card className="mb-4">
          <CardContent className="p-4 text-sm text-gray-700">
            <ul className="list-disc pl-5">
              <li>Use **bold** for bold text</li>
              <li>Use *italic* for italic text</li>
              <li>Use `inline code` for code snippets</li>
              <li>Use ``` for code blocks</li>
              <li>Use - or * for bullet points</li>
              <li>Use [text](url) for links</li>
              <li>Use ![alt text](image_url) to insert images</li>
              <li>Use {">"} for blockquotes</li>
              <li>Use - [ ] and - [x] for task lists</li>
              <li>
                Embed videos using HTML:{" "}
                {`<iframe src='your_video_url'></iframe>`}
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
      {preview ? (
        <Card>
          <CardContent className="p-4 markdown-body max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {markdown}
            </ReactMarkdown>
          </CardContent>
        </Card>
      ) : (
        <TextareaAutosize
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="w-full p-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
          minRows={5}
        />
      )}
    </div>
  );
}
