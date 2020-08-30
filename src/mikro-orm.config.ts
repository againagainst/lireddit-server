import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { DEBUG } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post, User],
  dbName: "lireddit",
  user: "againagainst",
  password: "***REMOVED***",
  type: "postgresql",
  debug: DEBUG,
} as Parameters<typeof MikroORM.init>[0];
