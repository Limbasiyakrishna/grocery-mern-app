import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const Auth = () => {
  const [state, setState] = useState("login"); // login, register, forgot, reset
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetUserId, setResetUserId] = useState("");
  const { setShowUserLogin, setUser, axios, navigate } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (state === "forgot") {
        const { data } = await axios.post("/api/user/forgot-password", { email });
        if (data.success) {
          toast.success(data.message);
          setResetUserId(data.userId); // For demo purposes, we skip email link
          setState("reset");
        } else {
          toast.error(data.message);
        }
      } else if (state === "reset") {
        const { data } = await axios.post("/api/user/reset-password", {
          userId: resetUserId,
          newPassword: password
        });
        if (data.success) {
          toast.success(data.message);
          setState("login");
          setPassword("");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`/api/user/${state}`, {
          name,
          email,
          password,
        });
        if (data.success) {
          toast.success(data.message);
          navigate("/");
          setUser(data.user);
          setShowUserLogin(false);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm text-gray-600 px-4"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-5 m-auto items-start p-8 py-10 w-full max-w-[380px] rounded-3xl shadow-2xl border border-white/20 bg-white/95 backdrop-blur-md animate-in zoom-in duration-300"
      >
        <div className="w-full text-center mb-2">
          <p className="text-3xl font-black tracking-tight">
            <span className="text-emerald-500 uppercase">Fresh</span>
            <span className="text-slate-800 uppercase">Nest</span>
          </p>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            {state === "login" && "Welcome back! Please login."}
            {state === "register" && "Join our fresh community."}
            {state === "forgot" && "Don't worry, we'll help you."}
            {state === "reset" && "Create a new strong password."}
          </p>
        </div>

        {state === "register" && (
          <div className="w-full">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="John Doe"
              className="border border-slate-200 rounded-xl w-full p-3 mt-1 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50/50"
              type="text"
              required
            />
          </div>
        )}

        {state !== "reset" && (
          <div className="w-full">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="name@example.com"
              className="border border-slate-200 rounded-xl w-full p-3 mt-1 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50/50"
              type="email"
              required
            />
          </div>
        )}

        {(state === "login" || state === "register" || state === "reset") && (
          <div className="w-full">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold text-slate-500 uppercase">
                {state === "reset" ? "New Password" : "Password"}
              </label>
              {state === "login" && (
                <span
                  onClick={() => setState("forgot")}
                  className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                >
                  Forgot?
                </span>
              )}
            </div>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="••••••••"
              className="border border-slate-200 rounded-xl w-full p-3 mt-1 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50/50"
              type="password"
              required
            />
          </div>
        )}

        <button className="bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all text-white w-full py-3.5 rounded-xl font-bold mt-2 shadow-lg shadow-emerald-600/20">
          {state === "register" ? "Create Account" : state === "forgot" ? "Send Reset Link" : state === "reset" ? "Update Password" : "Login to FreshNest"}
        </button>

        <div className="w-full text-center text-sm font-medium mt-2">
          {state === "register" ? (
            <p className="text-slate-500">
              Already have an account?{" "}
              <span
                onClick={() => setState("login")}
                className="text-emerald-600 font-bold cursor-pointer hover:underline underline-offset-4"
              >
                Login
              </span>
            </p>
          ) : (
            <p className="text-slate-500">
              {state === "forgot" || state === "reset" ? (
                <span
                  onClick={() => setState("login")}
                  className="text-emerald-600 font-bold cursor-pointer hover:underline underline-offset-4"
                >
                  Back to Login
                </span>
              ) : (
                <>
                  New to FreshNest?{" "}
                  <span
                    onClick={() => setState("register")}
                    className="text-emerald-600 font-bold cursor-pointer hover:underline underline-offset-4"
                  >
                    Create Account
                  </span>
                </>
              )}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Auth;
