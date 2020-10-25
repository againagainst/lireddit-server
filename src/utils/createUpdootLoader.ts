import DataLoader from "dataloader";
import { Updoot } from "../entities/Updoot";

export const createUpdootLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Updoot | null>(
    async keys => {
      const hash = (obj: { postId: number; userId: number }) => {
        return `${obj.postId}|${obj.userId}`;
      };

      const updoots = await Updoot.findByIds(keys as any[]);
      const keyToUpdoot: Record<string, Updoot> = {};
      updoots.forEach(updoot => {
        keyToUpdoot[hash(updoot)] = updoot;
      });

      return keys.map(key => keyToUpdoot[hash(key)]);
    }
  );
