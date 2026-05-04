import useUIStore from "../../stores/uiStore";
import useAuthStore from "../../stores/authStore";

const Navbar = ({ title }) => {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const user          = useAuthStore((s) => s.user);

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-800 transition-colors"
        >
          ☰
        </button>
        <span className="text-sm font-medium text-gray-700">{title}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">{user?.fullname}</span>
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-semibold">
          {user?.fullname?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Navbar;