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
import { relations } from "drizzle-orm";

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

export const boardsRelations = relations(boards, ({ many }) => ({
  lists: many(lists)
}));

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

export const listsRelations = relations(lists, ({ one, many }) => ({
  board: one(boards, {
    fields: [lists.boardId],
    references: [boards.id]
  }),
  cards: many(cards)
}));

export const listUpdateSchema = createUpdateSchema(lists);
export const listInsertSchema = createInsertSchema(lists);
export const listSelectSchema = createSelectSchema(lists);

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

export const cardUpdateSchema = createUpdateSchema(cards);
export const cardInsertSchema = createInsertSchema(cards);
export const cardSelectSchema = createSelectSchema(cards);

// Definición de las relaciones para cards
export const cardsRelations = relations(cards, ({ one }) => ({
  list: one(lists, {
    fields: [cards.listId],
    references: [lists.id]
  })
}));

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: varchar("org_id", { length: 255 }),
  action: action("action").notNull(),
  entityId: uuid("entity_id").notNull(),
  entityType: entityType("entity_type").notNull(),
  entityTitle: varchar("entity_title", { length: 255 }),
  userId: text("user_id").notNull(),
  userImage: text("user_image"),
  userName: text("user_name"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
});

export const orgLimit = pgTable("org_limit", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: varchar("org_id", { length: 255 }).notNull(),
  limit: integer("limit").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
});
