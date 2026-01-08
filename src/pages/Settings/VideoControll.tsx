import React, { useEffect, useMemo, useRef, useState } from "react";
import { VideoAvatarStrip } from "@/components/avatar/Avatars";
import { Button } from "@/components/ui/button";
import { allowedImageType, generateSrcSet } from "@/utils";
import { Pencil, Save, Trash2, Undo } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUser } from "@/contexts/auth/authSlice";
import {
  channelVideoType,
  EditContext,
  useChannelVideos,
} from "@/api/ChannelApi";

import { VideoOptionList } from "@/components/VideoOptionList";
import { Badge } from "@/components/ui/badge";
import z from "zod";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { TagInput } from "@/components/ui/TagInputComponent";
import { toast } from "sonner";
import { ConfirmationToast } from "@/components/ConfirmationToast";
import { useDeleteVideo, useEditVideo } from "@/api/VideoApi";
import { queryClient } from "@/api/ApiClient";

// flex flex-col w-full md:flex-row flex-wrap  justify-center contain-content gap-4

type videoControllOptionProps = {
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

const VideoControllOptionCard = ({
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
              className="p-1 text-xs tracking-tight bg-accent text-accent-foreground"
            >
              {e}
            </Badge>
          ))}
        </span>
      </div>
    </>
  );
};
const ImageUploadPreview = ({
  thumbnail,
  setThumbnail,
  controllProps,
}: {
  thumbnail: string; // This will be a string (URL) for preview.
  setThumbnail: React.Dispatch<React.SetStateAction<File | null>>; // This will be the File when uploaded.
  controllProps: ControllerRenderProps<
    { thumbnail: File | string; tags: string[]; title: string },
    "thumbnail"
  >;
}) => {
  const [preview, setPreview] = useState<string>(thumbnail);
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div
      className="aspect-video w-full border-2 border-dashed border-gray-400 rounded-xl overflow-hidden cursor-pointer relative group"
      onClick={() => inputRef.current?.click()}
    >
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="object-cover w-full h-full transition group-hover:opacity-80"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full text-gray-500 group-hover:text-gray-700">
          Click to upload
        </div>
      )}

      {/* Hover overlay */}
      {preview && (
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-medium transition">
          Change Thumbnail
        </div>
      )}

      {/* Hidden input */}
      <input
        ref={inputRef}
        name={controllProps.name}
        id="thumbnail"
        max={1}
        min={1}
        onBlur={controllProps.onBlur}
        disabled={controllProps.disabled}
        type="file"
        accept=".jpeg, .jpg, .png, .webp"
        className="hidden"
        onChange={() => {
          const files = inputRef.current?.files;
          if (files && files[0]) {
            const uploadedFileUrl = URL.createObjectURL(files[0]);
            setPreview(uploadedFileUrl); // Update preview URL for user feedback
            setThumbnail(files[0] as File); // Store the actual File for form submission
          }
        }}
      />
    </div>
  );
};

const edtiFormSchema = z.object({
  title: z.string().trim().nonempty("title can be empty"),
  tags: z.array(z.string()).max(20, "maximum 20 tags allowed").optional(),
  thumbnail: z
    .union([z.string(), z.instanceof(File)])
    .refine((value: File | string) => {
      if (typeof value === "string") return true; // Allow the URL string for preview.
      if (value instanceof File) {
        return allowedImageType.includes(value.type);
      }
      return false;
    }, "Only jpeg, png, and webp's are allowed")
    .refine((value: File | string) => {
      if (typeof value === "string") return true; // Skip size check for preview URL.
      if (value instanceof File) {
        return value.size <= 5 * 1024 * 1024;
      }
      return false;
    }, "Maximum file size allowed is 5MB."),
});

type videoEditSchemaType = z.infer<typeof edtiFormSchema>;

