import z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

const signUpSchema = z.object({
  email: z
    .string()
    .trim()
    .email("not a valid email")
    .min(1, "email cant be  empty"),
  username: z
    .string()
    .trim()
    .nonempty()
    .min(3, "minmum 3 characters required")
    .max(12, "maxium 12 characters are allowed"),
  password: z.string().trim().min(1, "password cant be empty"),
  passwordAgain: z.string().trim().min(1, "password cant be empty"),
});

type FormDataType = z.infer<typeof signUpSchema>;
export default FormDataType;

type Props = {
  className?: string;
  onSave: (FormData: FormDataType) => void;
  isPending:boolean;
};

const SignUp = ({ className, onSave ,isPending}: Props) => {
  

  const form = useForm<FormDataType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordAgain: "",
    },
    reValidateMode: "onChange",
    
    mode: "all",
  });

  return (
    <Form {...form}>
      <form className={`${className}`} onSubmit={form.handleSubmit(onSave)}>
        <h2 className="font-bold text-xl">Sign Up</h2>
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <input
                className="custom_input"
                  {...field}
                  
                  
                />
              </FormControl>
              <FormMessage/>    </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <input className="custom_input" {...field}  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <input className="custom_input"
                  {...field}
                  type="password"
                  
               
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="passwordAgain"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <input className="custom_input"
                  {...field}
                  type="password"
                  
                 
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <div className="w-full flex gap-2 p-2">
          <Button type="submit" disabled={isPending} className="w-1/2"> Submit</Button>
          <Button type="reset" className="w-1/2">Reset</Button>
        </div>
      </form>
    </Form>
  );
};

export { SignUp };
