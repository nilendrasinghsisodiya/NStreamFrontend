import { Button } from "@/components/ui/button";
import { useState } from "react";

import { ThumbsUp } from "lucide-react";
import { SafeAvatar } from "../avatar/Avatars";

import { useToggleCommentLike } from "@/api/LikeApi";
import { UseInfiniteQueryResult } from "@tanstack/react-query";
import { getRelativeTime } from "@/utils";

type Props = {
  className?: string;
  content: string;
  username: string;
  avatar: string;
  refetch: () => ReturnType<UseInfiniteQueryResult["refetch"]>;
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
  refetch,
}: Props) => {
  const [currentLikes, setCurrentLikes] = useState<number>(likes);
  const [liked, setLiked] = useState<boolean>(isLiked);
  const { toggleLike } = useToggleCommentLike();

  const handleToggleLike = async () => {
    if (liked) {
      setCurrentLikes((prev) => prev - 1);
      setLiked(false);
    } else {
      setCurrentLikes((prev) => prev + 1);

      setLiked(true);
    }
    await toggleLike({ targetId: commentId });
    refetch();
  };

  return (
    <div className={`${className}`}>
      <div className="flex  gap-3 py-0.5 border-b-accent pb-2 items-center border-b-2 ">
        <span className="max-h-12 max-w-12">
          <SafeAvatar
            failLink="#"
            avatar={avatar}
            username={username}
            to={`/channel/home?username=${username}`}
          />
        </span>
        <span className="text-foreground text-md text-bold tracking-wide">
          {username}
        </span>
      </div>
      <div className="p-4 text-lg text-foreground text-md tracking-wide flex items-center 1 -500 flex-1 h-1/3">
        {content}
      </div>
      <div className="flex justify-around items-end">
        <div className=" flex  items-center justify-center 1 amber-300">
          <p>{currentLikes}</p>
          <Button variant="ghost" onClick={handleToggleLike}>
            {liked ? (
              <ThumbsUp fill="#fff" strokeWidth={1} className="icons-s" />
            ) : (
              <ThumbsUp fill="transparent" className="icons-s" />
            )}
          </Button>
        </div>
        <span className="text-xs m-0.5 text-muted-foreground tracking-tight">
          {getRelativeTime(createdAt)}
        </span>
      </div>
    </div>
  );
};

export { Comment };
