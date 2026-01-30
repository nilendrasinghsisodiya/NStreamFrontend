import { useGetPlaylist } from "@/api/PlaylistApi";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AddVideosToPlaylist } from "@/components/video/AddVideosToPlaylists";
import { selectUser } from "@/contexts/auth/authSlice";
import { useSelector } from "react-redux";
import { ErrorScreen } from "@/components/ErrorComponent";
import { VirtualVideoList } from "@/components/video/VideoListVirtual";

const PlaylistHeader = ({
	title,
	isOwner,
	playlistId,
	className,
	description,
}: {
	title: string;
	isOwner: boolean;
	description?: string;
	playlistId: string;
	className?: string;
}) => {
	return (
		<div className={className}>
			<div className="w-5/6 flex flex-col h-fit p-1 justify-center">
				<span className="text-md font-semibold tracking-tight">{title}</span>
				<span className="line-clamp-3 w-full h-fit text-sm font-light tracking-tight">
					{description}
				</span>
			</div>
			{isOwner && (
				<AddVideosToPlaylist
					playlistId={playlistId}
					className="max-w-130 p-4 rounded-xl gap-4 max-h-120 z-50 bg-background overflow-y-scroll"
				/>
			)}
		</div>
	);
};
export const PlaylistPage = () => {
	const [playlistName, setPlaylistsName] = useState<string>("");
	const [playlistDescription, setPlaylistDescription] = useState<string>("");
	const [searchParams] = useSearchParams();
	const [isOwner, setIsOwner] = useState<boolean>(false);
	const { _id: userId } = useSelector(selectUser);
	const playlistId = searchParams.get("playlistId") as string;

	const { data, hasNextPage, fetchNextPage, isLoading, isSuccess } =
		useGetPlaylist({
			playlistId,
			limit: 5,
		});

	const fetchedVids = useMemo<IVideo[]>(() => {
		if (data && data.pages) {
			console.log("data.pages", data.pages);

			return data.pages.flatMap((page) => {
				return page.playlist.videos ? page.playlist.videos : [];
			});
		} else {
			return [];
		}
	}, [data]);
	useEffect(() => {
		console.log("new videos", fetchedVids);
		queueMicrotask(() => {
			if (data && data.pages) {
				const playlist = data.pages[0].playlist;
				setPlaylistsName(playlist.name);
				setPlaylistDescription(playlist.description);
				setIsOwner(playlist.owner === userId);
			}
		});

	}, [data, userId, fetchedVids]);

	return (
		<>
			{fetchedVids.length > 0 ? (
				<>
					<VirtualVideoList
						fetchNextPage={fetchNextPage}
						itemClassName="flex flex-col sm:flex-row items-center  border-x-0 min-h-[250px] sm:h-fit p-2 justify-evenly"
						hasNextPage={hasNextPage}
						isLoading={isLoading}
						isSuccess={isSuccess}
						videos={fetchedVids}
						header={() => (
							<PlaylistHeader
								isOwner={isOwner}
								playlistId={playlistId}
								title={playlistName}
								className="w-full h-fit flex "
								description={playlistDescription}
							/>
						)}
					/>
				</>
			) : (
				<div className="w-full h-full justify-center items-center">
					<PlaylistHeader
						isOwner={isOwner}
						playlistId={playlistId}
						title={playlistName}
						description={playlistDescription}
						className="w-full hit-fit flex justify-evenly items-center"
					/>
					<ErrorScreen mainMessage="playlist is empty" />
				</div>
			)}
		</>
	);
};
