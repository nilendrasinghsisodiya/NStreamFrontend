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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginFormSchema = z.object({
  email: z
    .string()
    .trim().nonempty()
    .email("not a valid email")
    .min(1, "email cant be  empty"),
 
  password: z.string().trim().min(1, "password can be empty"),
});
type FormDataType = z.infer<typeof loginFormSchema>;
export default FormDataType;
type Props = {
  className?: string;

  onSave: (formData: FormDataType) => void;
};

const LogInForm = ({ className, onSave }: Props) => {
  const form = useForm<FormDataType>({
    defaultValues: {
      email: "",
      password: "",
     
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(loginFormSchema),
  });

  return (
    <Form {...form} >
      <form className={`${className}`} onSubmit={form.handleSubmit(onSave)}>
        <h2 className="text-3xl font-bold">Log In</h2>

        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} ref={null} autoComplete="email" />
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
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input {...field} type="password" ref={null} autoComplete="current-password"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" >Log In</Button>
      </form>
    </Form>
  );
};

export { LogInForm };
