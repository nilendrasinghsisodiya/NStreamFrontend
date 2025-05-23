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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/layout/LoadingButton";

const allowedType = ["image/png", "image/jpeg", "image/"];
const MAX_FILE_SIZE = 5000000;
const userProfileSchema = z.object({
  fullname: z.string().trim().min(1,"fullname is required"),
  avatar: z
    .instanceof(File)
    .refine((value: File) => {
      if (!value) return;
      return allowedType.includes(value.type);
    }, "Only jpeg, png , and gif's are allowed")
    .refine((value) => {
      if (!value) return;
      return value.size <= MAX_FILE_SIZE;
    }, "Maximun file size allowed 5MB."),
  email: z.string().trim().email("not a valid email").min(1, "email cant be  empty"),
  coverImage: z
    .instanceof(File)
    .optional()
    .refine((value) => {
      if (!value) return;
      return allowedType.includes(value.type);
    })
    .refine((value) => {
      if (!value) return;
      return value.size <= MAX_FILE_SIZE;
    }, "Maximun file size allowed 5MB."),

  description: z.string().trim().min(1,"description can not be empty"),
  username: z
    .string().trim()
    .min(3, "should not be less than 3 character long")
    .max(20, "should not be more than 20 characters long"),
});
type formDataType = z.infer<typeof userProfileSchema>;
type props = {
  onSave: (formData: formDataType) => void;
  isLoading: boolean;
};
const UserProfileForm = ({ isLoading, onSave }: props) => {
  const form = useForm<formDataType>({
    defaultValues: {
      username: "",
      fullname: "",
      avatar: new File([], "empty"),
      coverImage: new File([], "empty"),
      description: "",
    },
    resolver: zodResolver(userProfileSchema),
    reValidateMode: "onChange",
    mode: "onChange",
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatar"
          render={({ field: { onChange, ref } }) => (
            <FormItem>
              <FormLabel>Avatar</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      onChange(e.target.files[0]);
                    }
                  }}
                  ref={ref}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Accepts jpeg, png, gif's of maximum size 5MB.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverImage"
          render={({ field: { onChange, ref } }) => (
            <FormItem>
              <FormLabel>CoverImage</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      onChange(e.target.files[0]);
                    }
                  }}
                  ref={ref}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Accepts jpeg, png, gif's of maximum size 5MB.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isLoading ? (
          <LoadingButton
            text="Submiting"
            className="bg-foreground text-background"
          />
        ) : (
          <Button type="submit" / >
        )}
      </form>
    </Form>
  );
};

export { UserProfileForm };
