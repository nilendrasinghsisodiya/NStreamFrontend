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
import { ChangeEvent, useState } from "react";

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
    .email("not a valid email")
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
};

const SignUp = ({ className, onSave }: Props) => {
  const [pass, setPass] = useState<string>("");
  const [err, setError] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  const form = useForm<FormDataType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordAgain: "",
    },
    reValidateMode: "onChange",
    mode: "onSubmit",
  });

  return (
    <Form {...form}>
      <form className={`${className}`} onSubmit={form.handleSubmit(onSave)}>
        <h2 className="font-bold text-3xl">Sign Up</h2>
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  ref={null}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target) {
                      const val = e.target.value.trim();
                      if (val !== pass) {
                        setError("password does not match");
                        setIsError(true);
                      }
                      field.onChange(val);
                    }
                  }}
                />
              </FormControl>
              <FormMessage>
                {isError ? (
                  <span>{err}</span>
                ) : (
                  <span className="fixed hidden"></span>
                )}
              </FormMessage>
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
                <Input {...field} ref={null} />
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
                <Input
                  {...field}
                  ref={null}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target) {
                      const val = e.target.value;
                      setPass(val);
                      field.onChange(val);
                    }
                  }}
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
                <Input
                  {...field}
                  ref={null}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target) {
                      const val = e.target.value.trim();
                      if (val !== pass) {
                        setError("password does not match");
                        setIsError(true);
                      }
                      field.onChange(val);
                    }
                  }}
                />
              </FormControl>
              <FormMessage>
                {isError ? (
                  <span>{err}</span>
                ) : (
                  <span className="fixed hidden"></span>
                )}
              </FormMessage>
            </FormItem>
          )}
        />
        <Button type="submit" className="text-xl tracking-widest">
          Sign Up
        </Button>
      </form>
    </Form>
  );
};

export { SignUp };
