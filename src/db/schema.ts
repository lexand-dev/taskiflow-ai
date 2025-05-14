import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  index,
  pgEnum,
  uuid
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema
} from "drizzle-zod";

// --- ENUMS ---
export const action = pgEnum("action", ["CREATE", "UPDATE", "DELETE"]);
export const entityType = pgEnum("entity_type", ["BOARD", "LIST", "CARD"]);

export const boards = pgTable("boards", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: varchar("org_id", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageId: varchar("image_id", { length: 255 }),
  imageThumbUrl: text("image_thumb_url"),
  imageFullUrl: text("image_full_url"),
  imageUserName: text("image_user_name"),
  imageLinkHTML: text("image_link_html"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
});

export const boardSelectSchema = createSelectSchema(boards);
export const boardInsertSchema = createInsertSchema(boards);
export const boardUpdateSchema = createUpdateSchema(boards);

export const lists = pgTable(
  "lists",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    order: integer("order").notNull(),
    boardId: uuid("board_id")
      .references(() => boards.id, { onDelete: "cascade" })
      .notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
  },
  (table) => [
    index("list_board_id_idx").on(table.boardId),
    index("list_order_idx").on(table.boardId, table.order)
  ]
);

export const cards = pgTable(
  "cards",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    order: integer("order").notNull(),
    description: text("description"),
    listId: uuid("list_id")
      .references(() => lists.id, { onDelete: "cascade" })
      .notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
  },
  (table) => [
    index("card_list_id_idx").on(table.listId),
    index("card_order_idx").on(table.listId, table.order)
  ]
);

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: varchar("org_id", { length: 255 }),
  action: action("action").notNull(),
  entityId: uuid("entity_id").notNull(),
  entityType: entityType("entity_type").notNull(),
  entityTitle: varchar("entity_title", { length: 255 }),
  userId: uuid("user_id").notNull(),
  userImage: text("user_image"),
  userName: text("user_name"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
});
