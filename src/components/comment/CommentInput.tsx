import { Send } from "lucide-react";
import { Button } from "../ui/button";
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
      <form className="flex my-3 gap-1 w-full h-fit p-3" ref={formRef} onSubmit={handleSend}>
        <label htmlFor="comment" className="hidden fixed"></label><input 
          type="text"
          id="comment"
          className="flex-1 w-11/12 z-10 hit-fit custom_input"
          name="comment"
          placeholder="add comment here....."
        />
        <Button
          type="submit"
          variant="ghost"
          className=" h-full "
        >
          <Send className="icons-s md:icons-m xl:icons-lg" />
        </Button>
      </form>
    </>
  );
};

export { CommentInput };
