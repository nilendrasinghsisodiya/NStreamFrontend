type errorScreenProps = {
  mainMessage: string;
  secondaryMessage?: string;
};
export const ErrorScreen = ({
  mainMessage,
  secondaryMessage,
}: errorScreenProps) => {
  return (
    <div>
      <span className="text-2xl text-accent text-center tracking-wide">
        {mainMessage}
      </span>
      <span className="text-xl text-accent/90 tracking-wide text-center">
        {secondaryMessage || ""}
      </span>
    </div>
  );
};
