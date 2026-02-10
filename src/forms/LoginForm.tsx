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
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
const loginFormSchema = z.object({
	email: z
		.string()
		.trim()
		.nonempty()
		.email("not a valid email")
		.min(3, "email cant be  empty"),

	password: z.string().trim().min(1, "password cant be empty"),
});
type FormDataType = z.infer<typeof loginFormSchema>;
export default FormDataType;
type Props = {
	className?: string;
	isPending: boolean;
	onSave: (formData: FormDataType) => void;
};

const LogInForm = ({ className, onSave, isPending }: Props) => {
	const form = useForm<FormDataType>({
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "all",
		reValidateMode: "onChange",
		resolver: zodResolver(loginFormSchema),
	});

	return (
		<Form {...form}>
			<form className={`${className}`} onSubmit={form.handleSubmit(onSave)}>
				<h2 className="text-xl font-bold">Log In</h2>

				<FormField
					name="email"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									{...field}
									autoComplete="email"
								/>
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
								<Input
									{...field}
									type="password"
									autoComplete="current-password"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Link to={"/pass-reset-init"} replace className="text-blue-300">
					forgot password ?
				</Link>
				<Button type="submit" disabled={isPending}>
					Log In
				</Button>
			</form>
		</Form>
	);
};

export { LogInForm };
