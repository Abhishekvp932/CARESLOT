import SideBar from "./sideBar";
import Header from "@/layout/Header";


export const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <SideBar />

      <div className="flex flex-col flex-1 max-h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6 pt-[88px] space-y-6">
          {children}
        </main>
        <div className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-600 flex-shrink-0">
          © 2025 Medical Dashboard. All rights reserved.
        </div>
      </div>
    </div>
  );
};
