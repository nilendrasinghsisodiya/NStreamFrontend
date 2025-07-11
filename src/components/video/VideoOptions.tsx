import { getHomeUrl } from "@/utils";

import {
  AlarmClockPlus,
  EllipsisVertical,
  Share,
} from "lucide-react";
import { toast } from "sonner";
import { AddToPlaylistPopover } from "../Popovers";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type videoOptionsProps = {
  videoId: string;
};
export const VideoOptions = ({ videoId }: videoOptionsProps) => {
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const videoUrl = `${getHomeUrl()}/watch?videoId=${videoId}`;
    navigator.clipboard.writeText(videoUrl).then(() => {
      toast.success("link copied to clipboard");
    });
  };

  return (
    
      <Popover  >
        <PopoverTrigger asChild>
          <button  className="w-10 h-7 bg-transparent"onClick={(e)=>{e.stopPropagation()}}><EllipsisVertical /></button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={33}
        
          className="bg-accent p-5 text-sm tracking-tight  gap-3 rounded-2xl h-52 flex flex-col justify-center items-start min-h-[60px] min-w-[70px] z-40"
        > 
          <span className="flex gap-1">
            <AlarmClockPlus /> <p>Add to watch later</p>
          </span>

           <AddToPlaylistPopover videoId={videoId}/>
         
          <span className="flex gap-1" onClick={handleShare}>
            <Share /> <p>Share</p>
          </span>
        </PopoverContent>
      </Popover>
    
  );
};