const VideoEditOption = ({
  title,
  thumbnail,
  tags,
  handleSumbit,
  setThumbnailFile,
}: {
  thumbnail: string;
  title: string;
  tags: string[];
  setThumbnailFile: React.Dispatch<React.SetStateAction<File | null>>;
  handleSumbit: (formData: videoEditSchemaType) => void;
}) => {
  const form = useForm<videoEditSchemaType>({
    resolver: zodResolver(edtiFormSchema),
    defaultValues: {
      title: title,
      tags: tags,
      thumbnail: "",
    },
    mode: "all",
    reValidateMode: "onChange",
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSumbit)}
          className="flex h-full w-full flex-col sm:flex-row "
        >
          <FormField
            name="thumbnail"
            control={form.control}
            render={({ field }) => {
              // setPreview(value ? URL.createObjectURL(value as File) : null);

              return (
                <FormItem className="w-2/5 p-0.5">
                  <FormLabel htmlFor="thumbnail">Thumbnail</FormLabel>
                  <FormControl>
                    <ImageUploadPreview
                      thumbnail={thumbnail}
                      setThumbnail={setThumbnailFile}
                      controllProps={{ ...field }}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-right line-clamp-2">
                    Accepts jpeg, png, webp, jpg — max 5MB
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem className="p-3">
                <FormLabel htmlFor={field.name}>Title</FormLabel>
                <FormControl>
                  <input
                    className="custom_input"
                    {...field}
                    placeholder="add title...."
                    id={field.name}
                  />
                </FormControl>
                <FormDescription className="text-right text-xs line-clamp-2">
                  this is your video's title in 100 characters max.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>Tags</FormLabel>

                <TagInput
                  value={field.value || []}
                  onChange={field.onChange}
                  name={field.name}
                  disabled={field.disabled}
                />

                <FormDescription className="text-xs text-center justify-end ext-wrap line-clamp-2  ">
                  tags to make the search and ranking of video better max 20
                  tags allowed
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            variant={"ghost"}
            className="absolute right-0.5 m-0.5"
            type="submit"
          >
            <Save />
          </Button>
        </form>
      </Form>
    </>
  );
};

const VideoControllOption = ({
  thumbnail,
  className,
  title,
  owner,
  views,
  _id: videoId,
  tags,
  SetEditContext,
  EditContext,
}: videoControllOptionProps) => {
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
  return (
    <div className={className} key={videoId}>
      {EditContext.id === videoId ? (
        <VideoEditOption
          setThumbnailFile={setThumbnailFile}
          tags={tags}
          title={title}
          thumbnail={thumbnail}
          handleSumbit={handleSubmit}
          key={videoId}
        />
      ) : (
        <VideoControllOptionCard
          thumbnail={thumbnail}
          owner={owner}
          title={title}
          tags={tags}
          views={views}
        />
      )}
      <span className="flex flex-col justify-center items-start gap-5 ">
        <Button variant={"ghost"} value={videoId} onClick={onClickEdit}>
          <Pencil />
        </Button>
        <Button variant={"ghost"} value={videoId} onClick={onClickDelete}>
          <Trash2 />
        </Button>
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

const InitialEditContext = {
  id: "",
  reseted: true,
  video: { thumbnail: "", title: "", views: 0, owner: {} as IUser, tags: [] },
};
export const VideoControlPage = () => {
  const { username } = useSelector(selectUser);
  const { isLoading, isSuccess, data, fetchNextPage, hasNextPage } =
    useChannelVideos({
      limit: 10,
      sortBy: "createdAt",
      sortType: "asc",
      username,
    });

  const [EditContext, setEditContext] =
    useState<EditContext>(InitialEditContext);
  const fetchedVideos = useMemo<channelVideoType["Videos"]>(() => {
    if (data && data.pages) {
      return data.pages.flatMap((p) => {
        p.Videos = p.Videos.map((ele) => {
          ele.uniqueId = ele._id + ele.createdAt + ele.title;
          ele.SetEditContext = setEditContext;
          ele.EditContext = EditContext;
          return ele;
        });
        return p.Videos;
      });
    } else {
      return [];
    }
  }, [data, EditContext]);

  useEffect(() => {}, [EditContext]);

  return (
    <div className="w-full h-full flex flex-col">
      {EditContext.id != "" && EditContext.reseted === false && (
        <VideoControllOption
          thumbnail={EditContext.video.thumbnail}
          owner={EditContext.video.owner}
          title={EditContext.video.title}
          tags={EditContext.video.tags}
          EditContext={EditContext}
          SetEditContext={setEditContext}
          _id={EditContext.id}
          views={EditContext.video.views}
          className="w-full h-fit p-3 flex-row flex px-2"
        />
      )}
      {EditContext && EditContext.reseted == true && (
        <VideoOptionList<videoControllOptionProps>
          fetchNextPage={fetchNextPage}
          isLoading={isLoading}
          isSuccess={isSuccess}
          itemClassName="flex gap-3 w-full   min-h-[200px] overflow-hidden max-h-[250px] justify-evenly px-2"
          videos={fetchedVideos}
          Child={VideoControllOption}
          hasNextPage={hasNextPage}
        />
      )}
    </div>
  );
};
