import useRegisterPage from '../hooks/useRegisterPage'

const RegisterPage = () => {
  const { title } = useRegisterPage()
  return (
    <div>
      {title}
      <input />
      <input />
      <input />
      <input />
    </div>
  )
}

export default RegisterPage
