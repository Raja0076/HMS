const VARIANTS = {
  primary:   "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
  danger:    "bg-red-600 hover:bg-red-700 text-white",
  ghost:     "bg-transparent hover:bg-gray-100 text-gray-600",
};

const Button = ({
  children,
  variant = "primary",
  loading = false,
  className = "",
  ...props
}) => (
  <button
    disabled={loading || props.disabled}
    className={`
      px-4 py-2 rounded-lg text-sm font-medium transition-colors
      disabled:opacity-50 disabled:cursor-not-allowed
      ${VARIANTS[variant]} ${className}
    `}
    {...props}
  >
    {loading ? "Please wait..." : children}
  </button>
);

export default Button;