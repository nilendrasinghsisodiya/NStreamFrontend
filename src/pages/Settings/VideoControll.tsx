import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/contexts/auth/authSlice";
import {
  channelVideoType,
  EditContext,
  useChannelVideos,
} from "@/api/ChannelApi";

import { VideoOptionList } from "@/components/VideoOptionList";
import { InitialEditContext } from "@/constants";
import {
  VideoEditCardWithForm,
  videoEditCardWithFormOptionProps,
} from "@/components/video/VideoEditCardWithForm";

export const VideoControlPage = () => {
  const { username } = useSelector(selectUser);
  const { isLoading, isSuccess, data, fetchNextPage, hasNextPage } =
    useChannelVideos({
      limit: 10,
      sortBy: "createdAt",
      sortType: "asc",
      username,
    });

  const [EditContext, setEditContext] =
    useState<EditContext>(InitialEditContext);
  const fetchedVideos = useMemo<channelVideoType["Videos"]>(() => {
    if (data && data.pages) {
      return data.pages.flatMap((p) => {
        p.Videos = p.Videos.map((ele) => {
          ele.uniqueId = ele._id + ele.createdAt + ele.title;
          ele.SetEditContext = setEditContext;
          ele.EditContext = EditContext;
          return ele;
        });
        return p.Videos;
      });
    } else {
      return [];
    }
  }, [data, EditContext]);

  return (
    <div className="w-full h-full flex flex-col">
      {EditContext.id != "" && EditContext.reseted === false && (
        <VideoEditCardWithForm
          thumbnail={EditContext.video.thumbnail}
          owner={EditContext.video.owner}
          title={EditContext.video.title}
          tags={EditContext.video.tags}
          EditContext={EditContext}
          SetEditContext={setEditContext}
          _id={EditContext.id}
          views={EditContext.video.views}
          className="w-full h-fit p-3 flex-row flex px-2"
        />
      )}
      {EditContext && EditContext.reseted == true && (
        <VideoOptionList<videoEditCardWithFormOptionProps>
          fetchNextPage={fetchNextPage}
          isLoading={isLoading}
          isSuccess={isSuccess}
          itemClassName="flex gap-3 w-full   min-h-[200px] overflow-hidden max-h-[250px] justify-evenly px-2"
          videos={fetchedVideos}
          Child={VideoEditCardWithForm}
          hasNextPage={hasNextPage}
        />
      )}
    </div>
  );
};
