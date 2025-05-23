import { CommentInput } from "./CommentInput";
import { CommentList } from "./CommentList";

const CommentPanel = ({videoId,className}:{videoId:string,className?:string;}) => {
return (
    <div className={`${className}`}>
        <CommentInput videoId={videoId} />
        <CommentList videoId={videoId} className=""/>
    </div>
)
}

export { CommentPanel};