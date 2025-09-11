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

const allowedType = ["image/png", "image/jpeg","image/webp" ];
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
};
const AvatarEditForm = ({ isPending, onSave }: props) => {
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
        className="flex flex-col w-1/2 justify-center m-auto mt-16 rounded-xl gap-3  border-2 border-accent h-fit p-5"
      >
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar</FormLabel>
              <FormControl>
                <input
                onBlur={field.onBlur}
                name={field.name}
                disabled={field.disabled}
                ref={field.ref}
                className="custom_input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      field.onChange(e.target.files[0]);
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
  const dispatch = useDispatch();
  const handleSumbit = async (formData: formDataType) => {
    try {
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
  return <AvatarEditForm isPending={isPending} onSave={handleSumbit} />;
};
