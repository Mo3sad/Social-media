import { useState, useRef, useEffect, useMemo } from "react";
import { Bell, CheckCheck, Loader2, BellOff } from "lucide-react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  type InfiniteData,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import NotificationRow from "./NotificationRow";

interface NotificationItem {
  _id: string;
  type: "comment_post" | "like_post" | "share_post" | string;
  createdAt: string;
  isRead: boolean;
  actor?: { _id: string; name: string; photo: string };
  entityType?: string;
  entityId?: string;
}

type ListCache = InfiniteData<NotificationItem[], number>;
type Tab = "all" | "read";

const LIMIT = 10;

const api = axios.create({ baseURL: "https://route-posts.routemisr.com" });
api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("userToken")}`;
  return config;
});

const fetchUnreadCount = async (): Promise<number> => {
  const res = await api.get("/notifications/unread-count");
  return res.data?.data?.unreadCount || 0;
};

const fetchNotifications = async (
  page: number,
): Promise<NotificationItem[]> => {
  const res = await api.get(`/notifications?page=${page}&limit=${LIMIT}`);
  return res.data?.data?.notifications || [];
};

function patchList(
  old: ListCache | undefined,
  fn: (n: NotificationItem) => NotificationItem,
): ListCache | undefined {
  if (!old) return old;
  return { ...old, pages: old.pages.map((page) => page.map(fn)) };
}

export default function NotificationsPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("all");
  const popoverRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: fetchUnreadCount,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["notificationsList"],
    queryFn: ({ pageParam }) => fetchNotifications(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < LIMIT ? undefined : allPages.length + 1,
    enabled: isOpen,
  });

  const all = useMemo(() => data?.pages.flat() ?? [], [data]);
  const fresh = all.filter((n) => !n.isRead); // "New"
  const earlier = all.filter((n) => n.isRead); // "Earlier" / Read tab
  const isEmpty = (tab === "all" ? all : earlier).length === 0;

  /* 3. Mark one as read (optimistic) */
  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/notifications/${id}/read`, {});
      return res;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notificationsList"] });
      const prevLists = queryClient.getQueriesData<ListCache>({
        queryKey: ["notificationsList"],
      });
      const prevCount = queryClient.getQueryData<number>(["unreadCount"]);

      queryClient.setQueriesData<ListCache>(
        { queryKey: ["notificationsList"] },
        (old) =>
          patchList(old, (n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
      queryClient.setQueryData<number>(["unreadCount"], (c = 0) =>
        Math.max(0, c - 1),
      );

      return { prevLists, prevCount };
    },
    onError: (err: any, _id, ctx) => {
      ctx?.prevLists.forEach(([key, value]) =>
        queryClient.setQueryData(key, value),
      );
      queryClient.setQueryData(["unreadCount"], ctx?.prevCount);
      toast.error(
        err.response?.data?.message || "Couldn't mark the notification as read",
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationsList"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const res = await api.patch("/notifications/read-all", {});
      return res;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notificationsList"] });
      const prevLists = queryClient.getQueriesData<ListCache>({
        queryKey: ["notificationsList"],
      });
      const prevCount = queryClient.getQueryData<number>(["unreadCount"]);

      queryClient.setQueriesData<ListCache>(
        { queryKey: ["notificationsList"] },
        (old) => patchList(old, (n) => ({ ...n, isRead: true })),
      );
      queryClient.setQueryData<number>(["unreadCount"], 0);

      return { prevLists, prevCount };
    },
    onSuccess: () => toast.success("All notifications marked as read"),
    onError: (err: any, _vars, ctx) => {
      ctx?.prevLists.forEach(([key, value]) =>
        queryClient.setQueryData(key, value),
      );
      queryClient.setQueryData(["unreadCount"], ctx?.prevCount);
      toast.error(
        err.response?.data?.message || "Something went wrong, please try again",
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationsList"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
    },
  });

  const handleOpen = (item: NotificationItem) => {
    if (!item.isRead) markAsRead.mutate(item._id);
    setIsOpen(false);
    if (item.entityId) navigate(`/postDetails/${item.entityId}`);
  };

  /* Close on outside click + Escape */
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) =>
      e.key === "Escape" && setIsOpen(false);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const renderGroup = (title: string | null, items: NotificationItem[]) =>
    items.length > 0 && (
      <section>
        {title && (
          <h3 className="px-4 pt-3 pb-1 text-sm font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
        )}
        {items.map((item) => (
          <NotificationRow
            key={item._id}
            item={item}
            onOpen={handleOpen}
            onMarkRead={(id) => markAsRead.mutate(id)}
          />
        ))}
      </section>
    );

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className={`relative p-2.5 rounded-xl transition-all cursor-pointer ${
          isOpen
            ? "bg-[#149188]/10 text-[#149188]"
            : "bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:text-[#149188]"
        }`}
      >
        <Bell className={`w-4 h-4 ${isOpen ? "fill-[#149188]/20" : ""}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover - Responsive width & positioning for all screens */}
      {isOpen && (
        <div className="fixed sm:absolute left-1/2 sm:left-auto sm:right-0 -translate-x-1/2 sm:translate-x-0 top-16 sm:top-auto mt-3 w-[92vw] sm:w-[26rem] bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {" "}
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-3.5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Notifications
            </h2>
            <button
              onClick={() => {
                markAllAsRead.mutate();
              }}
              title="Mark all as read"
              aria-label="Mark all as read"
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
          </div>
          {/* Tabs: All / Unread */}
          <div className="flex items-center gap-2 px-4 pt-2 pb-2.5 border-b border-gray-100 dark:border-slate-800">
            {(["all", "read"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  tab === t
                    ? "bg-[#149188]/10 text-[#149188]"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
              >
                {t === "all" ? "All" : "Read"}
              </button>
            ))}
          </div>
          {/* List */}
          <div className="max-h-[26rem] overflow-y-auto pb-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-5 h-5 text-[#149188] animate-spin" />
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center py-10 px-4 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Couldn't load notifications.
                </p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-1.5 rounded-full bg-[#149188] text-white text-xs font-semibold cursor-pointer"
                >
                  Try again
                </button>
              </div>
            ) : isEmpty && !hasNextPage ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <BellOff className="w-9 h-9 text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {tab === "read"
                    ? "No read notifications"
                    : "No notifications yet"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {tab === "read"
                    ? "Notifications you've opened will show up here."
                    : "Likes, comments and shares on your posts will show up here."}
                </p>
              </div>
            ) : (
              <>
                {tab === "all" ? (
                  <>
                    {renderGroup("New", fresh)}
                    {renderGroup("Earlier", earlier)}
                  </>
                ) : (
                  renderGroup(null, earlier)
                )}

                {hasNextPage && (
                  <div className="px-3 pt-2">
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition cursor-pointer disabled:opacity-60"
                    >
                      {isFetchingNextPage && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      )}
                      See previous notifications
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
