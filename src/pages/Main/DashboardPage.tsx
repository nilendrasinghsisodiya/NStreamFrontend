import { useGetUserDashboard } from "@/api/UserApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { VideoList } from "@/components/video/VideoList";
import { toKBMS } from "@/utils";
import { useEffect, useState } from "react";
type card = { title: string; content: number; description: string };
export const Dashboard = () => {
  const [cards, setCards] = useState<card[]>([]);
  const {
    data: userStats,
    isError,
    isLoading,
    isSuccess,
  } = useGetUserDashboard();
  const [populrVideos, setPopularVideos] = useState<IVideo[]>([]);
  useEffect(() => {
    if (userStats) {
      queueMicrotask(() => {
        setCards([
          {
            title: "Total View",
            content: userStats.totalViews,
            description: "total views since creation",
          },
          {
            title: "Total Subscribers",
            content: userStats.totalSubscribers,
            description: "Total subscribers since creation",
          },
          {
            title: "Views Last 30 days",
            content: userStats.viewsInLast30Days,
            description: "view since last 7 days",
          },
          {
            title: "Subscribers Last 30 days",
            content: userStats.subsInLast30Days,
            description: "subs since last 30 days",
          },
          {
            title: "Views Last 7 Days",
            content: userStats.viewsInLast7Days,
            description: "view since last 7 days",
          },
          {
            title: "Subscribers Last 7 days",
            content: userStats.subsInLast7Days,
            description: "subs since last 7 days",
          },
          {
            title: "Views Last 24 hrs",
            content: userStats.viewsInLast24Hrs,
            description: "view since last 24 hrs",
          },
          {
            title: "Subscribers Last 24 hrs",
            content: userStats.subsInLast24Hrs,
            description: "subs since last 24 hrs",
          },
        ]);
        setPopularVideos(userStats.mostPopularVideos);
      });
    }
  }, [userStats]);

  return (
    <div className="w-full p-3 h-full flex flex-col items-center justify-center gap-3">
      <h1 className="font-bold tracking-tight text-2xl">Dashboard</h1>
      <div className="grid grids-cols-1 md:grid-cols-2 place-content-center gap-3 w-full h-fit">
        {/* total views, totalSubscribers, subs in last few days, liked videos, your comments, */}
        {cards &&
          cards.map((ele, index) => (
            <Card key={index} className="p-8 m-3">
              <CardTitle className="text-xl font-semibold">
                {ele.title}
              </CardTitle>{" "}
              <CardContent className="text-2xl tracking-wide font-bold w-fit">
                {toKBMS(ele.content)}
              </CardContent>
              <CardDescription className="text-sm font-light tracking-tight">
                {ele.description}
              </CardDescription>
            </Card>
          ))}
      </div>
      <div className="w-full h-fit flex flex-col justify-center items-center gap-3">
        <div className="w-full h-full flex flex-col justify-center items-center">
          <span className="text-xl font-bold tracking-tight">
            Most Popular Videos
          </span>
          <span className="text-xs text-accent-foreground/50 tracking-tight">
            Your top 5 most popular video
          </span>
        </div>
        <VideoList
          data={populrVideos}
          isError={isError}
          isLoading={isLoading}
          isSuccess={isSuccess}
          className=" w-full flex justify-center flex-wrap gap-2"
        />
      </div>
    </div>
  );
};
