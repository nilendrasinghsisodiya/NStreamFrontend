import { useGetUserPlaylists } from "@/api/UserApi";
import { selectUser } from "@/contexts/auth/authSlice";
import { PlaylistCard } from "@/pages/Main/PlaylistPage";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSelector } from "react-redux";
import { ErrorScreen } from "@/components/ErrorComponent";
import { Plus } from "lucide-react";
import { useAddVideoToPlaylist, useCreatePlaylist } from "@/api/PlaylistApi";
import { toast } from "sonner";

import { useRef, useState } from "react";

import { Button } from "./ui/button";
import { AxiosError } from "axios";
import { queryClient } from "@/api/ApiClient";

type AddToPlaylistPopoverProps = {
  videoId: string;
};
export const AddToPlaylistPopover = ({
  videoId,
}: AddToPlaylistPopoverProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { username } = useSelector(selectUser);
  const {
    playlists,
    isSuccess: upIsSuccess,
    isError: upIsError,
    isLoading: upIsLoading,
  } = useGetUserPlaylists({
    username,
    isOpen,
  });
  const addPlaylists = useAddVideoToPlaylist();
  const handleAdd = async ({ targetId }: { targetId: string }) => {
    try {
      await addPlaylists.add({ playlistId: targetId, videoIds: [videoId] });
      toast.success("video added to playlists successfully");
      queryClient.invalidateQueries({ queryKey: ["playlist", targetId] });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error("failed to add video to playlist");
      }
    }
  };

  return (
    <Popover
      onOpenChange={() => {
        setIsOpen((prev) => !prev);
      }}
    >
      <PopoverTrigger asChild>
        <button className="bg-transparent" onClick={(e) => e.stopPropagation()}>
          add to playlist
        </button>
      </PopoverTrigger>
      <PopoverContent className="h-70 w-70 flex flex-col gap-4 items-center">
        <div className="flex-3/4 overflow-y-scroll w-full h-full">
          {Array.isArray(playlists?.playlists)
            ? playlists.playlists.map((ele, index) => {
                console.log("playlists: ", playlists);
                return (
                  <PlaylistCard
                    noHover
                    lazyLoading
                    cover={ele.cover}
                    key={index}
                    name={ele.name}
                    isLoading={upIsLoading}
                    isSuccess={upIsSuccess}
                    playlistId={ele._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleAdd({ targetId: ele._id });
                    }}
                  />
                );
              })
            : (!upIsSuccess && (
                <div>
                  <span>no playlists found</span>
                </div>
              )) ||
              (upIsError && <ErrorScreen mainMessage="something went wrong" />)}
        </div>
        <div className=" flex justify-center items-center">
          <CreatePlaylist videoId={videoId} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const CreatePlaylist = ({ videoId }: { videoId?: string }) => {
  const { create } = useCreatePlaylist();
  const { _id: userId } = useSelector(selectUser);
  const addPlaylists = useAddVideoToPlaylist();
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const handleCreate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const name = nameRef.current?.value;
    const description = descriptionRef.current?.value;
    if (name && name?.length > 0) {
      const val = await create({ name: name, description: description || "" });

      toast.success("playlistCreatedSuccessfully");
      if (videoId) {
        await addPlaylists.add({ playlistId: val._id, videoIds: [videoId] });
      }
      toast.success(`videoAdded to ${val.name} successfully!`);
      queryClient.invalidateQueries({ queryKey: ["userPlaylists", userId] });
    }
  };
  return (
    <Popover>
      <PopoverTrigger className="text-foreground h-fit w-fit">
        <Button asChild variant={"ghost"} className="w-full h-full">
          <Plus className="text-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col h-fit w-fit aspect-square m-auto"
      >
        <label htmlFor="playlistsTitle">Title</label>
        <input
          type="text"
          tabIndex={0}
          name="name"
          id="playlistTitle"
          placeholder="playlist title here..."
          ref={nameRef}
        />
        <label htmlFor="description">Description</label>
        <textarea
          tabIndex={0}
          name="description"
          id="discription"
          placeholder="playlist description...."
          ref={descriptionRef}
        />
        <Button onClick={handleCreate}>Confirm</Button>
      </PopoverContent>
    </Popover>
  );
};
