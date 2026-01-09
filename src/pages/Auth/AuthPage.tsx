import { useLoginUser, useRegisterUser } from "@/api/AuthApi";
import { setRegistration, setUser } from "@/contexts/auth/authSlice";
import signUpFormDataType, { SignUp as SignUpForm } from "@/forms/SignUp";
import loginFormDataType, { LogInForm } from "@/forms/LoginForm";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const AuthPage = () => {
  const { RegisterUser, isPending: regPending } = useRegisterUser();
  const { loginUser, isPending } = useLoginUser();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleRegistration = async (formData: signUpFormDataType) => {
    const registrationData = await RegisterUser(formData);

    dispatch(
      setRegistration({
        ...registrationData,
        isAuthenticated: false,
        isEmailVerfied: false,
      }),
    );

    navigate("/user-reg-profile");
  };

  const handleLogin = async (formData: loginFormDataType) => {
    const loginData = await loginUser(formData);

    dispatch(setUser({ ...loginData, isAuthenticated: true }));
    navigate("/");
  };

  return (
    <div className="flex   justify-center   items-start w-full  h-full mt-17">
      <Tabs defaultValue="login" className=" ">
        <TabsList className=" grid grid-cols-2 w-full ">
          <TabsTrigger value="login">Log In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login" className="w-full h-full">
          <Card className="h-full">
            <CardContent>
              <LogInForm
                onSave={handleLogin}
                isPending={isPending}
                className="w-full h-full flex flex-col  justify-center gap-2 p-2"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup" className="w-full h-full">
          <Card className=" h-full">
            <CardContent>
              <SignUpForm
                isPending={regPending}
                className="w-full h-full flex flex-col  justify-center gap-2 p-2"
                onSave={handleRegistration}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { AuthPage };
