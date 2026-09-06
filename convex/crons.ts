// Scheduled real-time sync of new cases / legislation / news into the legal-updates feed.
// Convex runs these on its own infrastructure — no external scheduler, no Docker.
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Pull configured feeds regularly. Tighten the interval for closer-to-real-time freshness.
crons.interval("sync legal updates", { hours: 6 }, internal.updates.syncFromFeeds, {});

export default crons;
