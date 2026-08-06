import { useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";
import { ADMIN_PATH } from "../config/site";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to={ADMIN_PATH} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success("Welcome back");
      navigate(ADMIN_PATH);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="blue-grid grid min-h-[calc(100vh-4.5rem)] place-items-center bg-navy px-4 py-10">
      <motion.form
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl border border-white/60 bg-white p-7 shadow-2xl"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="mb-6 overflow-hidden rounded-xl bg-navy p-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
        >
          <BrandLogo variant="auth" />
        </motion.div>
        <motion.div
          className="pulse-soft mb-6 grid h-12 w-12 place-items-center rounded-xl bg-teal/10 text-teal"
          initial={{ rotate: -8, scale: 0.86 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
        >
          <Lock size={22} />
        </motion.div>
        <motion.h1 className="text-3xl font-black" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>Admin login</motion.h1>
        <motion.p className="mt-2 text-sm text-ink/60" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>Private inventory access for the site owner.</motion.p>
        <motion.div className="mt-6 space-y-3" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
            <input className="field" required placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
            <input className="field" required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </motion.div>
        </motion.div>
        <motion.button className="btn-primary motion-sheen mt-5 w-full" disabled={loading} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
          {loading ? "Signing in..." : "Sign in"}
        </motion.button>
      </motion.form>
    </section>
  );
}
