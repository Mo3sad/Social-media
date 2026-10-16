import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar"; // السايدبار المخصص بتاعك
import Navbar from "../../components/Navbar/Navbar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import { ScrollToTop } from "../../components/ScrollToTop/ScrollToTop";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-slate-950 font-sans" dir="ltr">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        
        {/* Central Feed + Right Sidebar Wrapper */}
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto w-full">
            <ScrollToTop/>
            <Outlet />
          </main>

          {/* Right Sidebar (Who to Follow & Friends) */}
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}