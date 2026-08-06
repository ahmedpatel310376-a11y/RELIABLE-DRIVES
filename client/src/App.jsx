import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import CarDetails from "./pages/CarDetails";
import Cars from "./pages/Cars";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { ADMIN_PATH } from "./config/site";

const Page = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
    transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/about" element={<Page><About /></Page>} />
          <Route path="/cars" element={<Page><Cars /></Page>} />
          <Route path="/cars/:id" element={<Page><CarDetails /></Page>} />
          <Route path={`${ADMIN_PATH}/login`} element={<Page><Login /></Page>} />
          <Route
            path={ADMIN_PATH}
            element={
              <ProtectedRoute>
                <Page><AdminDashboard /></Page>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
