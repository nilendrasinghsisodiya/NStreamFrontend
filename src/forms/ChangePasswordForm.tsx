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

const changePasswordSchema = z
  .object({
    oldPassword: z.string().trim().nonempty().nonoptional(),
    newPassword: z.string().trim().nonempty().nonoptional(),
    confirmPassword: z.string().trim().nonempty().nonoptional(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });
export type ChangePasswordFormType = z.infer<typeof changePasswordSchema>;
type props = {
  className?: string;
  isPending: boolean;
  onSubmit: (forData: ChangePasswordFormType) => void;
};
export const ChangePasswordForm = ({
  className,
  onSubmit,
  isPending,
}: props) => {
  const form = useForm<ChangePasswordFormType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
    reValidateMode: "onChange",
    mode: "all",
  });

  return (
    <Form {...form}>
      <form className={className} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="oldPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="oldPassword">old password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Button disabled={isPending} type="submit">
          Change Password
        </Button>
      </form>
    </Form>
  );
};
