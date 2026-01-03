import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import Error from "./error";
import useFetch from "@/hooks/use-fetch";
import { UrlState } from "@/context/index";
import { login as loginAPI } from "@/db/apiAuth";

const Login = () => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { fetchUser } = UrlState();
  const longLink = searchParams.get('createNew');
  const { loading, error, execute: performLogin, data } = useFetch(
    () => loginAPI(formData.email, formData.password),
    false
  );

  // Handle redirect after successful login
  useEffect(() => {
    if (error === null && data) {
      fetchUser();
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, data]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
      });

      await schema.validate(formData, { abortEarly: false });
      // Trigger API call
      await performLogin();
    } catch (e) {
      const newErrors = {};
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-display text-foreground">Welcome back</h2>
        <p className="text-muted-foreground font-medium">
          Sign in to your account to continue
        </p>
      </div>

      {error && (
        <div className="p-3 bg-destructive text-destructive-foreground border-3 border-foreground text-sm font-bold">
          <Error message={error} />
        </div>
      )}

      <div className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-foreground font-bold uppercase text-xs tracking-wide">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              className="pl-12"
            />
          </div>
          {errors.email && <Error message={errors.email} />}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-foreground font-bold uppercase text-xs tracking-wide">
              Password
            </label>
            <a
              href="#"
              className="text-sm text-foreground font-bold underline underline-offset-4"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              className="pl-12 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground hover:text-muted-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && <Error message={errors.password} />}
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-neo-yellow text-foreground border-3 border-foreground shadow-neo hover:shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px]"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
};

export default Login;