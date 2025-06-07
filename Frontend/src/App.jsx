import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Layout from "./Layout";
import Hero from "./pages/user/Hero";
import Dashboard from "./pages/admin/Dashboard";
import ManageUser from "./pages/admin/ManageUser";
import ManageProduct from "./pages/admin/ManageProduct";
import ManageOrder from "./pages/admin/ManageOrder";
import Cart from "./pages/user/Cart";
import Profile from "./pages/Profile";
import Wishlist from "./pages/user/Wishlist";
import UserOrders from "./pages/user/UserOrders";
import ManageAddress from "./pages/ManageAddress";
import ManageCategory from "./pages/admin/ManageCategory";
import UpdateProduct from "./pages/admin/SubComponents/UpdateProduct";
import AdminLayout from "./pages/admin/AdminLayout";
import ProductDetailPage from "./pages/user/ProductDetailPage";
import ProtectedRoute from "./ProtectedRoute";
import ResetPassword from "./pages/ResetPassword";
import { useEffect } from "react";
import { userApi } from "./features/api's/userApi";
import { Loader } from "lucide-react";
import Checkout from "./pages/user/Checkout";
import OrderSuccess from "./components/OrderSuccess";
import OrderDetails from "./pages/user/OrderDetails";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userApi.endpoints.loadUser.initiate({}, { forceRefetch: true }));
  }, [dispatch]);

  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.user
  );

  if (isLoading) {
    return (
      <div>
        <Loader className="w-20 h-20 animate-spin mr-4" />
      </div>
    );
  }

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Hero /> },
        {
          path: "cart",
          element: (
            <ProtectedRoute isAllowed={isAuthenticated}>
              <Cart />
            </ProtectedRoute>
          ),
        },
          {
          path: "checkout",
          element: (
            <ProtectedRoute isAllowed={isAuthenticated}>
              <Checkout/>
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute isAllowed={isAuthenticated} isLoading={isLoading}>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile/address",
          element: (
            <ProtectedRoute isAllowed={isAuthenticated}>
              <ManageAddress />
            </ProtectedRoute>
          ),
        },
        {
          path: "wishlist",
          element: (
            <ProtectedRoute isAllowed={isAuthenticated}>
              <Wishlist />
            </ProtectedRoute>
          ),
        },
        {
          path: "orders",
          element: (
            <ProtectedRoute isAllowed={isAuthenticated}>
              <UserOrders />
            </ProtectedRoute>
          ),
        },
          {
          path: "order/:id",
          element: (
            <ProtectedRoute isAllowed={isAuthenticated}>
              <OrderDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "product/:pid",
          element: <ProductDetailPage />,
        },
        {
          path: "admin",
          element: (
            <ProtectedRoute
              isAllowed={isAuthenticated && user?.role === "admin"}
            >
              <AdminLayout />
            </ProtectedRoute>
          ),
          children: [
            { index: true, element: <Dashboard /> },
            { path: "user", element: <ManageUser /> },
            { path: "product", element: <ManageProduct /> },
            { path: "product/update/:pid", element: <UpdateProduct /> },
            { path: "order", element: <ManageOrder /> },
            { path: "category", element: <ManageCategory /> },
          ],
        },
      ],
    },
    { path: "/signup", element: <Signup /> },
    {path:"/order-success",element:<OrderSuccess />},
    { path: "/reset", element: <ResetPassword /> },
    { path: "/login", element: <Login /> },
  ]);

  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  );
};

export default App;
