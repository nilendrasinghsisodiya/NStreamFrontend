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
  to: string;
  noLazy?: boolean;
  failLink?: string;
  propagate?: boolean;
};
const SafeAvatar = ({
  avatar,
  username,
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
        <Link
          to={to || `/channel/home?username=${username}`}
          onClick={propagate ? () => {} : handleNoPropagation}
        >
          <Avatar className="border-2 border-rounded border-foreground/80  ">
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
  videoId?: string;
};

const ChannelAvatarBar = ({
  avatar,
  username,
  subscriberCount,
  channelId,
  isSubscribed,
  videoId,
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
        className="max-w-1/3 text-[.6rem] px-2 py-0 max-h-7  border-2 border-accent text-center "
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
  }

  console.log("videoCardStrip", avatar, username, subsCount);

  return (
    <div className={className} style={style}>
      <span className="text-wrap text-xs sm:text-sm lg:text-md tracking-tight text-start  font-semibold line-clamp-2">
        {videoTitle}
      </span>
      <div className="flex w-full max-w-full ">
        <span className="flex    justify-center items-center  w-1/6">
          <SafeAvatar
            avatar={avatar}
            username={username}
            to={`/channel/home?username=${username}`}
            failLink="#"
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
