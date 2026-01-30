import { usePopularVideo } from "@/api/VideoApi";
import React, { useMemo} from "react";
import { VirtuosoGrid, GridComponents } from "react-virtuoso";

import { VideoCard } from "./VideoCard";
import { VideoCardSkeletonScrollSeek } from "./VideoCardSkeleton";
import { useUserRecommendation } from "@/api/UserApi";

const GridList: GridComponents["List"] = React.forwardRef(
	({ style, children, ...props }, ref) => (
		<div
			style={{ height: "100%", ...style }}
			{...props}
			ref={ref}
			className=" grid gird-cols-1 md:grid-cols-2  lg:grid-cols-3 2xl:grid-cols-4  place-items-center  gap-x-2 gap-y-2"
		>
			{children}
		</div>
	),
);
const GridItem: GridComponents["Item"] = React.forwardRef(
	({ style, children, ...props }, ref) => (
		<div
			ref={ref}
			{...props}
			style={{ ...style }}
			className=" aspect-video w-[320px] h-[310px] sm:w-[380px] sm:h-[360px]  "
		>
			{children}
		</div>
	),
);

const PopularVideos = () => {
	const { data, hasNextPage, fetchNextPage, isSuccess, isLoading } =
		usePopularVideo({
			limit: 10,
		});
	const { data: RecommendedVideos } = useUserRecommendation();

	const merged = useMemo(() => {
		if (!data?.pages) return [];

		const popular = data.pages.flatMap((p) => p.Videos);
		const recommended = Array.isArray(RecommendedVideos)
			? RecommendedVideos
			: [];

		return [...recommended, ...popular];
	}, [data, RecommendedVideos]);

	return (
		<>
			<VirtuosoGrid
				data={merged}
				useWindowScroll
				components={{
					List: GridList,
					Item: GridItem,
					ScrollSeekPlaceholder: VideoCardSkeletonScrollSeek,
				}}
				itemContent={(_, data) => (
					<VideoCard
						duration={data.duration}
						isLoading={isLoading}
						owner={data?.owner}
						thumbnail={data.thumbnail}
						videoId={data._id}
						title={data.title}
						viewsCount={data.views}
						isSuccess={isSuccess}
						lazyLoading={true}
					/>
				)}
				endReached={() => {
					if (hasNextPage) {
						fetchNextPage();
					}
				}}
				computeItemKey={(index, val) => `${val._id}_${index}`}
				increaseViewportBy={900}
				scrollSeekConfiguration={{
					enter: (velocity) => Math.abs(velocity) > 350,
					exit: (velocity) => Math.abs(velocity) < 10,
				}}
				overscan={25}
			/>
		</>
	);
};

export { PopularVideos };
