import useMainPage from '../hooks/useMainPage'

const HomePage = () => {
  const { title } = useMainPage()
  return (
    <div>
      {title}
      <br />
      <input />
      <br />
      <input />
      <input /> <br />
      <input /> <br />
    </div>
  )
}

export default HomePage
