import { useGetVideoComments } from "@/api/CommentApi";
import { Virtuoso } from "react-virtuoso";
import type { GridComponents } from "react-virtuoso";
import { Comment } from "./Comment";
import React, { useEffect} from "react";
import { selectComments, setComments  } from "@/contexts/comments/commentSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
const GridList: GridComponents["List"] = React.forwardRef(
  ({ style, children, ...props }, ref) => (
    <div
      style={{ ...style }}
      {...props}
      ref={ref}
      className=" w-full h-full "
    >
      {children}
    </div>
  )
);
const GridItem: GridComponents["Item"] = React.forwardRef(
  ({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      style={{ ...style }}
      className=" outline-2 outline-blue-400 w-full"
    >
      {children}
    </div>
  )
);
const CommentList = ({
  videoId,
  
}: {
  videoId: string;
  className?: string;
}) => {
  const { data, fetchNextPage, refetch,hasNextPage, isError, error } =
    useGetVideoComments({ videoId, limit: 10 });
const comments =  useSelector(selectComments)
const dispatch = useDispatch();
    

  useEffect(() => {
    if (data) {
      const fetchedComments = data.pages.flatMap((value)=>value.comments);
      dispatch(setComments(fetchedComments))
      console.log(fetchedComments);
    }
  }, [data,dispatch,comments]);
 
   

  return (
    <>
      {comments ? (
        <Virtuoso
          aria-rowspan={4}
          
          data={comments}
          overscan={5}
          components={{
            List: GridList,
            Item: GridItem,
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
              
              className="flex flex-col w-full my-3 min-h-50 outline-1 outline-blue-400 border-[0px] border-[rgba(0,0,0,0)] border-b-foreground border-b-2"
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
