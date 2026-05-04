import AuthLayout from "../../components/layout/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => (
  <AuthLayout
    title="Welcome back"
    subtitle="Sign in to your HMS account"
  >
    <LoginForm />
  </AuthLayout>
);

export default LoginPage;