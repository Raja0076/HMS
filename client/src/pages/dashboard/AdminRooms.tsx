import { useQuery } from "@tanstack/react-query";
import { getAllRooms } from "../../services/room.service";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";

const AdminRooms = () => {
  const { data, isLoading, error } = useQuery({ queryKey: ["rooms", { limit: 100 }], queryFn: () => getAllRooms({ limit: 100 }) });
  const rooms = data?.data?.rooms || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Rooms</h1>
          <p className="text-gray-500 text-sm">Browse rooms across all buildings.</p>
        </div>
        <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          {rooms.length} room{rooms.length === 1 ? "" : "s"}
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-xl bg-white border border-gray-200 p-8">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <ErrorMessage message="Unable to load rooms. Please refresh." />
      ) : rooms.length === 0 ? (
        <div className="rounded-xl bg-white border border-dashed border-gray-200 p-8 text-center text-gray-500">
          No rooms found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Room</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Building</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Floor</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Occupancy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {rooms.map((room: any) => (
                <tr key={room._id}>
                  <td className="px-4 py-4 text-gray-900">{room.room_number}</td>
                  <td className="px-4 py-4 text-gray-600">{room.building_id?.building_name || "—"}</td>
                  <td className="px-4 py-4 text-gray-600">{room.floor_no ?? room.floor_id?.floor_no ?? "—"}</td>
                  <td className="px-4 py-4 text-gray-600 capitalize">{room.room_type}</td>
                  <td className="px-4 py-4 text-gray-600 capitalize">{room.status}</td>
                  <td className="px-4 py-4 text-right text-gray-900">
                    {room.current_occupancy}/{room.capacity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;
