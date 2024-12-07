import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
  return (
    <div className="grid md:grid-cols-[20%,80%] grid-cols-1 w-full min-h-screen">
      {/* Sidebar Section */}
      <aside className="bg-gray-100 p-4 shadow-md">
        <Sidebar />
      </aside>

      {/* Main Content Section */}
      <main className="p-6">
        <Outlet />
           
      </main>
    
    </div>
  );
};

export default AdminLayout;
