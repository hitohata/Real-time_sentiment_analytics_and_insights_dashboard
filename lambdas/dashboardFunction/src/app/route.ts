import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from '@hono/zod-openapi'
import { feedbackEndpoint } from "./feedback"

export const app = new OpenAPIHono()

app.route('/feedback', feedbackEndpoint)

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Dashboard API',
  },
})

app.get("/docs", swaggerUI({ url: "/doc" }));