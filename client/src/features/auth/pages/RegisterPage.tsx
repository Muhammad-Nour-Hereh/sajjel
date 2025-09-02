import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input2'
import useRegisterPage from '@/features/auth/hooks/useRegisterPage'

const RegisterPage = () => {
  const {
    email,
    setEmail,
    name,
    setName,
    password,
    setPassword,
    repassword,
    setRepassword,
    errors,
    RegisterHandle,
    navigateLoginHandle,
  } = useRegisterPage()

  return (
    <div className="pg-background flex h-screen w-screen items-center justify-center">
      <div className="bg-border flex w-150 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-white p-9">
        <h1 className="mb-4 self-start text-3xl font-bold">Register</h1>
        <Input
          value={name}
          setter={setName}
          errorMsg={errors.name}
          placeholder="Name"
          className="h-13 border-2 text-2xl font-bold"
        />
        <Input
          value={email}
          setter={setEmail}
          errorMsg={errors.email}
          placeholder="Email"
          className="h-13 border-2 text-2xl font-bold"
        />
        <Input
          value={password}
          setter={setPassword}
          errorMsg={errors.password}
          placeholder="Password"
          variant="password"
          className="h-13 border-2 text-2xl font-bold"
        />
        <Input
          value={repassword}
          setter={setRepassword}
          errorMsg={errors.repassword}
          placeholder="Confirm the password"
          variant="password"
          className="h-13 border-2 text-2xl font-bold"
        />
        <Button
          onClick={RegisterHandle}
          className="my-4 w-full text-xl font-bold text-white">
          Register
        </Button>
        {errors.general != '' && (
          <span className="text-destructive -mt-2 self-start pl-4 text-lg font-semibold">
            {errors.general}
          </span>
        )}
        <span className="self-start text-lg font-semibold">
          already have an account!
          <span
            className="text-primary cursor-pointer font-semibold"
            onClick={navigateLoginHandle}>
            {' '}
            Login
          </span>
        </span>
      </div>
    </div>
  )
}

export default RegisterPage
