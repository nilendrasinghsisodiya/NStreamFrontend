type errorScreenProps = {
  mainMessage: string;
  secondaryMessage?: string;
  color?:string;
};
export const ErrorScreen = ({
  mainMessage,
  color,
  secondaryMessage,
}: errorScreenProps) => {
  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <span color={color} className="text-xl sm:text-2xl md:text-3xl lg:text-4xl capitalize text-foreground/50 text-center tracking-wide">
        {mainMessage}
      </span>
      <span color={color} className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground/30 capitalize tracking-wide text-center">
        {secondaryMessage || ""}
      </span>
    </div>
  );
};
