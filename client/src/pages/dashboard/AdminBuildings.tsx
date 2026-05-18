import { useState, type ChangeEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBuilding, getAllBuildings } from "../../services/building.service";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import Button from "../../components/common/Button";

const initialForm = {
  building_name: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  status: "active",
  amenities: "",
  total_floors: "",
  total_rooms: "",
  contact_number: "",
};

const AdminBuildings = () => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({ queryKey: ["buildings"], queryFn: getAllBuildings });
  const buildings = data?.data?.buildings || [];

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => createBuilding(payload),
    onSuccess: () => {
      setForm(initialForm);
      setFeedback("Building created successfully.");
      queryClient.invalidateQueries(["buildings"]);
    },
    onError: () => {
      setFeedback("Failed to create building. Please check the details and try again.");
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback("");

    const payload = {
      ...form,
      total_floors: Number(form.total_floors) || 0,
      total_rooms: Number(form.total_rooms) || 0,
      amenities: form.amenities
        .split(",")
        .map((amenity) => amenity.trim())
        .filter(Boolean),
    };

    createMutation.mutate(payload);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Buildings</h1>
          <p className="text-gray-500 text-sm">Manage all buildings in the system.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? "Hide create form" : "Add building"}
          </Button>
          <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            {buildings.length} building{buildings.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Create Building</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-gray-700">
              Building name
              <input
                name="building_name"
                value={form.building_name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                required
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              Address
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                required
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              City
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                required
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              State
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                required
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              Pincode
              <input
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              Contact number
              <input
                name="contact_number"
                value={form.contact_number}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              Status
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="active">Active</option>
                <option value="under_maintenance">Under maintenance</option>
                <option value="closed">Closed</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              Total floors
              <input
                name="total_floors"
                type="number"
                min="0"
                value={form.total_floors}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              Total rooms
              <input
                name="total_rooms"
                type="number"
                min="0"
                value={form.total_rooms}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700 md:col-span-2">
              Amenities (comma-separated)
              <textarea
                name="amenities"
                value={form.amenities}
                onChange={handleChange}
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>
          {feedback && <p className="mt-4 text-sm text-red-600">{feedback}</p>}
          <div className="mt-6 flex flex-wrap gap-2">
            <Button type="submit" loading={createMutation.isLoading}>
              Create building
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="rounded-xl bg-white border border-gray-200 p-8">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <ErrorMessage message="Unable to load buildings. Please refresh." />
      ) : buildings.length === 0 ? (
        <div className="rounded-xl bg-white border border-dashed border-gray-200 p-8 text-center text-gray-500">
          No buildings found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Building</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Location</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Floors</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Rooms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {buildings.map((building: any) => (
                <tr key={building._id}>
                  <td className="px-4 py-4 text-gray-900">{building.building_name}</td>
                  <td className="px-4 py-4 text-gray-600">
                    {building.city}, {building.state}
                  </td>
                  <td className="px-4 py-4 text-gray-600 capitalize">{building.status}</td>
                  <td className="px-4 py-4 text-right text-gray-900">{building.total_floors ?? 0}</td>
                  <td className="px-4 py-4 text-right text-gray-900">{building.total_rooms ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBuildings;
