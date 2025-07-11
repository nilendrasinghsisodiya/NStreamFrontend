// type createPlaylistProps = {

import { useGetUserPlaylists } from "@/api/UserApi";
import { selectUser } from "@/contexts/auth/authSlice";
import { PlaylistCard } from "@/pages/Main/PlaylistPage";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSelector } from "react-redux";
import { ErrorScreen } from "./ErrorComponent";
import { Plus } from "lucide-react";
import { useAddVideoToPlaylist, useCreatePlaylist } from "@/api/PlaylistApi";
import { toast } from "sonner";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DialogHeader } from "./ui/dialog";

// };
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
  const { create } = useCreatePlaylist();
  const addPlaylists = useAddVideoToPlaylist();
  const handleAdd = async ({ targetId }: { targetId: string }) => {
    await addPlaylists.add({ playlistId: targetId, videoIds: [videoId] });

    if (addPlaylists.isSuccess) {
      toast.success("video added to playlists successfully");
    }
  };
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
      await addPlaylists.add({ playlistId: val._id, videoIds: [videoId] });

      toast.success(`videoAdded to ${val.name} successfully!`);

      //
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
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="bg-transparent w-full hover:bg-accent/40 p-1.5 "
                onClick={(e) => e.stopPropagation()}
              >
                <span className="flex  gap-3 items-center justify-center">
                  <p>crete new</p> <Plus />
                </span>
              </button>
            </DialogTrigger>
            <DialogContent
              onClick={(e) => e.stopPropagation()}
              className="min-w-60 min-h-100"
            >
              <DialogHeader>
                <DialogTitle>Create new playlist</DialogTitle>
                <DialogDescription>Creates a new Playlist</DialogDescription>
              </DialogHeader>
              <div>
                <input
                  type="text"
                  tabIndex={0}
                  name="name"
                  id="playlistsTitle"
                  placeholder="playlist title here..."
                  ref={nameRef}
                />
                <textarea
                  tabIndex={0}
                  name="description"
                  id="discriptions"
                  placeholder="playlist description...."
                  ref={descriptionRef}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <button
                    className="bg-transparent"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Close
                  </button>
                </DialogClose>
                <button className="bg-transparent" onClick={handleCreate}>
                  Confirm
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </PopoverContent>
    </Popover>
  );
};
