// components/TagInput.tsx
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { FormControl } from "@/components/ui/form";

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  name: string;
  disabled?: boolean;
}

export const TagInput: React.FC<TagInputProps> = ({
  value,
  onChange,
  name,
  disabled,
}) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      if (!value.includes(input.trim())) {
        onChange([...value, input.trim()]);
        setInput("");
      }
    } else if (e.key === "Backspace" && input === "") {
      e.preventDefault();
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...value];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  return (
    <FormControl>
      <div className="flex flex-wrap items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 ring-ring">
        <label htmlFor="tags">Tags</label>
        {value.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1"
          >
            {tag}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => removeTag(index)}
            />
          </Badge>
        ))}
        <input
          value={input}
          name={name}
          id="tags"
          disabled={disabled}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tags..."
          className="border-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 p-1 custom_ input"
        />
      </div>
    </FormControl>
  );
};
