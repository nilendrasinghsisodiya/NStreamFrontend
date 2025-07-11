import { useGetVideoComments } from "@/api/CommentApi";
import {  VirtuosoGrid } from "react-virtuoso";
import type { GridComponents } from "react-virtuoso";
import { Comment } from "./Comment";
import React, { useEffect } from "react";
import { selectComments, setComments } from "@/contexts/comments/commentSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";


const Item: GridComponents["Item"] = React.forwardRef(
  ({ style, children, ...props },ref) => (
    <div
      ref={ref}
      {...props}
      style={{ ...style }}
      className="  min-w-20 min-h-20"
    >
      {children}
    </div>
  )
);
const CommentList = ({ videoId }: { videoId: string; className?: string }) => {
  const { data, fetchNextPage, refetch, hasNextPage, isError, error } =
    useGetVideoComments({ videoId, limit: 10 });
  const comments = useSelector(selectComments);
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      const fetchedComments = data.pages.flatMap((value) => value.comments);
      dispatch(setComments(fetchedComments));
      console.log(fetchedComments);
    }
  }, [data, dispatch, comments]);

  return (
    <>
      {comments.length > 0 ? (
        <VirtuosoGrid
        style={{height:"100%"}}
          aria-rowspan={4}
          className="flex overflow-scroll  outline-2 outline-red-200 "
          data={comments}
          overscan={5}
          components={{
            Item: Item,
            
          }}
          itemContent={(index, data) => (
            <Comment
              avatar={data.owner.avatar}
              commentId={data._id}
              content={data.content}
              createdAt={data.createdAt}
              isLiked={data.isLiked}
              likes={data.likeCount}
              username={data.owner.username}
              key={data._id + index}
              videoId={videoId}
              refetch={refetch}
              className="flex flex-col w-full my-3 min-h-50 outline-1 outline-blue-400 border-[0px] border-transparent border-b-foreground border-b-2 z-50"
            />
          )}
          totalCount={comments.length}
          endReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          isScrolling={() => {
            console.log("scrolling comments");
          }}
        />
      ) : isError ? (
        <p>{error?.message}</p>
      ) : (
        <p>No Comments yet....</p>
      )}
    </>
  );
};

export { CommentList };
