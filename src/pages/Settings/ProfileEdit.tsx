import { AvatarEdit } from "@/forms/AvatarEditForm"
import { ProfileEdit } from "@/forms/ProfileEditForm"

export const ProfileEditPage = ()=>{
    return <div className="h-full w-full">
        <AvatarEdit/>
        <ProfileEdit/>
    </div>
}