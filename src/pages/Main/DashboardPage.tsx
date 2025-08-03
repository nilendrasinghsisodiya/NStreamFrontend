import { useGetUserDashboard } from "@/api/UserApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { toKBMS } from "@/utils";
import { useEffect, useState } from "react";
type card = { title: string; content: number; description: string };
export const Dashboard = () => {
  const [cards, setCards] = useState<card[]>([]);
  const { data: userStats } = useGetUserDashboard();
  useEffect(() => {
    if (userStats) {
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
          title: "Subscribers Last 7 days",
          content: userStats.subsInLast7Days,
          description: "subs since last 7 days",
        },
        {
          title: "Subscribers Last 30 days",
          content: userStats.subsInLast30Days,
          description: "subs since last 30 days",
        },
      ]);
    }
  }, [userStats]);

  return (
    <>
        <h1>Dashboard</h1>
      <div className="grid grids-cols-1 md:grid-cols-2 place-content-center gap-3">
        {/* total views, totalSubscribers, subs in last few days, liked videos, your comments, */}
        {cards &&
          cards.map((ele, index) => (
            <Card key={index} className="p-8 m-3">
              <CardTitle className="text-xl font-semibold">{ele.title}</CardTitle>{" "}
              <CardContent className="text-2xl tracking-wide font-bold">{toKBMS(ele.content)}</CardContent>
              <CardDescription className="text-sm font-light tracking-tight">{ele.description}</CardDescription>
            </Card>
          ))}
      </div>
    </>
  );
};
