import { AvatarEdit } from "@/forms/AvatarEditForm";
import { ProfileEdit } from "@/forms/ProfileEditForm";
import { Deletion } from "@/components/Deletion";
export const ProfileEditPage = () => {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center gap-2 ">
      <AvatarEdit />
      <ProfileEdit />
      <Deletion />
    </div>
  );
};
