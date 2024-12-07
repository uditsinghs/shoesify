import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Layout from "./Layout";
import Hero from "./pages/user/Hero";
import Dashboard from "./pages/admin/Dashboard";
import ManageUser from "./pages/admin/ManageUser";
import ManageProduct from "./pages/admin/ManageProduct";
import ManageOrder from "./pages/admin/ManageOrder";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import UserOrders from "./pages/user/UserOrders";
import ManageAddress from "./pages/ManageAddress";
import ManageCategory from "./pages/admin/ManageCategory";
import UpdateProduct from "./pages/admin/SubComponents/UpdateProduct";
import AdminLayout from "./pages/admin/AdminLayout";
import ProductDetailPage from "./pages/user/ProductDetailPage";

const App = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: (
            <>
              <Hero />
            
            </>
          ),
        },
        { path: "cart", element: <Cart /> },
        { path: "profile", element: <Profile /> },
        { path: "profile/address", element: <ManageAddress /> },
        { path: "wishlist", element: <Wishlist /> },
        { path: "orders", element: <UserOrders /> },
        { path: "product/:pid", element: <ProductDetailPage /> },
        {
          path: "admin",
          element: <AdminLayout />,
          children: [
            { index: true, element: <Dashboard /> },
            { path: "user", element: <ManageUser /> },
            { path: "product", element: <ManageProduct /> },
            { path: "/admin/product/update/:pid", element: <UpdateProduct /> },
            { path: "order", element: <ManageOrder /> },
            { path: "category", element: <ManageCategory /> },
          ],
        },
      ],
    },
    { path: "/signup", element: <Signup /> },
    { path: "/login", element: <Login /> },
  ]);

  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  );
};

export default App;
