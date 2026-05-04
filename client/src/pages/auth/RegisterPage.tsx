import AuthLayout from "../../components/layout/AuthLayout";
import RegisterForm from "../../components/auth/RegisterForm";

const RegisterPage = () => (
  <AuthLayout
    title="Create account"
    subtitle="Register as a new resident"
  >
    <RegisterForm />
  </AuthLayout>
);

export default RegisterPage;