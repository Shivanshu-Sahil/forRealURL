import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { Mail, Lock } from "lucide-react";
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
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Sign In</CardTitle>
        <CardDescription className="text-gray-400">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="mx-0 p-3 rounded-md bg-red-500/10 border border-red-500/30">
            <Error message={error} />
          </div>
        )}

        {/* Email Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 focus:border-orange-500"
            />
          </div>
          {errors.email && <Error message={errors.email} />}
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 focus:border-orange-500"
            />
          </div>
          {errors.password && <Error message={errors.password} />}
        </div>
      </CardContent>

      <div className="px-6 py-4 border-t border-gray-700">
        <Button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-gray-950 font-medium"
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </div>
    </Card>
  );
};

export default Login;