import { type DBSchema, openDB } from "idb";

import defaultKanjiFilterRules from "@/assets/rules/filter.json";
import { DB, type FilterRule } from "@/constants";

interface KanjiFilterDB extends DBSchema {
  [DB.onlyTable]: {
    key: string;
    value: FilterRule;
  };
}

export const getKanjiFilterDB = async () => {
  const db = await openDB<KanjiFilterDB>(DB.name, DB.version, {
    /**
     * @param transaction
     * Don't use `db.transaction(...)`, the upgrade callback will run a version change transaction,
     * and new transactions can't be created until this transaction ends.
     */
    upgrade(db, _, __, transaction) {
      db.createObjectStore(DB.onlyTable, { keyPath: "kanji" });
      const store = transaction.objectStore(DB.onlyTable);
      for (const rule of defaultKanjiFilterRules) {
        store.put(rule);
      }
    },
  });
  return db;
};
