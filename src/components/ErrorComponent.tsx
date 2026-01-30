import { CircleOff } from "lucide-react";

type errorScreenProps = {
  mainMessage: string;
  secondaryMessage?: string;
  isError?: boolean;
};
export const ErrorScreen = ({
  mainMessage,
  isError = false,
  secondaryMessage,
}: errorScreenProps) => {
  return (
    <div className="flex flex-col w-full h-fit justify-center items-center gap-1 ">
      {isError && (
        <CircleOff className="h-1/3 w-1/3 aspect-square text-destructive" />
      )}
      <span
        className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl capitalize  text-center font-extrabold  tracking-wide ${isError ? "text-destructive" : "text-foreground/50"}`}
      >
        {mainMessage}
      </span>
      <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground/30 capitalize tracking-wide text-center">
        {secondaryMessage || ""}
      </span>
    </div>
  );
};
