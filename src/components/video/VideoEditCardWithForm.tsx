import { queryClient } from "@/api/ApiClient";
import { EditContext } from "@/api/ChannelApi";
import { useDeleteVideo, useEditVideo } from "@/api/VideoApi";
import { videoEditSchemaType, VideoEditForm } from "@/forms/VideoEditForm";
import { Pencil, Trash2, Undo } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmationToast } from "../ConfirmationToast";
import { Button } from "../ui/button";
import { InitialEditContext } from "@/constants";
import { VideoEditOptionCard } from "./VideoEditOptionCard";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export type videoEditCardWithFormOptionProps = {
  className?: string;
  thumbnail: string;
  title: string;
  views: number;
  _id: string;
  tags: string[];
  EditContext: EditContext;
  SetEditContext: React.Dispatch<React.SetStateAction<EditContext>>;
  owner: Pick<IUser, "_id" | "avatar" | "username" | "subscribersCount">;
};

export const VideoEditCardWithForm = ({
  thumbnail,
  className,
  title,
  owner,
  views,
  _id: videoId,
  tags,
  SetEditContext,
  EditContext,
}: videoEditCardWithFormOptionProps) => {
  const { mutateAsync: deleteVideo } = useDeleteVideo();
  const { mutateAsync: updateVideo } = useEditVideo();

  const onClickDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.warn("delete button clicked");
    const videoId = e.currentTarget.value;
    toast.custom(
      (t) => (
        <ConfirmationToast
          t={t}
          heading="Action Needed"
          message={"Do you want to delete this video?"}
          handleConfirmation={async () => {
            console.warn("video delete triggered");
            console.log("videoId", videoId);
            await deleteVideo({ videoId: videoId });
            queryClient.refetchQueries({ queryKey: ["channelVideos"] });
            toast.success("Video deleted sucessfully!", {
              toasterId: "global",
            });
          }}
        />
      ),
      { duration: Infinity, toasterId: "conformation" },
    );
  };
  const onClickEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    const videoId = e.currentTarget.value;
    console.warn("edit button clicked", videoId);
    console.log("videoId", videoId);
    SetEditContext({
      id: videoId,
      reseted: false,
      video: {
        thumbnail: thumbnail,
        title: title,
        owner: owner,
        tags: tags,
        views: views,
      },
    });
  };
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const handleSubmit = async (formData: videoEditSchemaType) => {
    if (formData) {
      if (thumbnailFile instanceof File) {
        await updateVideo({
          ...formData,
          thumbnail: thumbnailFile,
          videoId: videoId,
        });
      } else {
        await updateVideo({
          title: formData.title,
          tags: formData.tags,
          videoId,
        });
      }
      SetEditContext(InitialEditContext);
      console.log("video update triggered");
      toast.success("Video Updated Sucessfully!", { toasterId: "global" });
    }
  };
  const isMobile = useIsMobile();
  return (
    <div className={className} key={videoId}>
      {EditContext.id === videoId ? (
        <VideoEditForm
          setThumbnailFile={setThumbnailFile}
          tags={tags}
          title={title}
          thumbnail={thumbnail}
          handleSumbit={handleSubmit}
          key={videoId}
        />
      ) : (
        <VideoEditOptionCard
          thumbnail={thumbnail}
          owner={owner}
          title={title}
          tags={tags}
          views={views}
        />
      )}
      <span
        className={cn(
          "flex   justify-center items-start gap-2 flex-col ",
          EditContext.id && "flex-col  w-fit h-fit",
        )}
      >
        {!EditContext.id && (
          <>
            <Button variant={"ghost"} value={videoId} onClick={onClickEdit}>
              <Pencil />
            </Button>
            <Button variant={"ghost"} value={videoId} onClick={onClickDelete}>
              <Trash2 />
            </Button>
          </>
        )}
        {EditContext.id === videoId && (
          <Button
            variant={"ghost"}
            value={videoId}
            onClick={() => SetEditContext(InitialEditContext)}
          >
            <Undo />
          </Button>
        )}
      </span>
    </div>
  );
};
