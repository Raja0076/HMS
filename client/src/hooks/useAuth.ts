import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import { login, register, logout, getMe } from "../services/auth.service";
import { setToken } from "../utils/token";

const ROLE_REDIRECT = {
  admin:    "/admin/dashboard",
  staff:    "/staff/dashboard",
  resident: "/resident/dashboard",
};

const useAuth = () => {
  const navigate    = useNavigate();
  const setAuth     = useAuthStore((s) => s.setAuth);
  const logoutStore = useAuthStore((s) => s.logout);

  const handleLogin = async (data) => {
    const res = await login(data);
    setToken(res.data.token);
    setAuth(res.data.user);
    navigate(ROLE_REDIRECT[res.data.user.role]);
  };

  const handleRegister = async (data) => {
    const res = await register(data);
    setToken(res.data.token);
    setAuth(res.data.user);
    navigate(ROLE_REDIRECT[res.data.user.role]);
  };

  const handleLogout = async () => {
    await logout().catch(() => {});
    logoutStore();
    navigate("/login");
  };

  const loadUser = async () => {
    try {
      const res = await getMe();
      setAuth(res.data.user);
    } catch {
      logoutStore();
    }
  };

  return { handleLogin, handleRegister, handleLogout, loadUser };
};

export default useAuth;