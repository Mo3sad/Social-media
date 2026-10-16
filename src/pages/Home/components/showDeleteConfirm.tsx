import toast from 'react-hot-toast';

export function showDeleteConfirm(onConfirm: () => void, message: string = "Are you sure you want to delete this item?") {
  toast(
    (t) => (
      /* 👈 ضفنا هنا الخلفية، البادينج، والظل عشان الرسالة تظهر بوضوح فوق الصفحة */
      <div className="flex flex-col gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 w-72">
        <p className="font-medium text-sm text-gray-900 dark:text-white">
          {message}
        </p>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => toast.dismiss(t.id)}
            className="rounded-xl bg-gray-100 dark:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className="rounded-xl bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      position: "top-center",
    },
  );
}