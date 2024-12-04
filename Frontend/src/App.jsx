import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Layout from "./Layout";
import Hero from "./pages/user/Hero";
import Products from "./pages/user/Products";
import Dashboard from "./pages/admin/Dashboard";
import ManageUser from "./pages/admin/ManageUser";
import ManageProduct from "./pages/admin/ManageProduct";
import ManageOrder from "./pages/admin/ManageOrder";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Wisehlist from "./pages/Wisehlist";
import UserOrders from "./pages/user/userOrders";
import ManageAddress from "./pages/ManageAddress";

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
              <Products />
            </>
          ),
        },
        {
          path: "cart",
          element: <Cart />,
        },
        {
          path: "profile/address",
          element: <ManageAddress />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "wishlist",
          element: <Wisehlist />,
        },
        {
          path: "orders",
          element: <UserOrders/>,
        },
        {
          path: "/admin",
          element: <Dashboard />,
          children: [
            {
              path: "user",
              element: <ManageUser />,
            },
            {
              path: "product",
              element: <ManageProduct />,
            },
            {
              path: "order",
              element: <ManageOrder />,
            },
          ],
        },
      ],
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  );
};

export default App;
