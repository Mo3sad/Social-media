import { Search, ChevronDown, Sun, Moon, User, Home, LogOut, Settings } from "lucide-react";
import { useTheme } from "../../Context/ThemeContext";
import { useContext, useState, useRef, useEffect } from "react";
import { userDataContext } from "../../Context/userData.Context";
import { useNavigate, NavLink } from "react-router-dom";
import NotificationsPopover from "../../pages/Notifications/Notifications";

export default function Navbar() {
  const user = useContext(userDataContext);
  const userData = user?.userData;
  const setUserData = user?.setuserData;
  
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // حالات الدروب داون الموحدة
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    if (setUserData) {
      setUserData(null);
    }
    navigate("/login");
  };

  return (
    <>
      {/* 1. TOP HEADER (النافبار العلوي) */}
      <header className="w-full flex items-center justify-between gap-3 sm:gap-4 py-3 px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 transition-colors duration-300 sticky top-0 z-40">
        
        {/* اللوجو */}
        <div 
          onClick={() => navigate("/")} 
          className="flex md:hidden items-center gap-2 cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-[#149188] flex items-center justify-center text-white font-bold text-sm shadow-sm">
            S
          </div>
          <span className="font-extrabold text-gray-900 dark:text-white text-base tracking-wide hidden sm:inline-block">
            SOCIAL
          </span>
        </div>

        {/* خانة البحث */}
        <div className="flex-1 max-w-2xl relative mx-2">
          <input
            type="text"
            placeholder="Search in social..."
            className="w-full bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-gray-800 dark:text-gray-100 py-2 sm:py-2.5 pl-3 sm:pl-4 pr-8 sm:pr-10 rounded-xl border border-transparent dark:border-slate-700 focus:outline-none focus:border-[#149188] transition-colors"
          />
          <button className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#149188] transition">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* في الديسكتوب: بنعرض زرار الثيم وجرس الإشعارات فوق */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:text-[#149188] dark:hover:text-[#149188] transition-all cursor-pointer"
              title="Toggle Dark/Light Mode"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <NotificationsPopover />
          </div>

          {/* User Profile Dropdown (تشتغل في الموبايل والديسكتوب بصورة البروفايل بدل التلات شرط) */}
          <div className="relative" ref={dropdownRef}>
            <div 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 cursor-pointer p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition group"
            >
              <img
                src={userData?.photo || "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"}
                alt={userData?.name || "User"}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent dark:ring-slate-700"
              />
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </div>

            {/* القائمة المنسدلة (تحتوي على بيانات البروفايل، الثيم، الإعدادات، تسجيل الخروج) */}
            {isOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                
                {/* معلومات المستخدم */}
                <div 
                  onClick={() => { setIsOpen(false); navigate(`/profile/${userData?._id || ''}`); }}
                  className="px-4 py-3 border-b border-gray-100 dark:border-slate-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/60 transition"
                >
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{userData?.name || "User"}</p>
                  <p className="text-[11px] text-gray-400 truncate">@{userData?.username || userData?.email?.split('@')[0] || "profile"}</p>
                </div>

                <div className="py-1">
                  {/* زرار الثيم يظهر في القائمة للموبايل لتغييره بسهولة */}
                  <button
                    onClick={() => toggleTheme()}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer md:hidden"
                  >
                    <span className="flex items-center gap-3">
                      {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
                      <span>Appearance</span>
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase">{theme}</span>
                  </button>

                  <button
                    onClick={() => { setIsOpen(false); navigate(`/profile/${userData?._id || ''}`); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#149188]" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => { setIsOpen(false); navigate("/setting"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-[#149188]" />
                    <span>Settings</span>
                  </button>
                </div>

                <div className="border-t border-gray-100 dark:border-slate-800 my-1"></div>

                {/* تسجيل الخروج */}
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* 2. MOBILE BOTTOM NAVIGATION BAR (شريط التنقل السفلي للموبايل: Home + Notifications + Profile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 flex items-center justify-around px-3 z-40 shadow-2xl">
        
        {/* زر الهوم */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              isActive ? "text-[#149188] font-bold" : "text-gray-400 dark:text-gray-500 hover:text-gray-600"
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Home</span>
        </NavLink>

        {/* زر الإشعارات تحت في الموبايل */}
        <div className="flex flex-col items-center justify-center flex-1 py-1">
          <NotificationsPopover />
        </div>

        {/* زر البروفايل تحت بصورة صاحب الأكونت */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              isActive ? "text-[#149188] font-bold" : "text-gray-400 dark:text-gray-500 hover:text-gray-600"
            }`
          }
        >
          <img
            src={userData?.photo || "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"}
            alt={userData?.name || "Profile"}
            className="w-6 h-6 rounded-full object-cover ring-1 ring-current"
          />
          <span className="text-[10px] mt-1 font-medium">Profile</span>
        </NavLink>

      </nav>
    </>
  );
}