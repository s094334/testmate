import { OpenAPIHono } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import {
  createApplication,
  createApplicationRoute,
} from './applications/create'
import { getCompany, getCompanyRoute } from './auth/get-company'
import { getProfile, getProfileRoute } from './auth/get-profile'
import { getSession, getSessionRoute } from './auth/get-session'
import { listOwnProjects, listOwnProjectsRoute } from './auth/list-own-projects'
import { login, loginRoute } from './auth/login'
import { logout, logoutRoute } from './auth/logout'
import { register, registerRoute } from './auth/register'
import { saveCompany, saveCompanyRoute } from './auth/save-company'
import { saveProfile, saveProfileRoute } from './auth/save-profile'
import { checkOrigin } from './http/origin'
import { fail, validationFailed } from './http/response'
import { createProject, createProjectRoute } from './projects/create'
import { getProject, getProjectRoute } from './projects/get'
import { listProjects, listProjectsRoute } from './projects/list'
import { listTags, listTagsRoute } from './tags/list'

const app = new OpenAPIHono<{ Bindings: Env }>({
  // Any request that fails a route's zod schema gets 400 VALIDATION_FAILED
  defaultHook: (result, c) => {
    if (!result.success) return validationFailed(c, result.error)
  },
}).basePath('/api')

app.use(checkOrigin)

app.openapi(registerRoute, register)
app.openapi(loginRoute, login)
app.openapi(logoutRoute, logout)
app.openapi(getSessionRoute, getSession)
app.openapi(getProfileRoute, getProfile)
app.openapi(saveProfileRoute, saveProfile)
app.openapi(getCompanyRoute, getCompany)
app.openapi(saveCompanyRoute, saveCompany)
app.openapi(listOwnProjectsRoute, listOwnProjects)
app.openapi(createProjectRoute, createProject)
app.openapi(listProjectsRoute, listProjects)
app.openapi(getProjectRoute, getProject)
app.openapi(createApplicationRoute, createApplication)
app.openapi(listTagsRoute, listTags)

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
