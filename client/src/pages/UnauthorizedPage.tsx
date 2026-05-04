import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold text-gray-900">Access Denied</h1>
      <p className="text-gray-500 text-sm">You don't have permission to view this page.</p>
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 text-sm hover:underline"
      >
        Go back
      </button>
    </div>
  );
};

export default UnauthorizedPage;