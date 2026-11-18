import { OpenAPIHono } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import { currentUser, currentUserRoute } from './auth/current-user'
import { login, loginRoute } from './auth/login'
import { register, registerRoute } from './auth/register'
import { checkOrigin } from './http/origin'
import { fail, validationFailed } from './http/response'

const app = new OpenAPIHono<{ Bindings: Env }>({
  // Any request that fails a route's zod schema gets 400 VALIDATION_FAILED
  defaultHook: (result, c) => {
    if (!result.success) return validationFailed(c, result.error)
  },
}).basePath('/api')

app.use(checkOrigin)

app.openapi(registerRoute, register)
app.openapi(loginRoute, login)
app.openapi(currentUserRoute, currentUser)

app.notFound((c) => fail(c, 404, 'NOT_FOUND', '找不到這個 API'))

app.onError((err, c) => {
  // Body that is not JSON, or sent without Content-Type: application/json
  if (
    err instanceof HTTPException &&
    (err.status === 400 || err.status === 415)
  ) {
    return fail(c, 400, 'VALIDATION_FAILED', '請求格式錯誤')
  }
  console.error(err)
  return fail(c, 500, 'INTERNAL_ERROR', '發生錯誤，請稍後再試')
})

export default app
