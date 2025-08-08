import  { useState } from "react";
import { Button } from "./ui/button";
import { useToggleSubscribed } from "@/api/UserApi";
import { toast } from "sonner";
import { queryClient } from "@/api/ApiClient";

export const SubscribeButton = ({
  isSubscribed,
  targetId,
  className,
  username,
  videoId,
}: {
  className?:string;
  isSubscribed: boolean;
  targetId: string;
  username:string;
  videoId?:string;
}) => {
  const { mutateAsync } = useToggleSubscribed();
  const [subscribed, setSubscribed] = useState<boolean>(isSubscribed);
  return (
    <Button
      variant={"default"}
      className={`aria-checked:bg-accent aria-checked:text-accent-foreground ${className}`}
      aria-checked={subscribed}
      
      onClick={() => {
        setSubscribed((prev) => !prev);
        mutateAsync({targetId}).then((val)=>{
            if(val.flag){
                toast.success("channel subscribed successfully");
            }else{
                toast.success("channel unsubscribed successFully");
            }
            queryClient.refetchQueries({queryKey:['channel',username]});
            queryClient.refetchQueries({queryKey:["video",videoId]});
        });
      }}
    >
      Subscribe
    </Button>
  );
};
