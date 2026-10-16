import CreatePost from "../Home/components/CreatePostBox/CreatePostBox";
import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import ProfileTabs from "./components/ProfileTabs/ProfileTabs";

export default function Profile() {
  return (
    <>
      <ProfileHeader />
      <div className="m-4">
        <CreatePost />
      </div>
      <ProfileTabs />
    </>
  );
}
