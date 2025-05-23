import { PopularVideos } from "@/components/PopularVidoes";
import { RecommendedVideos } from "@/components/RecommendedVideos";

const HomePage = () => {


  return (
    <div className="flex flex-col w-full h-full max-w-full">
      {/* these are based on user watch history*/}
      <span>related tags here</span>
     <span> <RecommendedVideos/></span>
      
      {/* these are based on most popular video on change on given time*/}
      <PopularVideos  />
      {/*these are the most viewed video in a specific timeframe */}
      <div className="trendingVideos"></div>
    </div>
  );
};

export { HomePage };
