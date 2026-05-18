import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllBuildings } from "../../services/building.service";
import { createFloor, getFloorsByBuilding } from "../../services/floor.service";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import Button from "../../components/common/Button";

const AdminFloors = () => {
  const [selectedBuildingId, setSelectedBuildingId] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [floorName, setFloorName] = useState("");
  const [feedback, setFeedback] = useState("");
  const queryClient = useQueryClient();

  const { data: buildingsData, isLoading: loadingBuildings, error: buildingsError } = useQuery({ queryKey: ["buildings"], queryFn: getAllBuildings });
  const buildings = buildingsData?.data?.buildings || [];

  useEffect(() => {
    if (!selectedBuildingId && buildings.length > 0) {
      setSelectedBuildingId(buildings[0]._id);
    }
  }, [buildings, selectedBuildingId]);

  const {
    data: floorsData,
    isLoading: loadingFloors,
    error: floorsError,
  } = useQuery({
    queryKey: ["floors", selectedBuildingId],
    queryFn: () => getFloorsByBuilding(selectedBuildingId),
    enabled: Boolean(selectedBuildingId),
  });

  const floors = floorsData?.data?.floors || [];
  const buildingName = floorsData?.data?.building_name || buildings.find((b: any) => b._id === selectedBuildingId)?.building_name;

  const createFloorMutation = useMutation({
    mutationFn: (payload: { floor_no: number; floor_name: string }) =>
      createFloor(selectedBuildingId, payload),
    onSuccess: () => {
      setFloorNumber("");
      setFloorName("");
      setFeedback("Floor created successfully.");
      queryClient.invalidateQueries(["floors", selectedBuildingId]);
      queryClient.invalidateQueries(["buildings"]);
    },
    onError: () => {
      setFeedback("Failed to create floor. Please try again.");
    },
  });

  const handleFloorSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback("");
    if (!selectedBuildingId || !floorNumber) {
      setFeedback("Please select a building and enter a floor number.");
      return;
    }

    createFloorMutation.mutate({
      floor_no: Number(floorNumber),
      floor_name: floorName,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Floors</h1>
          <p className="text-gray-500 text-sm">View floors by building.</p>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Select building</label>
          <select
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            value={selectedBuildingId}
            onChange={(event) => setSelectedBuildingId(event.target.value)}
          >
            {buildings.map((building: any) => (
              <option key={building._id} value={building._id}>
                {building.building_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={handleFloorSubmit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-1 text-sm text-gray-700">
            Floor number
            <input
              type="number"
              value={floorNumber}
              onChange={(event) => setFloorNumber(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              required
            />
          </label>
          <label className="space-y-1 text-sm text-gray-700">
            Floor name
            <input
              value={floorName}
              onChange={(event) => setFloorName(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <div className="flex items-end">
            <Button type="submit" loading={createFloorMutation.isLoading}>
              Add floor
            </Button>
          </div>
        </div>
        {feedback && <p className="mt-4 text-sm text-red-600">{feedback}</p>}
      </form>

      {loadingBuildings ? (
        <div className="rounded-xl bg-white border border-gray-200 p-8">
          <Spinner size="lg" />
        </div>
      ) : buildingsError ? (
        <ErrorMessage message="Unable to load buildings." />
      ) : !selectedBuildingId ? (
        <ErrorMessage message="No building selected." />
      ) : loadingFloors ? (
        <div className="rounded-xl bg-white border border-gray-200 p-8">
          <Spinner size="lg" />
        </div>
      ) : floorsError ? (
        <ErrorMessage message="Unable to load floors." />
      ) : floors.length === 0 ? (
        <div className="rounded-xl bg-white border border-dashed border-gray-200 p-8 text-center text-gray-500">
          No floors found for {buildingName}.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Floor</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Rooms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {floors.map((floor: any) => (
                <tr key={floor._id}>
                  <td className="px-4 py-4 text-gray-900">{floor.floor_no}</td>
                  <td className="px-4 py-4 text-gray-600">{floor.floor_name}</td>
                  <td className="px-4 py-4 text-gray-600 capitalize">{floor.status}</td>
                  <td className="px-4 py-4 text-right text-gray-900">{floor.total_rooms ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminFloors;
