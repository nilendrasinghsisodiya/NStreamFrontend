import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useDeleteUser, useVerifyEmail } from "@/api/VerificationTokenApi";
import { ErrorScreen } from "@/components/ErrorComponent";
export const VerificationTokenLandingPage = () => {
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action") as string;
  const token = searchParams.get("token") as string;
  const navigate = useNavigate();
  const verifyEmail = useVerifyEmail();
  const deleteUser = useDeleteUser();
  const hasRun = useRef(false);
  const activeMutation =
    action === "verifyEmail"
      ? verifyEmail
      : action === "delete"
        ? deleteUser
        : null;

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    console.log(action, token);

    if (!token || !action) {
      console.error("invalid token action");
      toast.error("invalid token", { toasterId: "global" });
      navigate("/", { replace: true });
    }
    switch (action) {
      case "verifyEmail": {
        console.log(token);
        console.log(action);
        console.log("making api call for email verification");
        verifyEmail.mutate({ token });
        break;
      }
      case "delete": {
        console.log(action);
        console.log(token);
        console.log("making api call for account deletion");
        deleteUser.mutate({ token });
        break;
      }
      default: {
        console.log(token);
        console.log(action);
        console.error("invalid token action");
        navigate("/", { replace: true });
        break;
      }
    }
  }, [action, token, navigate, deleteUser, verifyEmail]);
  if (!activeMutation) {
    return (
      <ErrorScreen
        mainMessage="INVALID ACTION"
        secondaryMessage="invalid or undefined action param"
      />
    );
  }

  if (activeMutation.isError) {
    return <ErrorScreen mainMessage="An error occured" />;
  }

  if (activeMutation.isSuccess) {
    return (
      <p>
        {action === "verifyEmail"
          ? "Email verified successfully"
          : "Account deleted successfully"}
      </p>
    );
  }
};
