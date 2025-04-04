import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from '@hono/zod-openapi'
import { feedbackEndpoint } from "./feedbacks"
import { suggestionEndpoint } from "./suggestions"

export const app = new OpenAPIHono();

app.route('/feedbacks', feedbackEndpoint);
app.route('/suggestions', suggestionEndpoint);

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Dashboard API',
  },
});

app.get("/docs", swaggerUI({ url: "/doc" }));