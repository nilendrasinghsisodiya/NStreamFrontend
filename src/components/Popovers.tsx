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
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useAddVideoToPlaylist } from "@/api/PlaylistApi";
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
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

// };
type AddToPlaylistPopoverProps = {
  videoId: string;
};
export const AddToPlaylistPopover = ({
  videoId,
}: AddToPlaylistPopoverProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { username } = useSelector(selectUser);
  const { playlists, isError, isSuccess, isLoading } = useGetUserPlaylists({
    username,
    isOpen,
  });
  const { add } = useAddVideoToPlaylist();
  const handleAdd = ({ targetId }: { targetId: string }) => {
    add({ playlistId: targetId, videoIds: [`${videoId}`] })
      .then(() => {
        if (isSuccess) {
          toast.success("video added to playlists successfully");
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const handleCreate = () => {};
  return (
    <Popover onOpenChange={() => setIsOpen((prev) => !prev)}>
      <PopoverTrigger asChild>
        <button className="bg-transparent" onClick={(e) => e.stopPropagation()}>
          add to playlist
        </button>
      </PopoverTrigger>
      <PopoverContent className="h-100 w-100 flex flex-col gap-4 items-center" >
        <div className="flex-3/4 overflow-y-scroll">
        {!isError ? (
          playlists?.length && isSuccess ? (
            playlists.map((ele, index) => (
              <PlaylistCard
                cover={ele.cover}
                name={ele.name}
                playlistId={ele._id}
                view={ele.view}
                isLoading={isLoading}
                isSuccess={isSuccess}
                key={index + ele._id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAdd({ targetId: ele._id });
                }}
              />
            ))
          ) : (
            <span className="text-center p-5">no playlists found</span>
          )
        ) : (
          <ErrorScreen
            mainMessage="something went wrong"
            secondaryMessage="please try again"
          />
        )} </div>
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
          <DialogContent onClick={(e)=>e.stopPropagation()} className="min-w-60 min-h-100">
            <DialogHeader>
              <DialogTitle>Create new playlist</DialogTitle>
              <DialogDescription>Creates a new Playlist</DialogDescription>
            </DialogHeader>
            <div >
              <Input
                type="text"
                tabIndex={0}
                name="title"
                id="playlistsTitle"
                placeholder="playlist title here..."
                ref={titleRef}
              />
              <Textarea
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
