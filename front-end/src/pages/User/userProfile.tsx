import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, CalendarCheck2, Clock3, XCircle } from "lucide-react";
import { useGetUserDataQuery,useGetResendAppoinmentsQuery } from "@/features/users/userApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import EditUserModal from "@/components/common/EditUserModal";
import { useUpdateUserDataMutation } from "@/features/users/userApi";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
const UserProfile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: doctors, error, isLoading} = useGetResendAppoinmentsQuery();
  const {data:users,refetch} = useGetUserDataQuery(user?._id);
  const [updateUserData] = useUpdateUserDataMutation();

  useEffect(()=>{
    refetch();
  },[]);
  if (isLoading) {
    return <div className="text-center mt-6 text-gray-600">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-6 text-red-500">
        Error fetching appointments
      </div>
    );
  }

    const handleSave = async (upadateUser) => {
       
      const formData = new FormData();
      formData.append("name", upadateUser.name);

      formData.append("email", upadateUser.email);
      formData.append("phoen", upadateUser.phone);
      formData.append("gender", upadateUser.gender);
      formData.append("dob", upadateUser.DOB);
      formData.append("profileImage", upadateUser.profileImg);

      try {
        const res = await updateUserData({
          formData,
          userId: user?._id,
        }).unwrap();
         
        toast.success(res.msg);
       refetch()
      } catch (error: any) {
         

        if (error?.data?.msg) {
          toast.error(error.data.msg);
        } else {
          toast.error("OTP verification error");
        }
      }
    };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={users?.profile_img} />
            <AvatarFallback>{users?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{users?.name}</h2>
            <p className="text-gray-600">{users?.email}</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          <EditUserModal user={users} onSave={handleSave} />
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Appointments
            </CardTitle>
            <CalendarCheck2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doctors?.length}</div>
            <p className="text-xs text-gray-500">Up to this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock3 className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {doctors?.filter((d) => d.status === "Pending").length}
            </div>
            <p className="text-xs text-gray-500">Waiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {doctors?.filter((d) => d.status === "Cancelled").length}
            </div>
            <p className="text-xs text-gray-500">Past cancellations</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Appointments
        </h3>
        <div className="grid gap-4">
          {doctors?.map((apt) => (
            <Card key={apt?.id} className="p-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={apt?.avatar} />
                    <AvatarFallback>{apt?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-base font-medium text-gray-900">
                      {apt?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(apt.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      apt?.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : apt?.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {apt?.status}
                  </span>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <ToastContainer autoClose={200} />
    </div>
  );
};

export default UserProfile;
