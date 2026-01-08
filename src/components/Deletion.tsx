import { useDeleteUser } from "@/api/UserApi";
import { Button } from "@/components/ui/button";
export const Deletion = () => {
  const handleDelete = async () => {
    console.log("handling deletion");
  };
  return (
    <div className=" h-1/6 w-full p-3 m-3 border-destructive bg-destructive/50 border-2 rounded-xl flex flex-col gap-3">
      <h2 className="text-md text-center tracking-tight p-2 ">
        {" "}
        Destructive Zone
      </h2>
      <Button
        variant={"destructive"}
        className="border-2 border-destructive"
        onClick={handleDelete}
      >
        Delete Account
      </Button>
      <p className=" text-xs font-tight text-foreground/50 ">
        {" "}
        *this will delete your account which wont be recoverable after deletion
      </p>
    </div>
  );
};
