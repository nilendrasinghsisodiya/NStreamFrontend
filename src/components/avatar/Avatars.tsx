import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "../ui/avatar";
import { generateSrcSet, toKBMS } from "@/utils";
import { User } from "lucide-react";
import { CSSProperties } from "react";
import { Link, useNavigate } from "react-router";
import { SubscribeButton } from "../SubscribeButton";
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
        <Avatar
          tabIndex={0}
          className="min-h-[15px]  min-w-[15px] max-h-[30px] max-w-[30px] md:max-h-[40px] md:max-w-[40px] aspect-square"
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
            className={`fill-accent border-[2px] z-50  -700 border-foreground rounded-full icons-md ${className}`}
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
  channelId: string;
  isSubscribed: boolean;
};

const ChannelAvatarBar = ({
  avatar,
  username,
  subscriberCount,
  channelId,
  isSubscribed,
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
          />
        </span>
        <span className="flex flex-col ">
          <span className="flex text-foreground text-xs md:text-md">{username}</span>
          <span className="text-xs text-secondary-foreground">{toKBMS(subscriberCount)}</span>
        </span>
      </div>
      <SubscribeButton
        username={username}
        isSubscribed={isSubscribed}
        targetId={channelId}
        className="max-w-1/3 text-sm px-1 py-0.5 text-center "
      />
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
  videoId: string;
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

  if (!avatar || !username || !videoTitle) {
    return <p>missing</p>;
  } // Don't render if data is missing

  console.log("videoCardStrip", avatar, username, subsCount);

  return (
    <div className={className} style={style}>
      <span className="text-md tracking-tight text-start xl:text-md font-semibold line-clamp-2">
        {videoTitle}
      </span>
      <div className="flex w-full max-w-full ">
        <span className="flex    justify-center items-center  w-1/6">
          <SafeAvatar
            avatar={avatar}
            username={username}
            to={`/channel/home?username=${username}`}
            className="icons-sm max-h-12 max-w-12 min-w-5 min-h-5 "
            noLazy
          />
        </span>
        <div className="flex flex-col flex-3/4 text-foreground">
          <span
            className="flex flex-col justify-start items-start p-2"
            onClick={() => navigate(`/channel/home?username=${username}`)}
          >
            <span className="text-xs tracking-tight">{username}</span>
            <span className="text-foreground/60 text-xs/tight">
              {toKBMS(subsCount)}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export { ChannelAvatarBar, VideoAvatarStrip, SafeAvatar };
