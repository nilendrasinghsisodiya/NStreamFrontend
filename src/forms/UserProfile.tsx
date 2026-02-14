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
import { useCreateUser } from "@/api/UserApi";
import { selectUser, setUser } from "@/contexts/auth/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "sonner";
import { ErrorScreen } from "@/components/ErrorComponent";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const allowedType = ["image/png", "image/jpeg", "image/"];
const MAX_FILE_SIZE = 5000000;
const userProfileSchema = z.object({
  fullname: z.string().trim().min(1, "fullname is required"),
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

  description: z.string().trim().min(1, "description can not be empty"),
});
type formDataType = z.infer<typeof userProfileSchema>;
type props = {
  onSave: (formData: formDataType) => void;
  isPending: boolean;
};
const UserProfileForm = ({ isPending, onSave }: props) => {
  const form = useForm<formDataType>({
    defaultValues: {
      fullname: "",
      avatar: new File([], "empty"),
      description: "",
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
          render={({ field: { onChange } }) => (
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
        <Button type="submit" className="" disabled={isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
};
export const ProfileForm = () => {
  const { createUser, isPending } = useCreateUser();
  const { isProfileComplete } = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSumbit = async (formData: formDataType) => {
    console.log("handle summit triggered");
    const val = await createUser(formData);
    dispatch(setUser({ ...val, isAuthenticated: true }));
    navigate("/");
  };
  useEffect(() => {
    if (isProfileComplete) {
      toast.error("404: unauthorized access");
      navigate("/");
    }
  }, [isProfileComplete, navigate]);

  if (isProfileComplete) {
    return (
      <ErrorScreen
        mainMessage="404: UNAUTHORIZED ACCESS"
        secondaryMessage="navigate to home"
      />
    );
  }

  return <UserProfileForm isPending={isPending} onSave={handleSumbit} />;
};
