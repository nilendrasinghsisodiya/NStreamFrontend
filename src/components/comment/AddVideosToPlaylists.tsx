import { useGetUserWatchHistory } from "@/api/UserApi";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { generateSrcSet } from "@/utils";
import { VideoAvatarStrip } from "../avatar/Avatars";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

type videoOptionProps = {
  ele: IWatchHistory;
  setVideosToAdd: React.Dispatch<React.SetStateAction<string[]>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};
const VideoOption = ({
  ele,
  className,
  onChange,
  setVideosToAdd,
}: videoOptionProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  // need to add a small thumbnail, a title, an owenr avtar, views, owner username, and an option to select ( checkbox)
  return (
    <span
      className={className}
      onClick={() =>
        setVideosToAdd((prev) => {
          let value = "";
          if (inputRef && inputRef.current ) {
            value = inputRef.current.value;
          }
          return [...prev, value];
        })
      }
    >
      <img
        src={ele.thumbnail}
        srcSet={generateSrcSet(ele.thumbnail)}
        className="aspect-video h-full w-full min-h-[50px] min-w-[100px] max-h-[80px] max-w-[160px]"
      />
      <VideoAvatarStrip
        avatar={ele.owner.avatar}
        username={ele.owner.username}
        videoId={ele._id}
        subsCount={0}
        videoTitle={ele.title}
        className="w-full"
      />
      <span>
        <input
          ref={inputRef}
          type="checkbox"
          className=""
          value={ele._id}
          onChange={onChange}
        />
      </span>
    </span>
  );
};

type videoOptionListProps = {
  isActive: boolean;
  className?: string;
  setVideosToAdd: React.Dispatch<React.SetStateAction<string[]>>;
};
const VideoOptionList = ({
  isActive,
  className,
  setVideosToAdd,
}: videoOptionListProps) => {
  const [videos, setVideos] = useState<IWatchHistory[]>([]);
  const { data, isError, isSuccess } = useGetUserWatchHistory(isActive);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const value = e.currentTarget.value;
    setVideosToAdd((prev) => [value, ...prev]);
  };
 
  useEffect(() => {
    if (data) {
      setVideos(data);
    }
    console.log("add to playlist video data", data);
  }, [videos, setVideos, data]);
  return (
    <div className={className}>
      {isSuccess && Array.isArray(videos) ? (
        videos.length > 0 ? (
          videos.map((ele) => (
            <VideoOption
              ele={ele}
              setVideosToAdd={setVideosToAdd}
              key={ele._id}
              onChange={handleChange}
              className="flex w-full "
            />
          ))
        ) : (
          <span onClick={() => console.log(videos)}>
            no history found for this user
          </span>
        )
      ) : (
        isError && <span> something went wrong</span>
      )}
    </div>
  );
};

export const AddVideosToPlaylist = ({
  className,
  playlistId,
}: {
  className: string;
  playlistId: string;
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [videosToAdd, setVideosToAdd] = useState<string[]>([]);
  const handleAdd = () => {
    console.log("videosToAddToPlaylist", videosToAdd);
    console.log("target playlist id", playlistId);
  };
  return (
    <Dialog onOpenChange={() => setIsActive(true)}>
      <DialogTrigger>
        <Plus className="h-full w-full" />
      </DialogTrigger>
      <DialogContent className={className}>
        <DialogTitle>Add Video to Playlist</DialogTitle>
        <DialogDescription>
          {" "}
          videos that can be added to playlist
        </DialogDescription>
        <VideoOptionList
          isActive={isActive}
          setVideosToAdd={setVideosToAdd}
          className="overflow-y-scroll max-h-70 max-w-[300px] md:max-w-120 flex flex-col gap-2"
        />
        <DialogFooter>
          <DialogClose>Close</DialogClose>
          <Button onClick={handleAdd}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
