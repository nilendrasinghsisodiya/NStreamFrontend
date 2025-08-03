import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useCreateComment } from "@/api/CommentApi";
import { FormEvent, useRef } from "react";

type props = {
  videoId: string;
  commentId?: string;
};

const CommentInput = ({ videoId, commentId }: props) => {
  const { createComment } = useCreateComment();
  const formRef = useRef<HTMLFormElement | null>(null);
  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    console.log("sent button clicked");
    if (formRef && formRef.current) {
      const formData = new FormData(formRef.current);
      const data = Object.fromEntries(formData.entries());
      const content = data.comment as string;
      console.log(content);
      if (content && content.length !== 0) {
        if (commentId) {
          console.log(videoId)
          createComment({ content, videoId, commentId });
        } else
        {
          console.log(videoId)
          createComment({ content, videoId });
        }
      }
    }
  };
  return (
    <>
      <form className="flex my-3" ref={formRef} onSubmit={handleSend}>
        <Input
          type="text"
          className="flex-1 px-7 py-5 1 yellow-300 z-10"
          name="comment"
          placeholder="add comment here....."
        />
        <Button
          type="submit"
          variant="outline"
          className="button_border py-4.5 bg-red-200"
        >
          <Send className="icons-s md:icons-m xl:icons-lg" />
        </Button>
      </form>
    </>
  );
};

export { CommentInput };
