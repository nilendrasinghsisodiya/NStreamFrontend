import { useUserRecommendation } from "@/api/UserApi";

import { MemoVideoList } from "./VideoList";

const RecommendedVideos = () => {
  const { isSuccess, isLoading, data } = useUserRecommendation();

  return (
    <MemoVideoList
      data={data ? data : []}
      isLoading={isLoading}
      isSuccess={isSuccess}
      className="grid grid-cols-1 xl:grid-cols-3 grid-rows-1  md:grid-cols-2 justify-items-center gap-3 w-screen p-1"
    />
  );
};

export { RecommendedVideos };
