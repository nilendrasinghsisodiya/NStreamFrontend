import { useGetChannel } from "@/api/ChannelApi";
import { SafeAvatar } from "../avatar/Avatars";
import { toKBMS } from "@/utils";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type props = {
  username: string;
  className?: string;
};
const ChannelPanel = ({ username, className }: props) => {
  const { data, isSuccess } = useGetChannel({ username });
  const [show, setShow] = useState<boolean>(false);
  const handleAboutBox = () => {
    setShow((prev) => !prev);
  };
  return (
    <div
      className={`flex flex-col justify-center items-center w-full h-full border-b-2 border-accent ${className}`}
    >
      {isSuccess && data ? (
        <>
          <div className="flex justify-start items-center w-full gap-5 p-2">
            <span className="max-w-20 max-h-20">
              <SafeAvatar avatar={data.avatar} username={data.username} to={`/channel/home?username=${data.username}`}/>
            </span>
            <span className="text-2xl tracking-wide">{data.username}</span>
            <span className="text-md text-accent-foreground/30  text-bold">{toKBMS(data.subscriberCount)}</span>
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
                  }.\n created at: ${data.createdAt}. \n total videos: ${
                    data.videos.length
                  }. \n Subscribers: ${toKBMS(data.subscriberCount)}.`}</p>
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
