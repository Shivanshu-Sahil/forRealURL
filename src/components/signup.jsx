import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import Error from "./error";
import useFetch from "@/hooks/use-fetch";
import { UrlState } from "@/context/index";
import { signup as signupAPI } from "@/db/apiAuth";

const Signup = () => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { fetchUser } = UrlState();
  const longLink = searchParams.get('createNew');
  const { loading, error, execute: performSignup, data } = useFetch(
    () => signupAPI(formData.email, formData.password, formData.name),
    false
  );

  // Handle redirect after successful signup
  useEffect(() => {
    if (error === null && data) {
      fetchUser();
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const schema = Yup.object().shape({
        name: Yup.string()
          .min(2, "Name must be at least 2 characters")
          .required("Name is required"),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password"), null], "Passwords must match")
          .required("Please confirm your password"),
      });

      await schema.validate(formData, { abortEarly: false });

      // Trigger API call
      await performSignup();
    } catch (e) {
      const newErrors = {};
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  // Password strength calculator
  const passwordStrength = () => {
    const pwd = formData.password;
    if (pwd.length === 0) return { width: "0%", color: "bg-muted", text: "" };
    if (pwd.length < 6) return { width: "25%", color: "bg-destructive", text: "Weak" };
    if (pwd.length < 10) return { width: "50%", color: "bg-neo-yellow", text: "Fair" };
    if (pwd.length < 14) return { width: "75%", color: "bg-neo-blue", text: "Good" };
    return { width: "100%", color: "bg-neo-green", text: "Strong" };
  };

  const strength = passwordStrength();

  return (
    <form onSubmit={handleSignup} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-display text-foreground">Create Account</h2>
        <p className="text-muted-foreground font-medium">
          Sign up to start using forReal.URL
        </p>
      </div>

      {error && (
        <div className="p-3 bg-destructive text-destructive-foreground border-3 border-foreground text-sm font-bold">
          <Error message={error} />
        </div>
      )}

      <div className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-foreground font-bold uppercase text-xs tracking-wide">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground" />
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
              className="pl-12"
            />
          </div>
          {errors.name && <Error message={errors.name} />}
        </div>

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
          <label htmlFor="password" className="text-foreground font-bold uppercase text-xs tracking-wide">
            Password
          </label>
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
          {/* Password strength indicator */}
          {formData.password && (
            <div className="space-y-1">
              <div className="h-2 bg-muted border-2 border-foreground overflow-hidden">
                <div
                  className={`h-full ${strength.color} transition-all duration-300`}
                  style={{ width: strength.width }}
                />
              </div>
              <p className="text-xs text-foreground font-bold">
                Password strength: <span>{strength.text}</span>
              </p>
            </div>
          )}
          {errors.password && <Error message={errors.password} />}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-foreground font-bold uppercase text-xs tracking-wide">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="pl-12 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground hover:text-muted-foreground transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && <Error message={errors.confirmPassword} />}
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-neo-pink text-foreground border-3 border-foreground shadow-neo hover:shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px]"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Create Account"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center font-medium">
        By signing up, you agree to our Terms of Service
      </p>
    </form>
  );
};

export default Signup;
