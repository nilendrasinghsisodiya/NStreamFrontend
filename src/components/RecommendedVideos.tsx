import { useUserRecommendation } from "@/api/UserApi";



import { MemoVideoList } from "./video/VideoList";

const RecommendedVideos = () => {
  
    const {isSuccess,isLoading,data} = useUserRecommendation();
   

  return (
  <MemoVideoList  data={data? data: []} isLoading={isLoading} isSuccess={isSuccess} className="flex flex-col md:flex-row gap-4 items-center justify-around"/>
  )
}

export { RecommendedVideos};