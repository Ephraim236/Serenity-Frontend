import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PreloadScreen } from "./components/PreloadScreen";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PreloadScreen>
          <RouterProvider router={router} />
          <Toaster position="top-center" />
        </PreloadScreen>
      </AuthProvider>
    </ThemeProvider>
  );
}
