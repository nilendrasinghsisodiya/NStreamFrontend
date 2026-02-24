import { EditContext } from "./api/ChannelApi";

export const InitialEditContext: EditContext = {
  id: "",
  reseted: true,
  video: { thumbnail: "", title: "", views: 0, owner: {} as IUser, tags: [] },
};
