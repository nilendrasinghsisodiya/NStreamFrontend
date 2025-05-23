import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "../ui/avatar";
import { generateSrcSet, toKBMS } from "@/utils";
import { User } from "lucide-react";
import { CSSProperties } from "react";
import { Link, useNavigate } from "react-router";
type avatarProps = {
  avatar?: string;
  username?: string;
  className?:string;
  to:string;
  noLazy?:boolean;
  failLink?:string;
  propagate?:boolean;
};
const SafeAvatar = ({ avatar, username,className,to,noLazy ,failLink,propagate}: avatarProps) => {
  const handleNoPropagation=(e:React.MouseEvent<HTMLSpanElement>)=>{
    e.stopPropagation();
  }
  
  
  return (
    <span>
      {avatar && username ? (
        
          <Avatar className="w-full h-full"  onClick={propagate ?()=>{}:handleNoPropagation}>
            <Link to={to} >
            <AvatarImage src={avatar} srcSet={generateSrcSet(avatar)} alt="user avatar" loading={noLazy?"eager":"lazy"} />

            <AvatarFallback>
              {username[0]}
            </AvatarFallback>
            </Link>
          </Avatar>
        
      ) : (<Link to={failLink?failLink:"#"}>
        <User className={`fill-accent border-[2px] outline-2 outline-red-700 border-foreground rounded-full icons-md ${className}`}  />
        </Link> )}
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
    
        <div className="flex gap-6 justify-center items-center">
          <span className="flex max-h-16 max-w-16">
            <SafeAvatar avatar={avatar} to={`channel?username=${username}`} username={username} />
          </span>
          <div className="flex flex-col">
            <span className="flex text-foreground text-xl">{username}</span>
            <span>{toKBMS(subscriberCount)}</span>
          </div>
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
      <span className="text-2xl tracking-wide m-3 xl:text-2xl font-semibold ">
        {videoTitle}
      </span>
      <div className="flex">
        <span className="flex   p-2.5 justify-center items-center  w-1/6">
         <SafeAvatar avatar={avatar} username={username} to={`channel?username=${username}`} className="icons-lg"/>
        </span>
        <div className="flex flex-col flex-3/4 text-foreground">
          <span
            className="flex flex-col justify-start items-start p-2"
            onClick={() => navigate(`/channel?username=${username}`)}
          >
            <span className="text-xl tracking-wide">{username}</span>
            <span className="text-foreground/60 text-md">{toKBMS(subsCount)}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export { ChannelAvatarBar, VideoAvatarStrip,SafeAvatar};
