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
import { useCreateUser } from "@/api/UserApi";
import { setUser } from "@/contexts/auth/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

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
      coverImage: new File([], "empty"),
      description: "",
    },
    resolver: zodResolver(userProfileSchema),
    reValidateMode: "onChange",
    mode: "all",
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)}>
      
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} ref={null}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatar"
          render={({ field: { onChange} }) => (
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
                  ref={null}
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
          render={({ field: { onChange} }) => (
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
                  ref={null}
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
                <Textarea {...field} ref={null}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
       <Button type="submit" className="" disabled={isPending}>Submit</Button>
      </form>
    </Form>
  );
};
export const ProfileForm = ()=> {
  const {createUser,isPending} = useCreateUser();
  const dispatch  = useDispatch();
  const navigate = useNavigate();
  const handleSumbit = async (formData:formDataType)=>{
    console.log("handle summit triggered")
    const val= await createUser(formData);
      dispatch(setUser(val));
      navigate("/");
    }
  return <UserProfileForm isPending={isPending} onSave={handleSumbit}/>
}