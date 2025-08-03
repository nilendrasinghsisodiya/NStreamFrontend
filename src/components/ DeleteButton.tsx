import { LucideIcon } from "lucide-react";
import { Button } from "./ui/button";

export const DeleteButton = ({
  content,
  Icon,
  className,
  onClick
}: {
  onClick: (e:React.MouseEvent)=>void;
  content: string;
  Icon?: LucideIcon;
  className?: string;
}) => {
  <Button className={className} variant={"destructive"} onClick={onClick}>
    {content? content : (Icon && <Icon />)}
  </Button>;
};
