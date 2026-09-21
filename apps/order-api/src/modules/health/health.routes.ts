import { Router } from "express";

import { getHealth } from "./health.controller.js";

const healthRouter = Router();

// health probe.
// Used by Kubernetes to determine whether the process is alive.
healthRouter.get("/health", getHealth);

export { healthRouter };
