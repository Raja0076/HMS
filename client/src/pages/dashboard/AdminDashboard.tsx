import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllBuildings } from "../../services/building.service";
import { getAllRooms } from "../../services/room.service";
import { getAllResidents } from "../../services/resident.service";
import { getAllUsers } from "../../services/user.service";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";

const AdminDashboard = () => {
  const { data: buildingsData, isLoading: loadingBuildings, error: buildingsError } = useQuery({ queryKey: ["buildings"], queryFn: getAllBuildings });
  const { data: roomsData, isLoading: loadingRooms, error: roomsError } = useQuery({ queryKey: ["rooms", { limit: 100 }], queryFn: () => getAllRooms({ limit: 100 }) });
  const { data: residentsData, isLoading: loadingResidents, error: residentsError } = useQuery({ queryKey: ["residents", { limit: 100 }], queryFn: () => getAllResidents({ limit: 100 }) });
  const { data: usersData, isLoading: loadingUsers, error: usersError } = useQuery({ queryKey: ["users", { limit: 100 }], queryFn: () => getAllUsers({ limit: 100 }) });

  const buildings = buildingsData?.data?.buildings || [];
  const totalBuildings = buildings.length;
  const totalFloors = buildings.reduce((sum: number, building: any) => sum + (building.total_floors || 0), 0);
  const totalRooms = roomsData?.data?.total ?? 0;
  const totalResidents = residentsData?.data?.total ?? 0;
  const totalUsers = usersData?.data?.total ?? 0;
  const loading = loadingBuildings || loadingRooms || loadingResidents || loadingUsers;
  const error = buildingsError || roomsError || residentsError || usersError;

  if (loading) {
    return (
      <div className="rounded-xl bg-white border border-gray-200 p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message="Unable to load admin overview. Please refresh." />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Quick overview of buildings, rooms, residents, and users.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/buildings" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Buildings
          </Link>
          <Link to="/admin/rooms" className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
            Rooms
          </Link>
          <Link to="/admin/residents" className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
            Residents
          </Link>
          <Link to="/admin/users" className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
            Users
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Buildings", value: totalBuildings },
          { label: "Floors", value: totalFloors },
          { label: "Rooms", value: totalRooms },
          { label: "Residents", value: totalResidents },
          { label: "Users", value: totalUsers },
        ].map((card) => (
          <div key={card.label} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
