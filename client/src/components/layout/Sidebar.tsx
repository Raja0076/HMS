import { NavLink } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import useUIStore from "../../stores/uiStore";
import useAuth from "../../hooks/useAuth";

const ADMIN_LINKS = [
  { to: "/admin/dashboard",  label: "Dashboard"  },
  { to: "/admin/buildings",  label: "Buildings"  },
  { to: "/admin/floors",     label: "Floors"     },
  { to: "/admin/rooms",      label: "Rooms"      },
  { to: "/admin/residents",  label: "Residents"  },
  { to: "/admin/users",      label: "Users"      },
];

const STAFF_LINKS = [
  { to: "/staff/dashboard",  label: "Dashboard"  },
  { to: "/staff/buildings",  label: "Buildings"  },
  { to: "/staff/rooms",      label: "Rooms"      },
  { to: "/staff/residents",  label: "Residents"  },
];

const RESIDENT_LINKS = [
  { to: "/resident/dashboard", label: "Dashboard" },
  { to: "/resident/room",      label: "My Room"   },
  { to: "/resident/profile",   label: "Profile"   },
];

const ROLE_LINKS = {
  admin:    ADMIN_LINKS,
  staff:    STAFF_LINKS,
  resident: RESIDENT_LINKS,
};

const Sidebar = () => {
  const user        = useAuthStore((s) => s.user);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const { handleLogout } = useAuth();

  const links = ROLE_LINKS[user?.role] || [];

  if (!sidebarOpen) return null;

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-100 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">HMS</h2>
        <p className="text-xs text-gray-400 capitalize">{user?.role} panel</p>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-gray-800">{user?.fullname}</p>
          <p className="text-xs text-gray-400">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;