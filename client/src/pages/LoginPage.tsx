import useLoginPage from "../hooks/useLoginPage";

const LoginPage = () => {
  const { title } = useLoginPage();
  return (
    <div>
      {title}
      LoginPage
    </div>
  );
};

export default LoginPage;
