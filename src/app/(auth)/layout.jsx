import LoginProvider from "./providers/LoginProvider";

const Login = ({ children }) => {
  return <LoginProvider>{children}</LoginProvider>;
};

export default Login;
