import { useQuery } from "@tanstack/react-query";
import axios, { type AxiosError, type AxiosResponse } from "axios";
import LoaderApi from "../../components/LoaderApi/LoaderApi";
import PostCard from "./components/PostCard/PostCard";
import type { Post, PostsResponse } from "../../types/post.type";
import CreatePost from "./components/CreatePostBox/CreatePostBox";

export default function Home() {
  function getPost() {
    return axios.get<PostsResponse>(
      "https://route-posts.routemisr.com/posts?sort=-createdAt",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data, isLoading, isError, error } = useQuery<
    AxiosResponse<PostsResponse>,
    AxiosError
  >({
    queryKey: ["getAllPost"],
    queryFn: getPost,
  
  });
  if (isLoading) {
    return <LoaderApi />;
  }
  if (isError) {
    return <p> {error.message}</p>;
  }
// console.log(data?.data);

  return (
    <>
      <div className="m-4">
        <CreatePost />
      </div>

      {data?.data.data.posts.map((post: Post) => {
        return <PostCard key={post._id} post={post} postDetails={false} />;
      })}
    </>
  );
}
