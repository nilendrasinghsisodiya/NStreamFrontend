import { generateSrcSet } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { VideoAvatarStrip } from "@/components/avatar/Avatars";

export const VideoEditOptionCard = ({
  thumbnail,
  title,
  owner,
  views,
  tags,
}: {
  thumbnail: string;
  title: string;
  views: number;
  owner: Pick<IUser, "_id" | "avatar" | "username" | "subscribersCount">;
  tags: string[];
}) => {
  return (
    <>
      <img
        src={thumbnail}
        srcSet={generateSrcSet(thumbnail)}
        alt={`${title}'s_thumbnail`}
        className="aspect-video w-2/5"
      />
      <div className="flex h-fit w-3/5 flex-col gap-2">
        <span className="flex gap-3">
          <VideoAvatarStrip
            views={views}
            className="flex flex-col"
            avatar={owner.avatar}
            username={owner.username}
            subscribersCount={owner.subscribersCount}
            navigateOnAvatarClick={false}
            videoTitle={title}
          />
        </span>
        <span className="flex gap-2 flex-wrap">
          {tags.map((e, index) => (
            <Badge
              key={index}
              className="p-1 h-fit w-fit text-xs tracking-tight bg-accent text-accent-foreground/75"
            >
              {e}
            </Badge>
          ))}
        </span>
      </div>
    </>
  );
};
