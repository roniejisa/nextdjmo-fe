"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Check } from "lucide-react";

const fields = {
  prompt: [
    "Một người đẹp trai, tóc tai gọn gàng, lịch sự, phong cách tổng tài,",
  ],
  type: [
    "",
    "3D character design, Pixar style, CGI, soft lighting, childlike charm",
  ],
};

const fields_label = {
  prompt: ["Trai đẹp"],
  type: ["Bình thường", "3D"],
};

const fieldLabels = {
  prompt: "Prompt - Nội dung",
  type: "Outfit - Trang phục (Trên người)",
};

export default function PromptTemplateApp() {
  const [values, setValues] = useState(
    Object.fromEntries(
      Object.entries(fields).map(([key, options]) => [key, options[0]])
    )
  );
  const [customValues, setCustomValues] = useState({});
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setCustomValues((prev) => ({ ...prev, [key]: "" }));
  };

  const handleCustomChange = (key, value) => {
    setCustomValues((prev) => ({ ...prev, [key]: value }));
  };

  const generatePrompt = () => {
    const finalValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) => {
        return [key, customValues[key]?.trim() || value];
      })
    );

    const prompt = `${finalValues.prompt} ${finalValues.type}, vertical composition, portrait orientation, 9:16 aspect ratio`;

    setResult(prompt);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Prompt Generator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(fields).map(([key, options]) => {
          return (
            <div key={key} className="space-y-1">
              <label className="block text-sm font-semibold">
                {fieldLabels[key]}
              </label>
              <Select
                onValueChange={(value) => handleChange(key, value)}
                defaultValue={values[key]}
              >
                <SelectTrigger>
                  <SelectValue>{values[key]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt, keyOption) => (
                    <SelectItem key={opt} value={opt}>
                      {fields_label[key][keyOption]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Hoặc nhập tùy chỉnh..."
                value={customValues[key] || ""}
                onChange={(e) => handleCustomChange(key, e.target.value)}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 items-center">
        <Button onClick={generatePrompt}>Generate Prompt</Button>
        <Button onClick={handleCopy} variant="outline">
          {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : null}
          Copy Prompt
        </Button>
      </div>
      <Textarea className="mt-4 h-96" value={result} readOnly />
    </div>
  );
}
