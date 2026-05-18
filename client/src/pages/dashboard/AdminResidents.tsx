import { useQuery } from "@tanstack/react-query";
import { getAllResidents } from "../../services/resident.service";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";

const AdminResidents = () => {
  const { data, isLoading, error } = useQuery({ queryKey: ["residents", { limit: 100 }], queryFn: () => getAllResidents({ limit: 100 }) });
  const residents = data?.data?.residents || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Residents</h1>
          <p className="text-gray-500 text-sm">Current checked-in residents and room assignments.</p>
        </div>
        <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          {residents.length} resident{residents.length === 1 ? "" : "s"}
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-xl bg-white border border-gray-200 p-8">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <ErrorMessage message="Unable to load residents. Please refresh." />
      ) : residents.length === 0 ? (
        <div className="rounded-xl bg-white border border-dashed border-gray-200 p-8 text-center text-gray-500">
          No residents found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Room</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Building</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Checked In</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {residents.map((resident: any) => (
                <tr key={resident._id}>
                  <td className="px-4 py-4 text-gray-900">{resident.user_id?.fullname || "—"}</td>
                  <td className="px-4 py-4 text-gray-600">{resident.user_id?.email || "—"}</td>
                  <td className="px-4 py-4 text-gray-600 capitalize">{resident.resident_type}</td>
                  <td className="px-4 py-4 text-gray-600">{resident.room_id?.room_number || "—"}</td>
                  <td className="px-4 py-4 text-gray-600">{resident.building_id?.building_name || "—"}</td>
                  <td className="px-4 py-4 text-right text-gray-900">
                    {resident.check_in_date ? new Date(resident.check_in_date).toLocaleDateString() : "—"}
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

export default AdminResidents;
