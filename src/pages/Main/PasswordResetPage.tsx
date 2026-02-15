import { usePasswordReset } from "@/api/AuthApi";
import { Card, CardHeader } from "@/components/ui/card";
import {
  PasswordResetForm,
  PasswordResetFormType,
} from "@/forms/PasswordResetForm";

const ResetPasswordPage = () => {
  const { isPending, mutateAsync: resetPassword } = usePasswordReset();
  const handleSubmit = async ({
    newPassword,
    confirmPassword,
  }: PasswordResetFormType) => {
    console.log("reset form data", { newPassword, confirmPassword });
    await resetPassword({ newPassword, confirmPassword });
  };

  return (
    <div className="flex justify-center items-center container h-full">
      <Card className="flex justify-center p-10 sm:p-20  items-center h-fit w-fit ">
        <CardHeader className="w-full">
          <p className="text-center text-xl  w-full font-semibold sm:text-2xl">
            Change Password
          </p>
        </CardHeader>
        <PasswordResetForm
          onSubmit={handleSubmit}
          className="  flex flex-col gap-5 capitalize "
          isPending={isPending}
        />
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
