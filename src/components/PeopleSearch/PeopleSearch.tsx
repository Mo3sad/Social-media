// import { useState } from "react";
// import { Search } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// export default function PeopleSearch({ users = [] }: { users: any[] }) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const navigate = useNavigate();

//   // فلترة المستخدمين بناءً على الاسم أو الـ Username
//   const filteredUsers = searchTerm.trim()
//     ? users.filter(
//         (user) =>
//           user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           user.username?.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     : [];

//   return (
//     <div className="relative flex-1 max-w-2xl mx-2">
//       <div className="relative">
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setIsOpen(true);
//           }}
//           placeholder="Search people..."
//           className="w-full bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-gray-800 dark:text-gray-100 py-2 sm:py-2.5 pl-3 sm:pl-4 pr-8 sm:pr-10 rounded-xl border border-transparent dark:border-slate-700 focus:outline-none focus:border-[#149188] transition-colors"
//         />
//         <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//       </div>

//       {/* قائمة نتائج البحث عن الأشخاص */}
//       {isOpen && searchTerm.trim() !== "" && (
//         <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto p-2">
//           {filteredUsers.length > 0 ? (
//             filteredUsers.map((user) => (
//               <div
//                 key={user._id}
//                 onClick={() => {
//                   setIsOpen(false);
//                   setSearchTerm("");
//                   navigate(`/profile/${user._id}`); // التوجيه لبروفايل الشخص مباشرة
//                 }}
//                 className="flex items-center gap-3 p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition"
//               >
//                 <img
//                   src={user.photo || "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"}
//                   alt={user.name}
//                   className="w-8 h-8 rounded-full object-cover"
//                 />
//                 <div className="min-w-0 flex-1">
//                   <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
//                   <p className="text-[10px] text-gray-400 truncate">@{user.username || user.email?.split('@')[0]}</p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-xs text-gray-400 text-center py-3">No people found</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }