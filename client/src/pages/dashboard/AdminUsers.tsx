import { useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, getAllUsers, updateUser } from "../../services/user.service";
import { getAllBuildings } from "../../services/building.service";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import Button from "../../components/common/Button";

const initialCreateUser = {
  fullname: "",
  username: "",
  email: "",
  password: "",
  mobile: "",
  role: "staff",
  assigned_buildings: [] as string[],
};

const initialAssignForm = {
  userId: "",
  buildingIds: [] as string[],
};

const AdminUsers = () => {
  const [form, setForm] = useState(initialCreateUser);
  const [assignForm, setAssignForm] = useState(initialAssignForm);
  const [feedback, setFeedback] = useState("");
  const queryClient = useQueryClient();

  const { data: usersData, isLoading: loadingUsers, error: usersError } = useQuery({
    queryKey: ["users", { limit: 100 }],
    queryFn: () => getAllUsers({ limit: 100 }),
  });

  const { data: buildingsData, isLoading: loadingBuildings, error: buildingsError } = useQuery({
    queryKey: ["buildings"],
    queryFn: getAllBuildings,
  });

  const users = usersData?.data?.users || [];
  const buildings = buildingsData?.data?.buildings || [];

  const createUserMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => createUser(payload),
    onSuccess: () => {
      setForm(initialCreateUser);
      setFeedback("User created successfully.");
      queryClient.invalidateQueries(["users"]);
    },
    onError: () => {
      setFeedback("Failed to create user. Please check the information and try again.");
    },
  });

  const assignUserMutation = useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: Record<string, unknown> }) => updateUser(userId, payload),
    onSuccess: () => {
      setAssignForm(initialAssignForm);
      setFeedback("User assignment updated successfully.");
      queryClient.invalidateQueries(["users"]);
    },
    onError: () => {
      setFeedback("Failed to update user assignment. Please try again.");
    },
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBuildingSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(event.target.selectedOptions).map((option) => option.value);
    setForm((prev) => ({ ...prev, assigned_buildings: selected }));
  };

  const handleAssignUserChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value, selectedOptions } = event.target;
    if (name === "buildingIds") {
      setAssignForm((prev) => ({ ...prev, buildingIds: Array.from(selectedOptions).map((option) => option.value) }));
    } else {
      setAssignForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback("");
    createUserMutation.mutate({
      ...form,
      assigned_buildings: form.assigned_buildings,
    });
  };

  const handleAssignUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback("");
    if (!assignForm.userId) {
      setFeedback("Select a user before assigning buildings.");
      return;
    }
    assignUserMutation.mutate({
      userId: assignForm.userId,
      payload: { assigned_buildings: assignForm.buildingIds },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Users</h1>
          <p className="text-gray-500 text-sm">Create staff/admin users and assign buildings.</p>
        </div>
        <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          {users.length} user{users.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={handleCreateUser} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Create User</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-gray-700">
              Full name
              <input
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                required
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              Username
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                required
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                required
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              Password
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                required
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              Mobile
              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              Role
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-gray-700 sm:col-span-2">
              Assigned buildings
              <select
                name="assigned_buildings"
                multiple
                value={form.assigned_buildings}
                onChange={handleBuildingSelect}
                className="h-32 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                {buildings.map((building: any) => (
                  <option key={building._id} value={building._id}>
                    {building.building_name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {feedback && <p className="mt-4 text-sm text-red-600">{feedback}</p>}
          <div className="mt-6">
            <Button type="submit" loading={createUserMutation.isLoading}>
              Create user
            </Button>
          </div>
        </form>

        <form onSubmit={handleAssignUser} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Assign Buildings</h2>
          <div className="grid gap-4">
            <label className="space-y-2 text-sm text-gray-700">
              Select user
              <select
                name="userId"
                value={assignForm.userId}
                onChange={(event) => setAssignForm((prev) => ({ ...prev, userId: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                required
              >
                <option value="">Choose a user</option>
                {users.map((user: any) => (
                  <option key={user._id} value={user._id}>
                    {user.fullname} ({user.role})
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              Buildings to assign
              <select
                name="buildingIds"
                multiple
                value={assignForm.buildingIds}
                onChange={handleAssignUserChange}
                className="h-36 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                {buildings.map((building: any) => (
                  <option key={building._id} value={building._id}>
                    {building.building_name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-6">
            <Button type="submit" loading={assignUserMutation.isLoading}>
              Update assignment
            </Button>
          </div>
        </form>
      </div>

      {loadingUsers ? (
        <div className="rounded-xl bg-white border border-gray-200 p-8">
          <Spinner size="lg" />
        </div>
      ) : usersError ? (
        <ErrorMessage message="Unable to load users. Please refresh." />
      ) : users.length === 0 ? (
        <div className="rounded-xl bg-white border border-dashed border-gray-200 p-8 text-center text-gray-500">
          No users found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Full Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Role</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Assigned Buildings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((user: any) => (
                <tr key={user._id}>
                  <td className="px-4 py-4 text-gray-900">{user.fullname}</td>
                  <td className="px-4 py-4 text-gray-600">{user.email}</td>
                  <td className="px-4 py-4 text-gray-600 capitalize">{user.role}</td>
                  <td className="px-4 py-4 text-gray-600 capitalize">{user.status}</td>
                  <td className="px-4 py-4 text-gray-600 text-right">{user.assigned_buildings?.length ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
