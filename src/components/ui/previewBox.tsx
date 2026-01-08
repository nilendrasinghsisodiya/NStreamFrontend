import { generateSrcSet } from "@/utils";
import { AspectRatio } from "./aspect-ratio";

type props = { classname?: string; url: string };
const PreviewBox = ({ classname, url }: props) => {
  return (
    <AspectRatio ratio={16 / 9} className={classname}>
      <img
        src={url}
        srcSet={generateSrcSet(url)}
        alt="changed avatar's preview"
        className="h-full w-full  text-center flex justify-center items-center outline-2 rounded-md p-2  text-s text-accent-foreground/70"
      />
    </AspectRatio>
  );
};

export { PreviewBox };
