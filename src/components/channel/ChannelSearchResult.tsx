import { GridComponents, VirtuosoGrid } from "react-virtuoso";
import { SafeAvatar } from "@/components/avatar/Avatars";
import { ErrorScreen } from "@/components/ErrorComponent";
import React from "react";
import { SubscribeButton } from "@/components/ui/SubscribeButton";

type props = {
  avatar: string;
  username: string;
  subscribersCount: number;
  className: string;
  userId: string;
  isSubscribed: boolean;
};
export const ChannelSearchCard = ({
  avatar,
  username,
  subscribersCount,
  className,
  userId,
  isSubscribed,
}: props) => {
  return (
    <div className={className}>
      <SafeAvatar
        avatar={avatar}
        to={`/channel/home?username=${username}`}
        username={username}
        failLink="#"
      />
      <div className="flex flex-col w-1/3 h-fit">
        <span>{username}</span>
        <span>{subscribersCount}</span>
      </div>
      <SubscribeButton
        isSubscribed={isSubscribed}
        targetId={userId}
        username={username}
        className="w-1/4"
      />
    </div>
  );
};

// flex flex-col w-full md:flex-row flex-wrap  justify-center contain-content gap-4
const List: GridComponents["List"] = React.forwardRef(
  ({ style, children, ...props }, ref) => (
    <div
      style={{ scrollBehavior: "-moz-initial", ...style }}
      {...props}
      ref={ref}
      className="grid grid-cols-1 w-full h-full scroll-smooth gap-3 p-0 m-0"
    >
      {children}
    </div>
  ),
);

const Item: GridComponents["Item"] = React.forwardRef(
  ({ children, ...props }, ref) => (
    <div ref={ref} {...props} className="h-fit w-full">
      {children}
    </div>
  ),
);

export interface UserWIthSubscriptionFlag extends IUser {
  isSubscribed: boolean;
}

type listProps = {
  users: UserWIthSubscriptionFlag[];
  useWindowScroll?: boolean;

  hasNextPage?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchNextPage: any;
  itemClassName: string;
};

export const UserListVirtual = ({
  users,
  useWindowScroll = true,
  fetchNextPage,

  hasNextPage,
  itemClassName,
}: listProps) => {
  return (
    <>
      {users.length > 0 ? (
        <VirtuosoGrid<UserWIthSubscriptionFlag>
          data={users}
          useWindowScroll={useWindowScroll}
          components={{
            List: List,
            Item: Item,
          }}
          itemContent={(_, data) => (
            <ChannelSearchCard
              avatar={data.avatar}
              userId={data._id}
              isSubscribed={data.isSubscribed}
              username={data.username}
              subscribersCount={data.subscribersCount}
              className={itemClassName}
            />
          )}
          endReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          scrollSeekConfiguration={{
            enter: (vel) => Math.abs(vel) > 150,
            exit: (vel) => Math.abs(vel) < 10,
          }}
          computeItemKey={(index, val) => val._id + index}
          increaseViewportBy={700}
          overscan={5}
          // isScrolling={(val) => console.log(val, "scrolling")}
        />
      ) : (
        <ErrorScreen mainMessage="no result  found" />
      )}
    </>
  );
};
