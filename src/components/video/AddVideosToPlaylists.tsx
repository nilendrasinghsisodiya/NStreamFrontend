import { useGetUserWatchHistory } from "@/api/UserApi";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { generateSrcSet } from "@/utils";
import { VideoAvatarStrip } from "../avatar/Avatars";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { queryClient } from "@/api/ApiClient";
import { useAddVideoToPlaylist } from "@/api/PlaylistApi";
import { AxiosError } from "axios";
import { toast } from "sonner";

type videoOptionProps = {
  ele: IWatchHistory;
  setVideosToAdd: React.Dispatch<React.SetStateAction<string[]>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};
export const AddVideoOption = ({
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
      onClick={(e) => {
        e.stopPropagation();
        setVideosToAdd((prev) => {
          let value = "";
          if (inputRef && inputRef.current) {
            value = inputRef.current.value;
            inputRef.current.checked = !inputRef.current.checked;
          }
          return [...prev, value];
        });
      }}
    >
      <img
        src={ele.thumbnail}
        srcSet={generateSrcSet(ele.thumbnail)}
        className="aspect-video h-full w-full min-h-[50px] min-w-[100px] max-h-[80px] max-w-[160px]"
      />
      <VideoAvatarStrip
        views={ele.views}
        avatar={ele.owner.avatar}
        username={ele.owner.username}
        subscribersCount={ele.owner.subscribersCount}
        videoTitle={ele.title}
        className="w-full"
        navigateOnAvatarClick={false}
      />
      <span>
        <label htmlFor={`videoSelectOption_${ele._id}`} className="sr-only">
          select for {ele.title}
        </label>
        <input
          name="videoSelectOption"
          id={`videoSelectOption_${ele._id}`}
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
  isError: boolean;
  isSuccess: boolean;
  videos: IVideo[] | IWatchHistory[];
};
export const AddVideoOptionList = ({
  className,
  videos,
  isError,
  isSuccess,
  setVideosToAdd,
}: videoOptionListProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const value = e.currentTarget.value;
    setVideosToAdd((prev) => [value, ...prev]);
  };

  return (
    <div className={className}>
      {isSuccess && Array.isArray(videos) ? (
        videos.length > 0 ? (
          videos.map((ele) => (
            <AddVideoOption
              ele={ele}
              setVideosToAdd={setVideosToAdd}
              key={ele._id}
              onChange={handleChange}
              className="flex w-full gap-x-3"
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
  const { data: videos, isError, isSuccess } = useGetUserWatchHistory(isActive);
  const addPlaylists = useAddVideoToPlaylist();
  const handleAdd = async () => {
    try {
      await addPlaylists.add({ playlistId: playlistId, videoIds: videosToAdd });
      toast.success("video added to playlists successfully");
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error("failed to add video to playlist");
      }
    }
  };
  return (
    <Popover onOpenChange={() => setIsActive(true)}>
      <PopoverTrigger>
        <Plus className="h-full w-full" />
      </PopoverTrigger>
      <PopoverContent className={className}>
        <span>Add Video to Playlist</span>
        <AddVideoOptionList
          isError={isError}
          isSuccess={isSuccess}
          videos={videos}
          isActive={isActive}
          setVideosToAdd={setVideosToAdd}
          className="overflow-y-scroll max-h-70 max-w-[320px] md:max-w-120 flex flex-col gap-2"
        />
        <Button onClick={handleAdd}>Confirm</Button>
      </PopoverContent>
    </Popover>
  );
};
