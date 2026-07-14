import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.use("/previews", express.static(path.join(__dirname, "../public")));
app.get("/previews", (_req, res) => {
  res.send(`<!DOCTYPE html><html><head><title>Relay Previews</title><style>body{font-family:sans-serif;background:#0f0a1e;color:#fff;padding:2rem}a{display:block;color:#7C3AED;font-size:1.2rem;margin:1rem 0;text-decoration:none}a:hover{color:#a78bfa}</style></head><body><h1>🎨 Relay Landing Pages</h1><a href="/previews/nemotron.html" target="_blank">Nemotron Ultra Free — 72KB</a><a href="/previews/deepseek.html" target="_blank">DeepSeek V4 Flash Free — 60KB</a><a href="/previews/mimo.html" target="_blank">MiMo v2.5 Free — 68KB</a><a href="/previews/north.html" target="_blank">North Mini Code Free — 32KB</a></body></html>`);
});

export default app;
