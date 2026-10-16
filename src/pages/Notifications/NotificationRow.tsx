import {
  Bell,
  Check,
  MessageCircle,
  Share2,
  ThumbsUp,
} from "lucide-react";

export interface NotificationItem {
  _id: string;
  type: "comment_post" | "like_post" | "share_post" | string;
  createdAt: string;
  isRead: boolean;
  actor?: {
    _id: string;
    name: string;
    photo: string;
  };
  entityType?: string;
  entityId?: string;
}

interface NotificationRowProps {
  item: NotificationItem;
  onOpen: (item: NotificationItem) => void;
  onMarkRead: (id: string) => void;
}

const DEFAULT_AVATAR =
  "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

const ACTION_TEXT: Record<string, string> = {
  comment_post: "commented on your post.",
  like_post: "liked your post.",
  share_post: "shared your post.",
};

const BADGE: Record<
  string,
  { bg: string; icon: React.ReactNode }
> = {
  like_post: {
    bg: "bg-blue-500",
    icon: (
      <ThumbsUp className="w-2.5 h-2.5 text-white fill-white" />
    ),
  },

  comment_post: {
    bg: "bg-emerald-500",
    icon: (
      <MessageCircle className="w-2.5 h-2.5 text-white fill-white" />
    ),
  },

  share_post: {
    bg: "bg-purple-500",
    icon: <Share2 className="w-2.5 h-2.5 text-white" />,
  },
};

function getTimeAgo(dateString: string) {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000
  );

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);

  if (days < 7) return `${days}d`;

  const weeks = Math.floor(days / 7);

  if (weeks < 5) return `${weeks}w`;

  return new Date(dateString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function TypeBadge({ type }: { type: string }) {
  const badge = BADGE[type] ?? {
    bg: "bg-[#149188]",
    icon: <Bell className="w-2.5 h-2.5 text-white" />,
  };

  return (
    <span
      className={`absolute -bottom-1 -right-1 w-5 h-5 ${badge.bg} rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-sm`}
    >
      {badge.icon}
    </span>
  );
}

export default function NotificationRow({
  item,
  onOpen,
  onMarkRead,
}: NotificationRowProps) {
  const unread = !item.isRead;

  const actorName = item.actor?.name || "Someone";

  const action =
    ACTION_TEXT[item.type] ?? "interacted with your account.";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onOpen(item);
        }
      }}
      className="group relative flex items-start gap-3 p-3 mx-1.5 my-0.5 rounded-xl cursor-pointer transition hover:bg-gray-100 dark:hover:bg-slate-800/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#149188]"
    >
      {/* Avatar + Type Badge */}

      <div className="relative shrink-0">
        <img
          src={item.actor?.photo || DEFAULT_AVATAR}
          alt={actorName}
          className="w-12 h-12 rounded-full object-cover"
        />

        <TypeBadge type={item.type} />
      </div>

      {/* Notification Text + Time */}

      <div className="flex-1 min-w-0">
        <p
          className={`text-[13px] leading-snug ${
            unread
              ? "text-gray-900 dark:text-white font-medium"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <span className="font-bold">{actorName}</span>{" "}
          {action}
        </p>

        <span
          className={`text-[11px] mt-0.5 block ${
            unread
              ? "text-[#149188] font-semibold"
              : "text-gray-400"
          }`}
        >
          {getTimeAgo(item.createdAt)}
        </span>
      </div>

      {/* Mark as Read */}

      {unread && (
        <div className="flex items-center gap-1 self-center shrink-0">
          <button
            type="button"
            title="Mark as read"
            aria-label="Mark as read"
            onClick={(e) => {
              e.stopPropagation();
              onMarkRead(item._id);
            }}
            className="sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 p-1.5 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
          >
            <Check className="w-3.5 h-3.5" />
          </button>

          <span className="w-3 h-3 bg-[#149188] rounded-full" />
        </div>
      )}
    </div>
  );
}