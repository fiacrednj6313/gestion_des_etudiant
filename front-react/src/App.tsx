import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RoutLayout from "./common/layouts/RoutLayout";
import DashbordPage from "./common/pages/DashbordPage";
import ClassePage from "./common/pages/ClassePage";
import EtudiantPage from "./common/pages/EtudiantPage";
import LoginPage from "./common/pages/LoginPage";
import { RequireAuth } from "./features/auth/utils/RequireAuth";
import { AuthProvider } from "./features/auth/context/AuthContext";
import Register from "./features/auth/components/Register";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <RoutLayout />,
        children: [
          {
            index: true,
            element: <DashbordPage />,
          },
          {
            path: "/classes",
            element: <ClassePage />,
          },
          {
            path: "etudiants",
            element: <EtudiantPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <div>Page non trouvée</div>,
  },
]);

function App() {
  return (
    <>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
}

export default App;
