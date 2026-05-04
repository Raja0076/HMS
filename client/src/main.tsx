import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import AppRoute  from "./routes/AppRoute";
import useAuth    from "./hooks/useAuth";
import useAuthStore from "./stores/authStore";
import { getToken } from "./utils/token";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Loads user from token on first render
const AppInit = () => {
  const { loadUser }  = useAuth();
  const { setLoading } = useAuthStore();

  useEffect(() => {
    if (getToken()) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  return <AppRoute />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AppInit />
    </BrowserRouter>
  </QueryClientProvider>
);

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

export default App;