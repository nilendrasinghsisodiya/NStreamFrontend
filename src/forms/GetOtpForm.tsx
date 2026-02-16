import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const GetOtpFormSchema = z.object({
  email: z.string().trim().email().nonempty().nonoptional(),
});

export type GetOtpType = z.infer<typeof GetOtpFormSchema>;
type props = {
  isPending: boolean;
  className: string;
  onSumbit: (data: GetOtpType) => void;
};
export const GetOtpForm = ({ className, isPending, onSumbit }: props) => {
  const form = useForm({
    defaultValues: { email: "" },
    resolver: zodResolver(GetOtpFormSchema),
    reValidateMode: "onChange",
    mode: "all",
  });

  return (
    <Form {...form}>
      <form className={className} onSubmit={form.handleSubmit(onSumbit)}>
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">Email </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  {...field}
                  placeholder="enter your email here..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          Reset My Password
        </Button>
      </form>
    </Form>
  );
};
