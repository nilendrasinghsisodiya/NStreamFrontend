import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useUpdateUserAvatar } from "@/api/UserApi";
import { setUser } from "@/contexts/auth/authSlice";
import { useDispatch } from "react-redux";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { PreviewBox } from "@/components/ui/previewBox";
import { Input } from "@/components/ui/input";

const allowedType = ["image/png", "image/jpeg", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const userProfileSchema = z.object({
  avatar: z
    .instanceof(File)
    .refine((value: File) => {
      if (!value) return;
      return allowedType.includes(value.type);
    }, "Only jpeg,  png and webp's are allowed")
    .refine((value) => {
      if (!value) return;
      return value.size <= MAX_FILE_SIZE;
    }, "Maximun file size allowed 5MB."),
});
type formDataType = z.infer<typeof userProfileSchema>;
type props = {
  onSave: (formData: formDataType) => void;
  isPending: boolean;

  setPreview: React.Dispatch<React.SetStateAction<string>>;
};
const AvatarEditForm = ({ isPending, onSave, setPreview }: props) => {
  const form = useForm<formDataType>({
    defaultValues: {
      avatar: undefined,
    },
    resolver: zodResolver(userProfileSchema),
    reValidateMode: "onChange",
    mode: "all",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSave)}
        className="flex flex-col w-full justify-center  rounded-xl gap-3  border-none  h-fit p-5"
      >
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar</FormLabel>
              <FormControl>
                <Input
                  onBlur={field.onBlur}
                  name={field.name}
                  disabled={field.disabled}
                  ref={field.ref}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      field.onChange(e.target.files[0]);
                      const avatarUrl = URL.createObjectURL(e.target.files[0]);
                      setPreview(avatarUrl);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Accepts jpeg, png, gif's of maximum size 5MB.
              </FormDescription>
            </FormItem>
          )}
        />

        <Button type="submit" className="" disabled={isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export const AvatarEdit = () => {
  const { mutateAsync, isPending, data } = useUpdateUserAvatar();
  const [avatar_preview, setAvatarPreview] = useState<string>("");
  const dispatch = useDispatch();
  const handleSumbit = async (formData: formDataType) => {
    try {
      console.log(formData);

      await mutateAsync(formData);
      if (data) {
        dispatch(setUser({ ...data, isAuthenticated: true }));
      }
      toast.success("avatar updated sucessfully");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error("failed to update avatar");
      }
    }
  };
  return (
    <div className=" w-full   flex flex-col sm:flex-row  justify-center items-center contain-content border-2 border-accent rounded-lg m-auto p-3">
      <PreviewBox url={avatar_preview} classname="w-45 h-40 m-auto" />
      <AvatarEditForm
        isPending={isPending}
        onSave={handleSumbit}
        setPreview={setAvatarPreview}
      />
    </div>
  );
};
