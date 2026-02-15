import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FieldErrors, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

const changePasswordSchema = z.object({
  oldPassword: z.string().trim().nonempty().nonoptional(),
  newPassword: z.string().trim().nonempty().nonoptional(),
  newPasswordAgain: z.string().trim().nonempty().nonoptional(),
});
changePasswordSchema.refine((d) => d.newPasswordAgain == d.newPassword, {
  error: "passwords don't match",
});
type ChangePasswordFormType = z.infer<typeof changePasswordSchema>;
type props = {
  className?: string;
  onSubmit: (forData: ChangePasswordFormType) => void;
  errors: FieldErrors<ChangePasswordFormType>;
};
const ChangePasswordForm = ({ className, onSubmit, errors }: props) => {
  const form = useForm<ChangePasswordFormType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", newPasswordAgain: "" },
    reValidateMode: "onChange",
    mode: "all",
    errors,
  });

  return (
    <Form {...form}>
      <form className={className} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="oldPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FormLabel htmlFor="oldPassword">old password</FormLabel>
                <Input {...field} type="password" />
                <FormMessage />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="newPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FormLabel htmlFor="newPassword">new password</FormLabel>
                <Input {...field} type="password" />
                <FormMessage />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="newPasswordAgain"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FormLabel htmlFor="newPasswordAgain">new password</FormLabel>
                <Input {...field} type="password" />
                <FormMessage />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">submit</Button>
      </form>{" "}
    </Form>
  );
};
