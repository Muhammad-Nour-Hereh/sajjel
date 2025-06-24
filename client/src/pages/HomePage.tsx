import useMainPage from "../hooks/useMainPage";

const HomePage = () => {
  const { title } = useMainPage();
  return <div>{title}</div>;
};

export default HomePage;
