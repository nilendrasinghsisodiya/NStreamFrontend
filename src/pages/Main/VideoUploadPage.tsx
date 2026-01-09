import { useForm } from "react-hook-form";
import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TagInput } from "@/components/ui/TagInputComponent";
import { Upload } from "lucide-react";
import { useUploadVideo } from "@/api/VideoApi";
import { toast } from "sonner";
import { startUpload } from "@/contexts/videoUpload/videoUploadSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectUser } from "@/contexts/auth/authSlice";
import { allowedImageType, allowedVideoType, appendFormData } from "@/utils";
import { VideoUploadsList } from "@/components/videoUpload/VideoUpload";
import { AxiosError } from "axios";

const maxThumbnailSize = 5 * 1024 * 1024;

const maxVideoSize = 25 * 1024 * 1024;

const videoUploadSchema = z.object({
  title: z
    .string()
    .trim()
    .nonempty()
    .min(3)
    .max(100, "maximum 32 characters allowed"),
  tags: z
    .array(z.string().trim())
    .max(20, "maximum 20 tags allowed")
    .optional(),
  thumbnail: z
    .instanceof(File)
    .refine((value: File) => {
      if (!value) return;
      return allowedImageType.includes(value.type);
    }, "Only jpeg, png , and gif's are allowed")
    .refine((value) => {
      if (!value) return;
      return value.size <= maxThumbnailSize;
    }, "Maximun file size allowed 5MB."),

  videoFile: z
    .instanceof(File)
    .refine((value: File) => {
      if (!value) return;
      return allowedVideoType.includes(value.type);
    }, "only webm,mp4,avi and mpeg allowed")
    .refine((value: File) => {
      if (!value) return;
      return value.size <= maxVideoSize;
    }, "max video size 25 MB only"),
});

type formDataType = z.infer<typeof videoUploadSchema>;

export const VideoUploadForm = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { mutateAsync: uploadVideo, isPending } = useUploadVideo();
  const handleSubmit = async (data: formDataType) => {
    console.log(data);
    try {
      for (const [key, value] of Object.entries(data)) {
        console.log(`${key} → ${value}`);
        if (!value) {
          toast.error("invalid form enteries", { toasterId: "global" });
          console.log("invalid entries");
          return;
        }
      }
      dispatch(
        startUpload({
          id: `${data.title}+${user._id}`,
          title: data.title,
          uploader: user._id,
        }),
      );
      const formData = new FormData();
      appendFormData(formData, data);
      uploadVideo(formData);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(`video upload: ${error.message}`);
      }
      console.error(error);
    }
  };
  const form = useForm<formDataType>({
    resolver: zodResolver(videoUploadSchema),
    defaultValues: {
      thumbnail: undefined,
      videoFile: undefined,
      tags: [],
      title: "",
    },
    reValidateMode: "onChange",
    mode: "all",
  });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 justify-items-center p-5 gap-3 h-full w-full ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="col-span-1 h-full w-full flex flex-col items-center justify-center row-span-1"
        >
          <fieldset className="border-2 border-accent p-3 lg:p-6 gap-2 rounded-xl min-w-72  min-h-1/2 lg:max-w-120 flex flex-col">
            {/* <legend className="text-xl text-foreground tracking-wide capitalize font-extrabold ">
              Video Upload
            </legend> */}
            <h3 className="text-foreground tracking-wide  text-center font-extrabold text-xl">
              Video Upload
            </h3>
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem className="p-3">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <input
                      className="custom_input"
                      {...field}
                      placeholder="add title...."
                    />
                  </FormControl>
                  <FormDescription className="text-right text-xs">
                    this is your video's title in 100 characters max.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="thumbnail"
              control={form.control}
              render={({ field: { onChange, name, disabled, onBlur } }) => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <input
                      className="custom_input"
                      type="file"
                      max={1}
                      name={name}
                      min={1}
                      onBlur={onBlur}
                      disabled={disabled}
                      onChange={(e) => {
                        const files = e.currentTarget?.files;
                        if (files && files[0]) {
                          onChange(files[0]);
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-right line-clamp-2 ">
                    accepts jpeg, png, webp, jpg's of 5MB max.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="videoFile"
              control={form.control}
              render={({ field: { onChange, name, disabled, onBlur } }) => (
                <FormItem>
                  <FormLabel>Video</FormLabel>
                  <FormControl>
                    <input
                      className="custom_input"
                      type="file"
                      max={1}
                      name={name}
                      min={1}
                      disabled={disabled}
                      onChange={(e) => {
                        const files = e.currentTarget?.files;
                        if (files && files[0]) {
                          onChange(files[0]);
                        }
                      }}
                      onBlur={onBlur}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-right line-clamp-2 ">
                    accepts mp4, webm, mpeg, avi's of 250MB max.
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
                  <FormLabel>Tags</FormLabel>

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
              type="submit"
              disabled={!form.formState.isValid || isPending}
            >
              Upload <Upload />
            </Button>
          </fieldset>
        </form>
      </Form>
      <VideoUploadsList className="flex flex-col h-full w-full border-2 border-accent rounded-xl row-span-1 p-3 overflow-scroll" />
    </div>
  );
};
