import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
type Props = {
  className?: string;
  text:string;
};
const LoadingButton = ({ className,text }: Props) => {
  return <Button disabled className={`${className}`} tabIndex={0}>
    <span>{text}</span><Loader2/>
  </Button>;
};

export { LoadingButton };
