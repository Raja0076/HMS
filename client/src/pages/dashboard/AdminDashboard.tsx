const AdminDashboard = () => (
  <div className="flex flex-col gap-6">
    <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
    <div className="grid grid-cols-4 gap-4">
      {[
        { label: "Buildings", value: "--" },
        { label: "Rooms",     value: "--" },
        { label: "Residents", value: "--" },
        { label: "Staff",     value: "--" },
      ].map(({ label, value }) => (
        <div key={label} className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
      ))}
    </div>
  </div>
);

export default AdminDashboard;