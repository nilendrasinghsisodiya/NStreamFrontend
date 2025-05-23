import { useLoginUser, useRegisterUser } from "@/api/UserApi";
import { setRegistration, setUser } from "@/contexts/auth/authSlice";
import signUpFormDataType, { SignUp as SignUpForm } from "@/forms/SignUp";
import loginFormDataType, { LogInForm } from "@/forms/LoginForm";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

const AuthPage = () => {
  const {data:registrationData,RegisterUser}= useRegisterUser();
  const {data:loginData,loginUser,isError} = useLoginUser();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleRegistration = (formData: signUpFormDataType) => {
    RegisterUser(formData);
    if (registrationData) {
      dispatch(setRegistration(registrationData));

      navigate("/user-profile");
    }
  };

  const handleLogin = (formData: loginFormDataType) => {
    loginUser(formData);
   if(!isError && loginData){
   dispatch(setUser(loginData));}
    navigate("/");
   
  };

  return (
    <div className="flex   justify-center outline-1  outline-red-500 items-center w-full  h-full ">
      <Tabs defaultValue="login" className=" outline-1 outline-red-500 min-h-120 min-w-90 w-full h-full max-h-150 max-w-100">
        <TabsList className=" grid grid-cols-2 w-full ">
          <TabsTrigger value="login" >Log In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login"  className="w-full h-full">
          <Card className="h-full">
            <CardContent>
              <LogInForm onSave={handleLogin} className="w-full h-full flex flex-col  justify-center gap-7 p-4" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup" className="w-full h-full">
          <Card className=" h-full">
            <CardContent>
              <SignUpForm className="w-full h-full flex flex-col  justify-center gap-7 p-4" onSave={handleRegistration} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { AuthPage };
