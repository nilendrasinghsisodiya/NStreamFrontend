import {
  ChangePasswordForm,
  ChangePasswordFormType,
} from "@/forms/ChangePasswordForm";
import { useChangePassword } from "@/api/AuthApi";
import { Card, CardHeader } from "@/components/ui/card";
const PasswordChangePage = () => {
  const { isPending, error, mutateAsync: changePassword } = useChangePassword();

  const handleSubmit = async ({
    oldPassword,
    newPassword,
    confirmPassword,
  }: ChangePasswordFormType) => {
    console.log("change password data", { oldPassword, newPassword });
    await changePassword({ oldPassword, newPassword, confirmPassword });
  };
  return (
    <div className="flex justify-center items-center container h-full">
      <Card className="flex justify-center p-10 sm:p-20  items-center h-fit w-fit ">
        <CardHeader className="w-full">
          <p className="text-center text-xl  w-full font-semibold sm:text-2xl">
            Change Password
          </p>
        </CardHeader>
        <ChangePasswordForm
          onSubmit={handleSubmit}
          className="  flex flex-col gap-5 capitalize "
          isPending={isPending}
        />
      </Card>
    </div>
  );
};
export default PasswordChangePage;
