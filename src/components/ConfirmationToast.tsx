import { toast } from "sonner";
import { Button } from "./ui/button";

export const ConfirmationToast = ({
  t,
  handleConfirmation,
  message,
  heading,
}: {
  t: any;
  handleConfirmation: () => Promise<unknown>;
  message: string;
  heading: string;
}) => {
  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      }  flex flex-col p-5 items-center justify-between gap-4 bg-background text-white rounded-md w-fit h-fit sm:-translate-1/2  border-accent border-2 shadow-2xs shadow-accent`}
    >
      <span className="text-2xl text-center font-bold">{heading}</span>
      <span className="text-xl text-center font-semibold">{message}</span>
      <div className="flex gap-2 justify-around w-full">
        <Button
          variant={"destructive"}
          onClick={async () => {
            await handleConfirmation();
            toast.dismiss(t.id);
          }}
        >
          Yes
        </Button>
        <Button onClick={() => toast.dismiss(t.id)}>No</Button>
      </div>
    </div>
  );
};
