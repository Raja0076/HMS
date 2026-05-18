import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Button, Input, ErrorMessage } from "../common";

interface RegisterFormData {
  fullname: string;
  username: string;
  email: string;
  mobile: string;
  resident_type: "student" | "professional" | "other";
  password: string;
}

const RegisterForm = () => {
  const { handleRegister } = useAuth();
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError("");
      setLoading(true);
      await handleRegister(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <ErrorMessage message={error} />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Full Name"
          placeholder="John Doe"
          error={errors.fullname?.message}
          {...register("fullname", { required: "Full name is required" })}
        />
        <Input
          label="Username"
          placeholder="john_doe"
          error={errors.username?.message}
          {...register("username", { required: "Username is required" })}
        />
      </div>

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email", { required: "Email is required" })}
      />

      <Input
        label="Mobile"
        placeholder="9876543210"
        error={errors.mobile?.message}
        {...register("mobile", { required: "Mobile is required" })}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Resident Type</label>
        <select
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
          {...register("resident_type", { required: true })}
        >
          <option value="student">Student</option>
          <option value="professional">Professional</option>
          <option value="other">Other</option>
        </select>
      </div>

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password", {
          required: "Password is required",
          minLength: { value: 6, message: "Minimum 6 characters" },
        })}
      />

      <Button type="submit" loading={loading} className="w-full mt-2">
        Create Account
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Sign In
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;