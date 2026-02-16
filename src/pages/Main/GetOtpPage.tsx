import { useForgetPassword } from "@/api/OtpApi";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { GetOtpType, GetOtpForm } from "@/forms/GetOtpForm";

const GetOtpPage = () => {
  const { isPending, mutateAsync } = useForgetPassword();
  const handleSubmit = async ({ email }: GetOtpType) => {
    await mutateAsync({ email });
  };
  return (
    <div className="container h-full p-10 flex justify-center items-center">
      <Card className="p-10 shadow-accent-foreground/30 shadow-md sm:p-10 flex justify-center items-center gap-3">
        <CardHeader className=" tracking-wide  w-full text-center text-xl sm:text-2xl -mb-3 font-semibold ">
          Forgot Password
        </CardHeader>

        {/*<CardDescription className="text-xs sm:text-xl -mt-2 text-right w-full outline-2 outline-blue-400 pr-5 mr-3">
          forgot your password ?
        </CardDescription>
				*/}
        <GetOtpForm
          className="flex mt-5 flex-col gap-5"
          isPending={isPending}
          onSumbit={handleSubmit}
        />
      </Card>
    </div>
  );
};
export default GetOtpPage;
