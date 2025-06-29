import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'

// Define base styles for input
const inputVariants = cva(
  cn(
    'border border-input bg-transparent rounded-md px-3 py-1 text-base w-full',
    'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ),
  {
    variants: {
      variant: {
        default: '',
        password: 'pr-10',
      },
      validation: {
        none: '',
        error:
          'border-destructive focus:border-destructive focus:ring-destructive',
        success: 'border-green-500',
      },
    },
    defaultVariants: {
      variant: 'default',
      validation: 'none',
    },
  },
)

interface InputProps
  extends React.ComponentProps<'input'>,
    VariantProps<typeof inputVariants> {
  errorMsg?: string
  setter?: Function
}

const Input = ({
  className,
  type,
  variant,
  validation,
  setter = () => {},
  errorMsg = '',
  ...props
}: InputProps) => {
  const [show, setShow] = React.useState(false)
  const isPassword = variant === 'password'
  const showError = !!errorMsg
  const inputType = isPassword ? (show ? 'text' : 'password') : type

  return (
    <>
      <div className="relative w-full">
        <input
          onChange={(e) => setter(e.target.value)}
          type={inputType}
          className={cn(
            inputVariants({
              variant,
              validation: showError ? 'error' : validation,
            }),
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((prev) => !prev)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute top-1/2 right-3 -translate-y-1/2 transform p-1">
            {show ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {showError && (
        <span className="text-destructive -mt-2 self-start pl-4 text-lg font-semibold">
          {errorMsg}
        </span>
      )}
    </>
  )
}

export { Input }
