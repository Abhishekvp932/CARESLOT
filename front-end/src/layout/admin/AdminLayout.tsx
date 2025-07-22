import { Sidebar } from "./sidebar";

export const AdminLayout  = ({children}:{children:React.ReactNode})=>{
    return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 min-h-screen max-h-screen overflow-y-auto p-4 bg-gray-100">
        {children}
      </main>
    </div>
  );
}