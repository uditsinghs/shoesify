
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 flex flex-col gap-10">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">My Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Profile Information */}
          <div>
            <h2 className="text-3xl font-bold uppercase">
              {user?.username || "John doe"}
            </h2>
            <p className="text-sm text-gray-500 mt-3">
              {user?.email || "johndoe@example.com"}
            </p>
          </div>
          <div className="flex flex-col items-center gap-5">
            {/* View Orders Button */}
            <Button variant="outline">
              <Link to="/orders">My Orders</Link>
            </Button>
            <Button >
              <Link to="/profile/address">Manage Address</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* address */}
      {user?.address ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">My Address</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            {/* Address Information */}
            <div className="grid md:grid-cols-3">
              <p className="text-sm font-bold">
                City: {user?.address?.city || "John doe"}
              </p>
              <p className="text-sm font-bold">
                Street: {user?.address?.street || "johndoe@example.com"}
              </p>
              <p className="text-sm font-bold ">
                State: {user?.address?.state || "johndoe@example.com"}
              </p>
              <p className="text-sm font-bold ">
                Zip-code : {user?.address?.zip || "johndoe@example.com"}
              </p>
              <p className="text-sm font-bold ">
                Country: {user?.address?.country || "johndoe@example.com"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <h1 className="text-center font-bold text-xl text-gray-300">
          Add Address
        </h1>
      )}
    </div>
  );
};

export default Profile;
