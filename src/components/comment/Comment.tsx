
import { Button } from "../ui/button";
import   {useState } from "react";

import { Reply, ThumbsUp } from "lucide-react";
import { CommentInput } from "./CommentInput";
import { SafeAvatar } from "../avatar/Avatars";
import { useDispatch } from "react-redux";
import { resetComments } from "@/contexts/comments/commentSlice";

import { useToggleCommentLike } from "@/api/LikeApi";
import { UseInfiniteQueryResult } from "@tanstack/react-query";

type Props = {
  className?: string;
  content: string;
  username: string;
  avatar: string;
  refetch: ()=>ReturnType<UseInfiniteQueryResult["refetch"]>,
  createdAt: string;
  likes: number;
  isLiked: boolean;
  commentId: string;
  videoId: string;
 
};

const Comment = ({
  commentId,
  className,
  content,
  username,
  avatar,
  createdAt,
  likes,
  isLiked,
  videoId,
  refetch
  
}: Props) => {
 
  const [showReplyBox, setShowReplyBox] = useState<boolean>(false);
  const [currentLikes,setCurrentLikes] = useState<number>(likes);
  const [liked,setLiked] = useState<boolean>(isLiked);
  const dispatch = useDispatch();
  const {toggleLike} = useToggleCommentLike();
  // const {data:commentData} = useCreateComment();


const handleReplyBox = () => {
    // will open a replyBox below the comment card
    if (!showReplyBox) {
      setShowReplyBox(true);
    } else {
      setShowReplyBox(false);
    }
  };

  const handleToggleLike = async ()=>{
    if(liked){
      setCurrentLikes((prev) => prev-1);
      setLiked(false);
     
       
    }else{
      setCurrentLikes((prev)=>prev+1);
     
      setLiked(true);
    }
    await toggleLike({targetId:commentId})
    dispatch(resetComments());
    refetch();
  }

  return (
    <div className={`${className}`}>
      <div className="flex  gap-3 py-0.5 border-b-accent items-center border-b-2 ">
        <span className="max-h-15 max-w-15">
          <SafeAvatar avatar={avatar} username={username} to={`/channel/home?username=${username}`}/>
        </span>
        <span className="text-foreground text-md text-bold tracking-wide">{username}</span>
      </div>
      <div className="p-4 text-lg text-foreground text-md tracking-wide flex items-center outline-1 outline-red-500 flex-1 h-1/3">{content}</div>
      <div className="flex justify-around items-end">
        <div className=" flex  items-center justify-center outline-1 outline-amber-300">
         
            <p>{currentLikes}</p>
            <Button variant="ghost" onClick={handleToggleLike}>
              {liked ? (
                <ThumbsUp fill="#fff" strokeWidth={1} className="icons-s" />
              ) : (
                <ThumbsUp fill="transparent"className="icons-s"/>
              )}
            </Button>
         
        </div>
        <span className="reply" >
         <Button variant="ghost" onClick={handleReplyBox} ><Reply className="icons-s" /></Button>
        </span>
        <span>{createdAt}</span>
      </div>
      <div className="w-full">
        {showReplyBox && videoId && (
          <CommentInput videoId={videoId} commentId={commentId} />
        )}
      </div>
    </div>
  );
};

export { Comment };
