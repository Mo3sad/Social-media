import { NavLink, useNavigate } from "react-router-dom";
import { Home, User, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();


  const menuItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/setting", icon: Settings },
  ];

  function logOut() {
    localStorage.removeItem("userToken");
    navigate("/login");
  }

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col justify-between p-6 border-r shadow-sm hidden md:flex transition-colors duration-300 bg-white border-gray-100 dark:bg-slate-900 dark:border-slate-800">
      {/* Top Section */}
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-teal-500/20">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-wider text-gray-800 dark:text-white">
              SOCIAL
            </span>
            <span className="text-xs -mt-1 tracking-widest text-gray-400 dark:text-gray-500">
              media
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative
                  ${
                    isActive
                      ? "text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-teal-950/30"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800/60"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    {/* Active Indicator Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-teal-600 dark:bg-teal-400 rounded-r-full" />
                    )}

                    <Icon
                      className={`w-5 h-5 ${
                        isActive
                          ? "text-teal-600 dark:text-teal-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="pt-6 border-t border-gray-100 dark:border-slate-800">
        <button
          onClick={logOut}
          className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition cursor-pointer"
        >
          <LogOut className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-red-600" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}