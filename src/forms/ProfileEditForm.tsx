import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useUpdateUser } from "@/api/UserApi";
import { setUser } from "@/contexts/auth/authSlice";
import { useDispatch } from "react-redux";
import { AxiosError } from "axios";
import { toast } from "sonner";

const userProfileSchema = z.object({
   fullname: z.string().trim().optional(),
   email: z.string().email().optional().or(z.literal("")),
   description: z
    .string()
    .trim()
    .optional(),
});
type formDataType = z.infer<typeof userProfileSchema>;
type props = {
  onSave: (formData: formDataType) => void;
  isPending: boolean;
};
const ProfileEditForm = ({ isPending, onSave }: props) => {
  const form = useForm<formDataType>({
    defaultValues: {
      fullname: "",
      description: "",
      email: "",
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
              <FormLabel htmlFor="fullname">Full Name</FormLabel>
              <FormControl>
                <input {...field} id="fullname"  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
       <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <input {...field}  autoComplete="email" className="custom_input" />
              </FormControl>
              <FormMessage />
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
                <textarea className="custom_textarea" {...field}  />
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
export const ProfileEdit = () => {
  const { updateUser, isPending, data } = useUpdateUser();
  const dispatch = useDispatch();
  const handleSumbit = async (formData: formDataType) => {
    try {
      console.log("handle summit triggered");
      console.log(formData);
      await updateUser(formData);
      if (data) {
        dispatch(setUser({ ...data, isAuthenticated: true }));
      }
      toast.success("user details updated sucessfully");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error("failed to update user details");
      }
    }
  };
  return <ProfileEditForm isPending={isPending} onSave={handleSumbit} />;
};
