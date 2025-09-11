import { useGetChannel } from "@/api/ChannelApi";
import { SafeAvatar } from "../avatar/Avatars";
import { getRelativeTime, toKBMS } from "@/utils";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { SubscribeButton } from "../SubscribeButton";

type props = {
  username: string;
  className?: string;
};
const ChannelPanel = ({ username, className }: props) => {
  const { data, isSuccess } = useGetChannel({ username });
  const [show, setShow] = useState<boolean>(false);
  const [subscribersCount,setsubscribersCount] = useState<number>(0);
  useEffect(()=>{if(data){
    setsubscribersCount(data.subscribersCount);
  }},[data])
  const handleAboutBox = () => {
    setShow((prev) => !prev);
  };
  return (
    <div
      className={` w-full h-full  ${className}`}
    >
      {isSuccess && data ? (
        <>
          <div className="flex justify-start items-center w-full gap-5 p-2">
            <span className="max-w-20 max-h-20">
              <SafeAvatar
                avatar={data.avatar}
                username={data.username}
                to={`/channel/home?username=${data.username}`}
              />
            </span>
            <span className="text-2xl tracking-wide">{data.username}</span>
            <span className="text-md text-accent-foreground/30  text-bold">
              {toKBMS(subscribersCount)}
            </span>
            <SubscribeButton isSubscribed={data.isSubscribed} targetId={data._id} username={data.username}/>
          </div>
          <div
            className="rounded-2xl border-2 border-secondary min-w-9/10 p-5 bg-accent/35 text-card"
            onClick={handleAboutBox}
          >
            {show ? (
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>{" "}
                <CardContent>
                  <p className="text-xl text-center text-foreground">{`created by: ${
                    data.fullname
                  }.\n created at: ${getRelativeTime(data.createdAt)}. \n total videos: ${
                    data.videos.length
                  }. \n Subscribers: ${toKBMS(data.subscribersCount)}.`}</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>About</CardHeader>
                <CardContent>
                  <p>{data.description || "channel description here"}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export { ChannelPanel };
