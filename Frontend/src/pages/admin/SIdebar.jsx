import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { name: "Manage Dashboard", path: "/admin" },
    { name: "Manage Category", path: "category" },
    { name: "Manage Products", path: "product" },
    { name: "Manage Users", path: "user" },
    { name: "Manage Orders", path: "order" },
  ];

  return (
    <div className="w-full h-full bg-gray-100 p-4">
      <div className="flex flex-col gap-4">
        {menuItems.map((item) => (
          <Link to={item.path} key={item.name}>
            <Button className="w-full py-2 text-left bg-slate-700 hover:bg-slate-800 text-white">
              {item.name}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
