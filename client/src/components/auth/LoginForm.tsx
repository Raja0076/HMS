import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Button, Input, ErrorMessage } from "../common";

const LoginForm = () => {
  const { handleLogin } = useAuth();
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setError("");
      setLoading(true);
      await handleLogin(data);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <ErrorMessage message={error} />

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email", { required: "Email is required" })}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password", { required: "Password is required" })}
      />

      <Button type="submit" loading={loading} className="w-full mt-2">
        Sign In
      </Button>

      <p className="text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 hover:underline font-medium">
          Register
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;