import fs from "fs";
import os from "os";
import path from "path";
import type { BudgetItemRecord, TripRecord } from "@/server/db/trips";
import type { SessionRecord } from "@/server/db/sessions";
import type { UserRecord } from "@/server/db/users";
import type { ExchangeRateRecord } from "@/server/db/exchange-rates";
import type { NotificationRecord } from "@/server/db/notifications";
import type { VisaCheckRecord } from "@/server/db/visa-checks";
import type { BudgetCapRecord } from "@/server/db/budget-caps";
import type { TimelineItemRecord } from "@/server/db/timeline";
import type { TripCollaboratorRecord } from "@/server/db/collaborators";
import type { TripInvitationRecord } from "@/server/db/invitations";
import type { CommunityPostRecord } from "@/server/db/community-posts";
import type { CommunityCommentRecord } from "@/server/db/community-comments";
import type {
  CommunityLikeRecord,
  CommunitySaveRecord,
} from "@/server/db/community-reactions";

export type DatabaseSchema = {
  users: UserRecord[];
  sessions: SessionRecord[];
  trips: TripRecord[];
  budget_items: BudgetItemRecord[];
  budget_caps: BudgetCapRecord[];
  exchange_rates: ExchangeRateRecord[];
  notifications: NotificationRecord[];
  visa_checks: VisaCheckRecord[];
  timeline_items: TimelineItemRecord[];
  trip_collaborators: TripCollaboratorRecord[];
  trip_invitations: TripInvitationRecord[];
  community_posts: CommunityPostRecord[];
  community_comments: CommunityCommentRecord[];
  community_likes: CommunityLikeRecord[];
  community_saves: CommunitySaveRecord[];
};

const legacyDbDirectory = path.join(process.cwd(), "server", "data");
const legacyDbPath = path.join(legacyDbDirectory, "store.json");

function resolveDbDirectory() {
  const configured = process.env.SOLEILROUTE_DATA_DIR;
  if (configured) {
    return configured;
  }
  if (process.env.NODE_ENV !== "production") {
    const base =
      process.env.LOCALAPPDATA ??
      process.env.APPDATA ??
      path.join(os.homedir(), ".soleilroute");
    return path.join(base, "SoleilRoute");
  }
  if (process.env.VERCEL) {
    return path.join(os.tmpdir(), "SoleilRoute");
  }
  return legacyDbDirectory;
}

const dbDirectory = resolveDbDirectory();
const dbPath = path.join(dbDirectory, "store.json");

const defaultData: DatabaseSchema = {
  users: [],
  sessions: [],
  trips: [],
  budget_items: [],
  budget_caps: [],
  exchange_rates: [],
  notifications: [],
  visa_checks: [],
  timeline_items: [],
  trip_collaborators: [],
  trip_invitations: [],
  community_posts: [],
  community_comments: [],
  community_likes: [],
  community_saves: [],
};

function ensureDatabaseFile() {
  fs.mkdirSync(dbDirectory, { recursive: true });
  if (!fs.existsSync(dbPath) && fs.existsSync(legacyDbPath)) {
    fs.copyFileSync(legacyDbPath, dbPath);
  }
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2), "utf-8");
  }
}

export function readDatabase(): DatabaseSchema {
  ensureDatabaseFile();
  const file = fs.readFileSync(dbPath, "utf-8");
  try {
    const parsed = JSON.parse(file) as Partial<DatabaseSchema>;
    return {
      users: parsed.users ?? [],
      sessions: parsed.sessions ?? [],
      trips: parsed.trips ?? [],
      budget_items: parsed.budget_items ?? [],
      budget_caps: parsed.budget_caps ?? [],
      exchange_rates: parsed.exchange_rates ?? [],
      notifications: parsed.notifications ?? [],
      visa_checks: parsed.visa_checks ?? [],
      timeline_items: parsed.timeline_items ?? [],
      trip_collaborators: parsed.trip_collaborators ?? [],
      trip_invitations: parsed.trip_invitations ?? [],
      community_posts: parsed.community_posts ?? [],
      community_comments: parsed.community_comments ?? [],
      community_likes: parsed.community_likes ?? [],
      community_saves: parsed.community_saves ?? [],
    };
  } catch (error) {
    console.error("Failed to parse database file. Reinitialising.", error);
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2), "utf-8");
    return structuredClone(defaultData);
  }
}

export function writeDatabase(data: DatabaseSchema) {
  ensureDatabaseFile();
  if (process.env.NODE_ENV !== "production") {
    const stack = new Error().stack?.split("\n").slice(2, 6).join("\n");
    console.info("[SoleilRoute] database write", {
      path: dbPath,
      at: new Date().toISOString(),
    });
    if (stack) {
      console.info("[SoleilRoute] database write stack", stack);
    }
  }
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
}

export function updateDatabase<T>(mutator: (db: DatabaseSchema) => T): T {
  const db = readDatabase();
  const result = mutator(db);
  writeDatabase(db);
  return result;
}
