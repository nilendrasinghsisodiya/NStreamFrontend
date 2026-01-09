import { Separator } from "@radix-ui/react-separator";
import { CommentInput } from "./CommentInput";
import { CommentList } from "./CommentList";

const CommentPanel = ({
  videoId,
  className,
}: {
  videoId: string;
  className?: string;
}) => {
  return (
    <div className={className}>
      <span className="h-1/12 w-full">
        <CommentInput videoId={videoId} />
        <Separator className="w-full text-accent-foreground" />
      </span>
      <CommentList videoId={videoId} />
    </div>
  );
};

export { CommentPanel };
