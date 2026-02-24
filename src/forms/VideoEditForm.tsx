import { ImagePreview } from "@/components/ImagePreview";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TagInput } from "@/components/ui/TagInputComponent";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { allowedImageType } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

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

export type videoEditSchemaType = z.infer<typeof edtiFormSchema>;

export const VideoEditForm = ({
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
  const IsMobile = useIsMobile();

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
                <FormItem className=" w-full sm:w-2/4 p-0.5">
                  <FormLabel htmlFor="thumbnail">Thumbnail</FormLabel>
                  <FormControl>
                    <ImagePreview
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
                  <Input
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
            className={cn(
              "absolute right-4.5  top-35",
              !IsMobile && "right-5 outline-2 outline-green-300 top-35",
            )}
            type="submit"
          >
            <Save />
          </Button>
        </form>
      </Form>
    </>
  );
};
