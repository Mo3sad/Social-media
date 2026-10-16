import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// مكون فرعي لجلب بيانات اليوزر بالـ ID وعرضه في المودال
export function FollowItem({ userId, onClick }: { userId: string; onClick: () => void }) {
  const { data: userRes } = useQuery({
    queryKey: ["miniProfile", userId],
    queryFn: async () => {
      const token = localStorage.getItem("userToken");
      const res = await axios.get(
        `https://route-posts.routemisr.com/users/${userId}/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    enabled: !!userId,
  });

  const info = userRes?.data?.user;

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer"
    >
      <img
        src={
          info?.photo ||
          "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
        }
        alt={info?.name || "User"}
        className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-slate-700"
      />
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white hover:underline">
          {info?.name || "Loading..."}
        </h4>
        <p className="text-xs text-gray-400">@{info?.username || "user"}</p>
      </div>
    </div>
  );
}