import { CommentInput } from "./CommentInput";
import { CommentList } from "./CommentList";

const CommentPanel = ({
  videoId,
  className,
  onFocus,
  onBlur
}: {
  videoId: string;
  className?: string;
  onFocus: (e: React.FocusEvent) => void;
  onBlur:(e:React.FocusEvent)=>void;
}) => {
  return (
    <div className={className} onFocus={onFocus} onBlur={onBlur}>
      <CommentInput videoId={videoId} />
      <CommentList videoId={videoId} />
    </div>
  );
};

export { CommentPanel };
