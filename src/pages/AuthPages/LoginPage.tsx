import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { ApiError, request } from '@/api/client'
import type { User } from '@/api/types'
import { WarningIcon } from '@/components/icons/WarningIcon'
import { loginFields, type LoginFormValues } from './fields'
import { FormField } from './FormField'

export function LoginPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ defaultValues: { email: '', password: '' } })

  const login = useMutation({
    mutationFn: (body: LoginFormValues) =>
      request<User>('/api/auth/login', { method: 'POST', body }),
    onSuccess: (user) => {
      queryClient.setQueryData(['session'], user)
      navigate(user.role === 'owner' ? '/owner' : '/tester')
    },
  })

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => login.mutate(values))}
      className="bg-surface border-ink tablet:gap-7 tablet:p-12 mx-auto flex max-w-130 flex-col gap-6 rounded-md border px-5 py-6"
    >
      <h1 className="text-subtitle">登入</h1>
      {loginFields.map((field) => (
        <FormField
          key={field.name}
          {...field}
          register={register}
          errors={errors}
        />
      ))}
      {login.error && (
        <span className="text-status-dispute-text inline-flex items-center gap-1.5">
          <WarningIcon />
          {login.error instanceof ApiError
            ? login.error.message
            : '無法連線，請稍後再試'}
        </span>
      )}
      <button
        type="submit"
        disabled={login.isPending}
        className="btn btn-primary btn-ink w-full"
      >
        登入
      </button>
      <div className="flex flex-col gap-1">
        <p className="text-ink-muted text-center">
          還沒有帳號？
          <Link to="/signup" className="link text-role font-bold">
            註冊
          </Link>
        </p>
      </div>
    </form>
  )
}
