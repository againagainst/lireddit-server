import { ConnectionOptions } from "typeorm";
import { Post } from "./entities/Post";
import { Updoot } from "./entities/Updoot";
import { User } from "./entities/User";

export default {
  type: "postgres",
  database: "lireddit",
  username: "againagainst",
  password: "***REMOVED***",
  logging: true,
  synchronize: true,
  entities: [Post, User, Updoot],
} as ConnectionOptions;
