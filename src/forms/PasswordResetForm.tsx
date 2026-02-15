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
} from "@/components/ui/form";

const PasswordResetSchema = z.object({
  newPassword: z.string().trim().nonempty().nonoptional(),
  newPasswordAgain: z.string().trim().nonempty().nonoptional(),
});
PasswordResetSchema.refine((d) => d.newPassword === d.newPasswordAgain, {
  error: "passwords don't match",
});
export type PasswordResetFormType = z.infer<typeof PasswordResetSchema>;
type props = {
  className?: string;
  onSubmit: (forData: PasswordResetFormType) => void;
  errors: FieldErrors<PasswordResetFormType>;
};
export const PasswordResetForm = ({ className, onSubmit, errors }: props) => {
  const form = useForm<PasswordResetFormType>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: { newPassword: "", newPasswordAgain: "" },
    reValidateMode: "onChange",
    mode: "all",
    errors: errors,
  });

  return (
    <Form {...form}>
      <form className={className} onSubmit={form.handleSubmit(onSubmit)}>
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
      </form>
    </Form>
  );
};
