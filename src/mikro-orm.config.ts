import { Post } from "./entities/Post";
import { DEBUG } from "./constants";
import { MikroORM } from "@mikro-orm/core";
import path from "path";

export default {
    migrations: {
        path: path.join(__dirname, './migrations'), 
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post],
    dbName: 'lireddit',
    user: 'againagainst',
    password: '***REMOVED***',
    type: 'postgresql',
    debug: DEBUG
} as Parameters<typeof MikroORM.init>[0];