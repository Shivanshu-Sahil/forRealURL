import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { Mail, Lock, User } from "lucide-react";
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

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Create Account</CardTitle>
        <CardDescription className="text-gray-400">
          Sign up to start using forReal.URL
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="mx-0 p-3 rounded-md bg-red-500/10 border border-red-500/30">
            <Error message={error} />
          </div>
        )}

        {/* Name Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 focus:border-orange-500"
            />
          </div>
          {errors.name && <Error message={errors.name} />}
        </div>

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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleInputChange}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 focus:border-orange-500"
            />
          </div>
          {errors.password && <Error message={errors.password} />}
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 focus:border-orange-500"
            />
          </div>
          {errors.confirmPassword && <Error message={errors.confirmPassword} />}
        </div>
      </CardContent>

      <div className="px-6 py-4 border-t border-gray-700">
        <Button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-gray-950 font-medium"
        >
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </div>

      <div className="px-6 pb-4">
        <p className="text-xs text-gray-500 text-center">
          By signing up, you agree to our Terms of Service
        </p>
      </div>
    </Card>
  );
};

export default Signup;
