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
  confirmPassword: z.string().trim().nonempty().nonoptional(),
});
PasswordResetSchema.superRefine((data, ctx) => {
  if (data.newPassword !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  }
});
export type PasswordResetFormType = z.infer<typeof PasswordResetSchema>;
type props = {
  className?: string;
  isPending: boolean;
  onSubmit: (forData: PasswordResetFormType) => void;
};
export const PasswordResetForm = ({
  className,
  isPending,
  onSubmit,
}: props) => {
  const form = useForm<PasswordResetFormType>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
    reValidateMode: "onChange",
    mode: "all",
  });

  return (
    <Form {...form}>
      <form className={className} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="newPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="newPassword">new password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="confirmPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="confirmPassword">
                confirm new password
              </FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          Reset Password
        </Button>
      </form>
    </Form>
  );
};
