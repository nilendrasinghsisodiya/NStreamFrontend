import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "../ui/avatar";
import { generateSrcSet, toKBMS } from "@/utils";
import { User } from "lucide-react";
import { CSSProperties } from "react";
import { Link } from "react-router";
import { SubscribeButton } from "../SubscribeButton";
type avatarProps = {
  avatar?: string;
  username?: string;
  to: string;
  noLazy?: boolean;
  noNavigate?:boolean;
  failLink?: string;
  propagate?: boolean;
  
};
const SafeAvatar = ({
  avatar,
  username,
  to,
  noLazy,
  noNavigate = false,
  failLink,
  propagate=true,
  
}: avatarProps) => {
  const handleNoPropagation = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
  };

  return (
    <span>
      {!noNavigate?(avatar && username ? (
        <Link
          to={to || `/channel/home?username=${username}`}
          onClick={propagate ? () => {} : handleNoPropagation}
        >
          <Avatar className={`border-2 border-rounded border-foreground/80 w-full h-full` }>
            <AvatarImage
              src={avatar}
              srcSet={generateSrcSet(avatar)}
              loading={noLazy ? "eager" : "lazy"}
              alt={`${username}'s avatar`}
              aria-label="user avatar"
            />
            <AvatarFallback className="h-full w-full font-extrabold text-foreground/80 text-xl">
              {username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
      ) : (
        <Link
          to={failLink || "/auth"}
          onClick={propagate ? () => {} : handleNoPropagation}
        >
          <Avatar className="border-2 border-foreground/80 w-full h-full">
            <User className="text-foreground/80" />
          </Avatar>
        </Link>
      )):(avatar && username ? (
        
          <Avatar className="border-2 border-rounded border-foreground/80  " onClick={propagate ? () => {} : handleNoPropagation}>
            <AvatarImage
              src={avatar}
              srcSet={generateSrcSet(avatar)}
              loading={noLazy ? "eager" : "lazy"}
              alt={`${username}'s avatar`}
              aria-label="user avatar"
            />
            <AvatarFallback className="h-full w-full font-extrabold text-foreground/80 text-xl">
              {username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
       
      ) : (
       
          <Avatar className="border-2 border-foreground/80 w-full h-full" onClick={propagate ? () => {} : handleNoPropagation}>
            <User className="text-foreground/80" />
          </Avatar>
        
      ))}
    </span>
  );
};

type Props = {
  subscriberCount: number;
  avatar: string;
  username: string;
  channelId: string;
  isSubscribed: boolean;
  videoId?: string;
  navigateOnAvatarClick?:boolean;
};

const ChannelAvatarBar = ({
  avatar,
  username,
  subscriberCount,
  channelId,
  isSubscribed,
  videoId,
  navigateOnAvatarClick = true,
}: Props) => {
  return (
    <div className="flex gap-3  justify-between items-center  -400 px-1 max-w-full">
      <div className="flex gap-3">
        {" "}
        <span className="flex  items-center ">
          <SafeAvatar
            avatar={avatar}
            to={`/channel/home?username=${username}`}
            username={username}
            failLink="#"
            noNavigate={!navigateOnAvatarClick} // if navigationOnAvatarClick === false then this will be true
            
          />
        </span>
        <span className="flex flex-col ">
          <span className="flex text-foreground text-xs md:text-md">
            {username}
          </span>
          <span className="text-xs text-secondary-foreground">
            {toKBMS(subscriberCount)}
          </span>
        </span>
      </div>
      <SubscribeButton
        username={username}
        isSubscribed={isSubscribed}
        videoId={videoId}
        targetId={channelId}
        className="w-1/3 text-[.6rem] px-2 py-0   border-2 border-accent text-center "
      />
    </div>
  );
};

type VideoAvatarStripProps = {
  avatar: string;
  username: string;
  subscribersCount: number;
  style?: CSSProperties;
  className?: string;
  videoTitle: string;
  views:number;
  navigateOnAvatarClick?: boolean;
};
const VideoAvatarStrip = ({
  avatar,
  username,
  subscribersCount,
  views,
  style,
  className,
  videoTitle,
  navigateOnAvatarClick = true,
}: VideoAvatarStripProps) => {
  if (!avatar || !username || !videoTitle) {
    return <p>missing</p>;
  }


  return (
    <div className={className} style={style}>
      <span className="flex flex-col w-full">
        <span className=" text-[14px] wrap-break-word  tracking-tighter text-start  font-semibold line-clamp-2 w-full">{videoTitle}</span>
        <span className="text-xs text-accent-foreground/76 ml-6">{toKBMS(views)}</span>
      </span>
      <div className="flex w-full max-w-full ">
        <span className="flex    justify-center items-center  w-1/6">
          <SafeAvatar
            avatar={avatar}
            username={username}
            to={`/channel/home?username=${username}`}
            failLink="#"
            
            propagate={!navigateOnAvatarClick}
            noNavigate={!navigateOnAvatarClick}
          />
        </span>
        <div className="flex flex-col flex-3/4 text-foreground">
          {navigateOnAvatarClick ? (
            <Link
              to={`/channel/home?username=${username}`}
              className="flex flex-col justify-start items-start p-2"
            >
              <span className="text-xs tracking-tight">{username}</span>
              <span className="text-foreground/60 text-xs/tight">
                {toKBMS(subscribersCount)}
              </span>
            </Link>
          ) : (
            <div className="flex flex-col justify-start items-start p-2 cursor-default">
              <span className="text-xs tracking-tight">{username}</span>
              <span className="text-foreground/60 text-xs/tight">
                {toKBMS(subscribersCount)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { ChannelAvatarBar, VideoAvatarStrip, SafeAvatar };
