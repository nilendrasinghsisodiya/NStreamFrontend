import { useGetVideoComments } from "@/api/CommentApi";
import { VirtuosoGrid } from "react-virtuoso";
import type { GridComponents } from "react-virtuoso";
import { Comment } from "./Comment";
import React, { useEffect, useState } from "react";

import { ErrorScreen } from "../ErrorComponent";

const Item: GridComponents["Item"] = React.forwardRef(
  ({ style, children, ...props }, ref) => (
    <div ref={ref} {...props} style={{ ...style }} className="  h-fit w-full">
      {children}
    </div>
  )
);
const CommentList = ({ videoId }: { videoId: string; className?: string }) => {
  const { data, fetchNextPage, refetch, hasNextPage, isError, error } =
    useGetVideoComments({ videoId, limit: 20 });
  const [comments, setComments] = useState<IComment[]>([]);

  useEffect(() => {
    if (data) {
      const fetchedComments = data.pages.flatMap((value) => value.comments);
      setComments(fetchedComments);
      console.log(fetchedComments);
    }
  }, [data]);

  useEffect(() => {
    return () => {
      setComments([]);
    };
  }, []);

  return (
    <>
      {comments.length > 0 ? (
        <VirtuosoGrid
          className="grid grid-cols-1 h-11/12 justify-center gap-2 w-full mb-26 p-y-14 "
          data={comments}
          overscan={15}
          components={{
            Item: Item,
          }}
          increaseViewportBy={100}
          itemContent={(_, data) => (
            <Comment
              avatar={data.owner.avatar}
              commentId={data._id}
              content={data.content}
              createdAt={data.createdAt}
              isLiked={data.isLiked}
              likes={data.likesCount}
              username={data.owner.username}
              videoId={videoId}
              refetch={refetch}
              className="flex flex-col w-full h-[220px] border-[0px] border-transparent border-b-foreground border-b-2 p-2"
            />
          )}
          computeItemKey={(_, val) => val._id}
          endReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
        />
      ) : isError ? (
        <ErrorScreen mainMessage={error?.message || "something went wrong"} />
      ) : (
        <ErrorScreen mainMessage="no comments found" />
      )}
    </>
  );
};

export { CommentList };
