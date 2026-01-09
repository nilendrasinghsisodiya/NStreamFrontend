import { Home, Layers, Video } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  const items = [
    { title: "Home", url: "/", icon: Home, Link: true },
    {
      title: "Subscriptions",
      url: "/subscriptions",
      icon: Layers,
      Link: true,
    },
    {
      title: "Upload",
      url: "/upload-video",
      icon: Video,
      Link: true,
    },
  ];
  return (
    <div className="flex  row-span-1 py-2 fixed bottom-0 bg-background bg-blend-normal z-[50] gap-4 dark:border-t-white border-1 border-t-accent w-full h-15 justify-between items-center">
      {items.map((item) => (
        <div
          tabIndex={0}
          className="flex flex-col justify-center items-center flex-auto w-full"
          key={item.title}
        >
          {item.Link ? (
            <Link to={item.url}>
              <item.icon to="#" className=" self-center justify-self-center" />
              <span className="text-center text-[10px] text-seconadry-foreground">
                {item.title}
              </span>
            </Link>
          ) : (
            <>
              <item.icon
                className=" self-center justify-self-center"
                to="/auth"
              />
              <span className="text-center text-[10px] text-seconadry-foreground ">
                {item.title}
              </span>
            </>
          )}
        </div>
      ))}
    </div>
  );
};
const MemoFooter = memo(Footer);
export { Footer };
export default MemoFooter;
