import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "../ui/avatar";
import { generateSrcSet, toKBMS } from "@/utils";
import { User } from "lucide-react";
import { CSSProperties } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../ui/button";
type avatarProps = {
  avatar?: string;
  username?: string;
  className?: string;
  to: string;
  noLazy?: boolean;
  failLink?: string;
  propagate?: boolean;
};
const SafeAvatar = ({
  avatar,
  username,
  className,
  to,
  noLazy,
  failLink,
  propagate,
}: avatarProps) => {
  const handleNoPropagation = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
  };

  return (
    <span>
      {avatar && username ? (
        <Avatar tabIndex={0}
          className="min-h-[15px]  min-w-[15px] max-h-[40px] max-w-[40px] md:max-h-[55px] md:max-w-[55px]"
          onClick={propagate ? () => {} : handleNoPropagation}
        >
          <Link to={to}>
            <AvatarImage
            className="z-50"
              src={avatar}
              srcSet={generateSrcSet(avatar)}
              alt="user avatar"
              loading={noLazy ? "eager" : "lazy"}
            />

            <AvatarFallback>{username[0]}</AvatarFallback>
          </Link>
        </Avatar>
      ) : (
        <Link to={failLink ? failLink : "#"}>
          <User
            className={`fill-accent border-[2px] z-50 outline-2 outline-red-700 border-foreground rounded-full icons-md ${className}`}
          />
        </Link>
      )}
    </span>
  );
};

type Props = {
  subscriberCount: number;
  avatar: string;
  username: string;
};

const ChannelAvatarBar = ({ avatar, username, subscriberCount }: Props) => {
  return (
    <div className="flex gap-3  justify-between items-center outline-2 outline-red-400 px-3 max-w-full">
     <div className="flex gap-3"> <span className="flex  items-center ">
        <SafeAvatar
          avatar={avatar}
          to={`/channel/home?username=${username}`}
          username={username}
          className="outline-2 outline-emerald-300"
        />
      </span>
      <span className="flex flex-col text-md">
        <span className="flex text-foreground ">{username}</span>
        <span >{toKBMS(subscriberCount)}</span>
      </span>
      </div>
      <Button variant={"outline"}  className="bg-[rgba(55,77,158,0.49)] font-bold tracking-wide border-2 border-foreground/60 p-2.5 h-8">Subscribe</Button>
    </div>
  );
};

type VideoAvatarStripProps = {
  avatar: string;
  username: string;
  subsCount: number;
  style?: CSSProperties;
  className?: string;
  videoTitle: string;
  videoId:string;
};
const VideoAvatarStrip = ({
  avatar,
  username,
  subsCount,
  style,
  className,
  videoTitle,
}: VideoAvatarStripProps) => {
  const navigate = useNavigate();

  if (!avatar || !username || !videoTitle) return null; // Don't render if data is missing

  console.log("videoCardStrip", avatar, username, subsCount);

  return (
    <div className={className} style={style}>
      <span className="text-sm tracking-tight m-3 xl:text-xl font-semibold ">
        {videoTitle}
      </span>
      <div className="flex">
        <span className="flex   p-2.5 justify-center items-center  w-1/6">
          <SafeAvatar
            avatar={avatar}
            username={username}
            to={`/channel/home?username=${username}`}
            className="icons-sm "
          />
        </span>
        <div className="flex flex-col flex-3/4 text-foreground">
          <span
            className="flex flex-col justify-start items-start p-2"
            onClick={() => navigate(`/channel/home?username=${username}`)}
          >
            <span className="text-sm tracking-tight">{username}</span>
            <span className="text-foreground/60 text-sm">
              {toKBMS(subsCount)}
            </span>
          </span>
        </div>
       
      </div>
    </div>
  );
};

export { ChannelAvatarBar, VideoAvatarStrip, SafeAvatar };
