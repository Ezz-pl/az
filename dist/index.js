var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  admins: () => admins,
  bookings: () => bookings,
  categories: () => categories,
  content: () => content,
  customers: () => customers,
  insertAdminSchema: () => insertAdminSchema,
  insertBookingSchema: () => insertBookingSchema,
  insertCustomerSchema: () => insertCustomerSchema,
  insertPartnerSchema: () => insertPartnerSchema,
  insertReviewSchema: () => insertReviewSchema,
  insertVehicleSchema: () => insertVehicleSchema,
  partners: () => partners,
  paymentMethods: () => paymentMethods,
  recommendations: () => recommendations,
  regions: () => regions,
  reviews: () => reviews,
  searchHistory: () => searchHistory,
  settings: () => settings,
  userInteractions: () => userInteractions,
  vehicles: () => vehicles
});
import { pgTable, text, serial, integer, boolean, decimal, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";
var admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("admin"),
  // admin, super_admin
  isActive: boolean("is_active").notNull().default(true),
  permissions: jsonb("permissions").default(sql`'{"manage_users": true, "manage_partners": true, "manage_content": true, "manage_bookings": true}'::jsonb`),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: varchar("phone", { length: 20 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  isVerified: boolean("is_verified").default(false),
  verificationCode: varchar("verification_code", { length: 6 }),
  resetPasswordCode: varchar("reset_password_code", { length: 6 }),
  isActive: boolean("is_active").default(true),
  address: text("address"),
  city: text("city"),
  region: text("region"),
  nationalId: varchar("national_id", { length: 20 }),
  dateOfBirth: timestamp("date_of_birth"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  contactName: text("contact_name"),
  phone: varchar("phone", { length: 20 }).notNull(),
  commercialLicense: varchar("commercial_license", { length: 50 }),
  taxNumber: varchar("tax_number", { length: 50 }),
  status: text("status").default("pending"),
  // pending, approved, rejected, suspended
  rejectionReason: text("rejection_reason"),
  approvedAt: timestamp("approved_at"),
  approvedBy: integer("approved_by").references(() => admins.id),
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var regions = pgTable("regions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  description: text("description"),
  descriptionAr: text("description_ar"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  description: text("description"),
  descriptionAr: text("description_ar"),
  icon: text("icon").notNull(),
  color: varchar("color", { length: 7 }).default("#3B82F6"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  partnerId: integer("partner_id").notNull().references(() => partners.id),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  regionId: integer("region_id").notNull().references(() => regions.id),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  description: text("description").notNull(),
  descriptionAr: text("description_ar").notNull(),
  pricePerDay: decimal("price_per_day", { precision: 10, scale: 2 }).notNull(),
  pricePerHour: decimal("price_per_hour", { precision: 10, scale: 2 }),
  images: jsonb("images").default(sql`'[]'::jsonb`),
  features: jsonb("features").default(sql`'[]'::jsonb`),
  featuresAr: jsonb("features_ar").default(sql`'[]'::jsonb`),
  capacity: integer("capacity").notNull(),
  minAge: integer("min_age").default(18),
  requiresLicense: boolean("requires_license").default(false),
  licenseType: text("license_type"),
  location: text("location").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  isActive: boolean("is_active").default(true),
  isApproved: boolean("is_approved").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalReviews: integer("total_reviews").default(0),
  viewCount: integer("view_count").default(0),
  bookingCount: integer("booking_count").default(0),
  approvedAt: timestamp("approved_at"),
  approvedBy: integer("approved_by").references(() => admins.id),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  bookingNumber: varchar("booking_number", { length: 20 }).notNull().unique(),
  customerId: integer("customer_id").notNull().references(() => customers.id),
  vehicleId: integer("vehicle_id").notNull().references(() => vehicles.id),
  partnerId: integer("partner_id").notNull().references(() => partners.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalDays: integer("total_days").notNull(),
  pricePerDay: decimal("price_per_day", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("pending"),
  // pending, confirmed, cancelled, completed
  paymentStatus: text("payment_status").default("pending"),
  // pending, paid, refunded
  paymentMethod: text("payment_method"),
  transactionId: text("transaction_id"),
  notes: text("notes"),
  customerNotes: text("customer_notes"),
  partnerNotes: text("partner_notes"),
  cancellationReason: text("cancellation_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  confirmedAt: timestamp("confirmed_at"),
  cancelledAt: timestamp("cancelled_at")
});
var reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => bookings.id),
  customerId: integer("customer_id").notNull().references(() => customers.id),
  vehicleId: integer("vehicle_id").notNull().references(() => vehicles.id),
  partnerId: integer("partner_id").notNull().references(() => partners.id),
  rating: integer("rating").notNull(),
  // 1-5
  comment: text("comment"),
  images: jsonb("images").default(sql`'[]'::jsonb`),
  isVisible: boolean("is_visible").default(true),
  partnerResponse: text("partner_response"),
  partnerResponseAt: timestamp("partner_response_at"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var content = pgTable("content", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  title: text("title"),
  titleAr: text("title_ar"),
  content: text("content"),
  contentAr: text("content_ar"),
  type: text("type").default("text"),
  // text, html, json
  isActive: boolean("is_active").default(true),
  updatedBy: integer("updated_by").references(() => admins.id),
  updatedAt: timestamp("updated_at").defaultNow()
});
var settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  type: text("type").default("text"),
  // text, number, boolean, json
  description: text("description"),
  updatedBy: integer("updated_by").references(() => admins.id),
  updatedAt: timestamp("updated_at").defaultNow()
});
var paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  type: text("type").notNull(),
  // credit_card, bank_transfer, cash, digital_wallet
  isActive: boolean("is_active").default(true),
  fees: decimal("fees", { precision: 5, scale: 2 }).default("0.00"),
  configuration: jsonb("configuration"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
  lastLogin: true
});
var insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  verificationCode: true,
  resetPasswordCode: true,
  isVerified: true,
  isActive: true
});
var insertPartnerSchema = createInsertSchema(partners).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  approvedAt: true,
  approvedBy: true
});
var insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
  createdAt: true,
  isApproved: true,
  rating: true,
  totalReviews: true,
  viewCount: true,
  bookingCount: true,
  approvedAt: true,
  approvedBy: true
});
var insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  bookingNumber: true,
  createdAt: true,
  confirmedAt: true,
  cancelledAt: true
});
var insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  partnerResponseAt: true
});
var searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  customerId: integer("customer_id").references(() => customers.id),
  searchQuery: text("search_query"),
  categoryId: integer("category_id").references(() => categories.id),
  regionId: integer("region_id").references(() => regions.id),
  priceRange: jsonb("price_range"),
  filters: jsonb("filters"),
  resultsCount: integer("results_count").default(0),
  clickedVehicleIds: jsonb("clicked_vehicle_ids").default(sql`'[]'::jsonb`),
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var userInteractions = pgTable("user_interactions", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  customerId: integer("customer_id").references(() => customers.id),
  vehicleId: integer("vehicle_id").notNull().references(() => vehicles.id),
  interactionType: varchar("interaction_type", { length: 50 }).notNull(),
  duration: integer("duration"),
  source: varchar("source", { length: 100 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  customerId: integer("customer_id").references(() => customers.id),
  vehicleId: integer("vehicle_id").notNull().references(() => vehicles.id),
  recommendationType: varchar("recommendation_type", { length: 50 }).notNull(),
  score: decimal("score", { precision: 5, scale: 4 }).notNull(),
  reason: text("reason"),
  shown: boolean("shown").default(false),
  clicked: boolean("clicked").default(false),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull()
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, and, or, ilike, sql as sql2, desc, asc, inArray } from "drizzle-orm";
import bcrypt from "bcrypt";
var DatabaseStorage = class {
  // Admin operations
  async createAdmin(adminData) {
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const [admin] = await db.insert(admins).values({
      ...adminData,
      password: hashedPassword
    }).returning();
    return admin;
  }
  async getAdminByUsername(username) {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin;
  }
  async verifyAdminPassword(username, password) {
    const admin = await this.getAdminByUsername(username);
    if (!admin || !admin.isActive) return void 0;
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) return void 0;
    await this.updateAdminLastLogin(admin.id);
    return admin;
  }
  async updateAdminLastLogin(id) {
    await db.update(admins).set({ lastLogin: /* @__PURE__ */ new Date() }).where(eq(admins.id, id));
  }
  async getAllAdmins() {
    return await db.select().from(admins).orderBy(desc(admins.createdAt));
  }
  async updateAdmin(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const [admin] = await db.update(admins).set(data).where(eq(admins.id, id)).returning();
    return admin;
  }
  async deleteAdmin(id) {
    await db.delete(admins).where(eq(admins.id, id));
  }
  // Customer operations
  async createCustomer(customerData) {
    const hashedPassword = await bcrypt.hash(customerData.password, 10);
    const [customer] = await db.insert(customers).values({
      ...customerData,
      password: hashedPassword
    }).returning();
    return customer;
  }
  async getCustomerByEmail(email) {
    const [customer] = await db.select().from(customers).where(eq(customers.email, email));
    return customer;
  }
  async getCustomerById(id) {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }
  async verifyCustomerPassword(email, password) {
    const customer = await this.getCustomerByEmail(email);
    if (!customer || !customer.isActive) return void 0;
    const isValid = await bcrypt.compare(password, customer.password);
    return isValid ? customer : void 0;
  }
  async updateCustomer(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const [customer] = await db.update(customers).set(data).where(eq(customers.id, id)).returning();
    return customer;
  }
  async getAllCustomers() {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }
  async deleteCustomer(id) {
    await db.delete(customers).where(eq(customers.id, id));
  }
  // Partner operations
  async createPartner(partnerData) {
    const hashedPassword = await bcrypt.hash(partnerData.password, 10);
    const [partner] = await db.insert(partners).values({
      ...partnerData,
      password: hashedPassword
    }).returning();
    return partner;
  }
  async getPartnerByEmail(email) {
    const [partner] = await db.select().from(partners).where(eq(partners.email, email));
    return partner;
  }
  async getPartnerById(id) {
    const [partner] = await db.select().from(partners).where(eq(partners.id, id));
    return partner;
  }
  async verifyPartnerPassword(email, password) {
    const partner = await this.getPartnerByEmail(email);
    if (!partner || !partner.isActive) return void 0;
    const isValid = await bcrypt.compare(password, partner.password);
    return isValid ? partner : void 0;
  }
  async updatePartner(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const [partner] = await db.update(partners).set(data).where(eq(partners.id, id)).returning();
    return partner;
  }
  async getAllPartners() {
    return await db.select().from(partners).orderBy(desc(partners.createdAt));
  }
  async getPartnersByStatus(status) {
    return await db.select().from(partners).where(eq(partners.status, status)).orderBy(desc(partners.createdAt));
  }
  async approvePartner(id, approvedBy) {
    const [partner] = await db.update(partners).set({
      status: "approved",
      isActive: true,
      approvedAt: /* @__PURE__ */ new Date(),
      approvedBy
    }).where(eq(partners.id, id)).returning();
    return partner;
  }
  async rejectPartner(id, reason) {
    const [partner] = await db.update(partners).set({
      status: "rejected",
      rejectionReason: reason
    }).where(eq(partners.id, id)).returning();
    return partner;
  }
  async deletePartner(id) {
    await db.delete(partners).where(eq(partners.id, id));
  }
  // Region operations
  async createRegion(regionData) {
    const [region] = await db.insert(regions).values(regionData).returning();
    return region;
  }
  async getAllRegions() {
    return await db.select().from(regions).orderBy(asc(regions.nameAr));
  }
  async getActiveRegions() {
    return await db.select().from(regions).where(eq(regions.isActive, true)).orderBy(asc(regions.nameAr));
  }
  async updateRegion(id, data) {
    const [region] = await db.update(regions).set(data).where(eq(regions.id, id)).returning();
    return region;
  }
  async deleteRegion(id) {
    await db.delete(regions).where(eq(regions.id, id));
  }
  // Category operations
  async createCategory(categoryData) {
    const [category] = await db.insert(categories).values(categoryData).returning();
    return category;
  }
  async getAllCategories() {
    return await db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.nameAr));
  }
  async getActiveCategories() {
    return await db.select().from(categories).where(eq(categories.isActive, true)).orderBy(categories.sortOrder);
  }
  async updateCategory(id, data) {
    const [category] = await db.update(categories).set(data).where(eq(categories.id, id)).returning();
    return category;
  }
  async deleteCategory(id) {
    await db.delete(categories).where(eq(categories.id, id));
  }
  // Vehicle operations
  async createVehicle(vehicleData) {
    const [vehicle] = await db.insert(vehicles).values(vehicleData).returning();
    return vehicle;
  }
  async getAllVehicles() {
    return [];
  }
  async getVehicleById(id) {
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return vehicle;
  }
  async getVehiclesByPartner(partnerId) {
    return await db.select().from(vehicles).where(eq(vehicles.partnerId, partnerId)).orderBy(desc(vehicles.createdAt));
  }
  async getVehiclesByCategory(categoryId) {
    return [];
  }
  async getVehiclesByRegion(regionId) {
    return [];
  }
  async searchVehicles(query, filters) {
    let conditions = [eq(vehicles.isActive, true), eq(vehicles.isApproved, true)];
    if (query) {
      conditions.push(
        or(
          ilike(vehicles.name, `%${query}%`),
          ilike(vehicles.nameAr, `%${query}%`),
          ilike(vehicles.description, `%${query}%`),
          ilike(vehicles.descriptionAr, `%${query}%`)
        )
      );
    }
    if (filters?.categoryId) {
      conditions.push(eq(vehicles.categoryId, filters.categoryId));
    }
    if (filters?.regionId) {
      conditions.push(eq(vehicles.regionId, filters.regionId));
    }
    return await db.select().from(vehicles).where(and(...conditions)).orderBy(desc(vehicles.rating), desc(vehicles.createdAt));
  }
  async updateVehicle(id, data) {
    const [vehicle] = await db.update(vehicles).set(data).where(eq(vehicles.id, id)).returning();
    return vehicle;
  }
  async approveVehicle(id, approvedBy) {
    const [vehicle] = await db.update(vehicles).set({
      isApproved: true,
      approvedAt: /* @__PURE__ */ new Date(),
      approvedBy
    }).where(eq(vehicles.id, id)).returning();
    return vehicle;
  }
  async deleteVehicle(id) {
    await db.delete(vehicles).where(eq(vehicles.id, id));
  }
  // Booking operations
  async createBooking(bookingData) {
    const bookingNumber = `BK${Date.now()}`;
    const [booking] = await db.insert(bookings).values({
      ...bookingData,
      bookingNumber
    }).returning();
    return booking;
  }
  async getAllBookings() {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }
  async getBookingById(id) {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }
  async getBookingsByCustomer(customerId) {
    return await db.select().from(bookings).where(eq(bookings.customerId, customerId)).orderBy(desc(bookings.createdAt));
  }
  async getBookingsByPartner(partnerId) {
    return await db.select().from(bookings).where(eq(bookings.partnerId, partnerId)).orderBy(desc(bookings.createdAt));
  }
  async updateBookingStatus(id, status) {
    const updateData = { status };
    if (status === "confirmed") {
      updateData.confirmedAt = /* @__PURE__ */ new Date();
    } else if (status === "cancelled") {
      updateData.cancelledAt = /* @__PURE__ */ new Date();
    }
    const [booking] = await db.update(bookings).set(updateData).where(eq(bookings.id, id)).returning();
    return booking;
  }
  async updateBooking(id, data) {
    const [booking] = await db.update(bookings).set(data).where(eq(bookings.id, id)).returning();
    return booking;
  }
  async deleteBooking(id) {
    await db.delete(bookings).where(eq(bookings.id, id));
  }
  // Review operations
  async createReview(reviewData) {
    const [review] = await db.insert(reviews).values(reviewData).returning();
    return review;
  }
  async getAllReviews() {
    return await db.select().from(reviews).orderBy(desc(reviews.createdAt));
  }
  async getReviewsByVehicle(vehicleId) {
    return await db.select().from(reviews).where(and(eq(reviews.vehicleId, vehicleId), eq(reviews.isVisible, true))).orderBy(desc(reviews.createdAt));
  }
  async getReviewsByPartner(partnerId) {
    return await db.select().from(reviews).where(and(eq(reviews.partnerId, partnerId), eq(reviews.isVisible, true))).orderBy(desc(reviews.createdAt));
  }
  async updateReview(id, data) {
    const [review] = await db.update(reviews).set(data).where(eq(reviews.id, id)).returning();
    return review;
  }
  async deleteReview(id) {
    await db.delete(reviews).where(eq(reviews.id, id));
  }
  // Content operations
  async getContentByKey(key) {
    const [contentItem] = await db.select().from(content).where(eq(content.key, key));
    return contentItem;
  }
  async updateContent(key, data, updatedBy) {
    const [existingContent] = await db.select().from(content).where(eq(content.key, key));
    if (existingContent) {
      const [updated] = await db.update(content).set({
        ...data,
        updatedBy,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(content.key, key)).returning();
      return updated;
    } else {
      const [created] = await db.insert(content).values({
        key,
        ...data,
        updatedBy
      }).returning();
      return created;
    }
  }
  async getAllContent() {
    return await db.select().from(content).orderBy(asc(content.key));
  }
  async createContent(contentData) {
    const [created] = await db.insert(content).values(contentData).returning();
    return created;
  }
  async deleteContent(key) {
    await db.delete(content).where(eq(content.key, key));
  }
  // Settings operations
  async getSettingByKey(key) {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting;
  }
  async updateSetting(key, value, updatedBy) {
    const [existingSetting] = await db.select().from(settings).where(eq(settings.key, key));
    if (existingSetting) {
      const [updated] = await db.update(settings).set({
        value,
        updatedBy,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(settings.key, key)).returning();
      return updated;
    } else {
      const [created] = await db.insert(settings).values({
        key,
        value,
        type: "text",
        updatedBy
      }).returning();
      return created;
    }
  }
  async getAllSettings() {
    return await db.select().from(settings).orderBy(asc(settings.key));
  }
  async createSetting(settingData) {
    const [created] = await db.insert(settings).values(settingData).returning();
    return created;
  }
  async deleteSetting(key) {
    await db.delete(settings).where(eq(settings.key, key));
  }
  // Payment method operations
  async getAllPaymentMethods() {
    return await db.select().from(paymentMethods);
  }
  async getActivePaymentMethods() {
    return await db.select().from(paymentMethods).where(eq(paymentMethods.isActive, true));
  }
  async updatePaymentMethod(id, data) {
    const [updated] = await db.update(paymentMethods).set(data).where(eq(paymentMethods.id, id)).returning();
    return updated;
  }
  // Dashboard stats
  async getDashboardStats() {
    const totalCustomers = await db.select({ count: sql2`count(*)` }).from(customers);
    const totalPartners = await db.select({ count: sql2`count(*)` }).from(partners);
    const totalVehicles = await db.select({ count: sql2`count(*)` }).from(vehicles);
    const totalBookings = await db.select({ count: sql2`count(*)` }).from(bookings);
    const pendingPartners = await db.select({ count: sql2`count(*)` }).from(partners).where(eq(partners.status, "pending"));
    const pendingBookings = await db.select({ count: sql2`count(*)` }).from(bookings).where(eq(bookings.status, "pending"));
    return {
      totalCustomers: totalCustomers[0].count,
      totalPartners: totalPartners[0].count,
      totalVehicles: totalVehicles[0].count,
      totalBookings: totalBookings[0].count,
      pendingPartners: pendingPartners[0].count,
      pendingBookings: pendingBookings[0].count
    };
  }
  // Get vehicles by IDs for recommendations
  async getVehiclesByIds(vehicleIds) {
    if (!vehicleIds.length) return [];
    return await db.select().from(vehicles).where(inArray(vehicles.id, vehicleIds));
  }
};
var storage = new DatabaseStorage();

// server/recommendation-engine.ts
import { eq as eq2, desc as desc2, sql as sql3, and as and2, or as or2, gte, ne, inArray as inArray2 } from "drizzle-orm";
var RecommendationEngine = class {
  /**
   * توليد التوصيات الذكية بناءً على سلوك المستخدم
   */
  async generateRecommendations(input) {
    const recommendations2 = [];
    const similarVehicles = await this.getSimilarVehicles(input);
    const trendingVehicles = await this.getTrendingVehicles(input);
    const personalizedRecs = await this.getPersonalizedRecommendations(input);
    const popularInCategory = await this.getPopularInCategory(input);
    recommendations2.push(...similarVehicles);
    recommendations2.push(...trendingVehicles);
    recommendations2.push(...personalizedRecs);
    recommendations2.push(...popularInCategory);
    const uniqueRecs = this.deduplicateAndRank(recommendations2);
    const limitedRecs = uniqueRecs.slice(0, input.limit || 10);
    await this.saveRecommendations(input, limitedRecs);
    return limitedRecs;
  }
  /**
   * مركبات مشابهة للمركبة الحالية
   */
  async getSimilarVehicles(input) {
    if (!input.currentVehicleId) return [];
    const currentVehicle = await db.select().from(vehicles).where(eq2(vehicles.id, input.currentVehicleId)).limit(1);
    if (!currentVehicle.length) return [];
    const vehicle = currentVehicle[0];
    const similarVehicles = await db.select().from(vehicles).where(
      and2(
        eq2(vehicles.categoryId, vehicle.categoryId),
        eq2(vehicles.regionId, vehicle.regionId),
        eq2(vehicles.isActive, true),
        eq2(vehicles.isApproved, true),
        ne(vehicles.id, vehicle.id)
      )
    ).orderBy(desc2(vehicles.rating)).limit(5);
    return similarVehicles.map((v, index) => ({
      vehicleId: v.id,
      score: 0.9 - index * 0.1,
      type: "similar",
      reason: "\u0645\u0631\u0643\u0628\u0629 \u0645\u0634\u0627\u0628\u0647\u0629 \u0641\u064A \u0646\u0641\u0633 \u0627\u0644\u062A\u0635\u0646\u064A\u0641 \u0648\u0627\u0644\u0645\u0646\u0637\u0642\u0629",
      metadata: {
        category: vehicle.categoryId,
        region: vehicle.regionId,
        basedOn: vehicle.id
      }
    }));
  }
  /**
   * المركبات الرائجة حالياً
   */
  async getTrendingVehicles(input) {
    const oneWeekAgo = /* @__PURE__ */ new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const trendingQuery = await db.select({
      vehicleId: userInteractions.vehicleId,
      interactionCount: sql3`count(*)`.mapWith(Number)
    }).from(userInteractions).where(
      and2(
        gte(userInteractions.createdAt, oneWeekAgo),
        eq2(userInteractions.interactionType, "view")
      )
    ).groupBy(userInteractions.vehicleId).orderBy(desc2(sql3`count(*)`)).limit(5);
    const vehicleIds = trendingQuery.map((t) => t.vehicleId);
    if (!vehicleIds.length) return [];
    const trendingVehicles = await db.select().from(vehicles).where(
      and2(
        inArray2(vehicles.id, vehicleIds),
        eq2(vehicles.isActive, true),
        eq2(vehicles.isApproved, true)
      )
    );
    return trendingVehicles.map((v, index) => ({
      vehicleId: v.id,
      score: 0.8 - index * 0.05,
      type: "trending",
      reason: "\u0631\u0627\u0626\u062C \u0647\u0630\u0627 \u0627\u0644\u0623\u0633\u0628\u0648\u0639",
      metadata: {
        views: trendingQuery.find((t) => t.vehicleId === v.id)?.interactionCount || 0
      }
    }));
  }
  /**
   * توصيات مخصصة بناءً على سجل البحث
   */
  async getPersonalizedRecommendations(input) {
    if (!input.customerId && !input.sessionId) return [];
    const recentSearches = await db.select().from(searchHistory).where(
      input.customerId ? eq2(searchHistory.customerId, input.customerId) : eq2(searchHistory.sessionId, input.sessionId)
    ).orderBy(desc2(searchHistory.createdAt)).limit(5);
    if (!recentSearches.length) return [];
    const preferredCategories = [...new Set(
      recentSearches.filter((s) => s.categoryId).map((s) => s.categoryId)
    )];
    const preferredRegions = [...new Set(
      recentSearches.filter((s) => s.regionId).map((s) => s.regionId)
    )];
    if (!preferredCategories.length && !preferredRegions.length) return [];
    const personalizedVehicles = await db.select().from(vehicles).where(
      and2(
        or2(
          preferredCategories.length ? inArray2(vehicles.categoryId, preferredCategories) : void 0,
          preferredRegions.length ? inArray2(vehicles.regionId, preferredRegions) : void 0
        ),
        eq2(vehicles.isActive, true),
        eq2(vehicles.isApproved, true)
      )
    ).orderBy(desc2(vehicles.rating), desc2(vehicles.totalReviews)).limit(6);
    return personalizedVehicles.map((v, index) => ({
      vehicleId: v.id,
      score: 0.85 - index * 0.08,
      type: "personalized",
      reason: "\u0645\u0646\u0627\u0633\u0628 \u0644\u0627\u0647\u062A\u0645\u0627\u0645\u0627\u062A\u0643 \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0639\u0645\u0644\u064A\u0627\u062A \u0627\u0644\u0628\u062D\u062B \u0627\u0644\u0633\u0627\u0628\u0642\u0629",
      metadata: {
        matchedCategories: preferredCategories.includes(v.categoryId),
        matchedRegions: preferredRegions.includes(v.regionId)
      }
    }));
  }
  /**
   * الأكثر شعبية في التصنيف
   */
  async getPopularInCategory(input) {
    const categoryId = input.categoryId;
    if (!categoryId) return [];
    const popularVehicles = await db.select().from(vehicles).where(
      and2(
        eq2(vehicles.categoryId, categoryId),
        eq2(vehicles.isActive, true),
        eq2(vehicles.isApproved, true)
      )
    ).orderBy(desc2(vehicles.bookingCount), desc2(vehicles.rating)).limit(4);
    return popularVehicles.map((v, index) => ({
      vehicleId: v.id,
      score: 0.75 - index * 0.1,
      type: "popular",
      reason: "\u0627\u0644\u0623\u0643\u062B\u0631 \u062D\u062C\u0632\u0627\u064B \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u062A\u0635\u0646\u064A\u0641",
      metadata: {
        bookingCount: v.bookingCount,
        rating: v.rating
      }
    }));
  }
  /**
   * إزالة المكررات والترتيب حسب النقاط
   */
  deduplicateAndRank(recommendations2) {
    const uniqueMap = /* @__PURE__ */ new Map();
    for (const rec of recommendations2) {
      const existing = uniqueMap.get(rec.vehicleId);
      if (!existing || rec.score > existing.score) {
        uniqueMap.set(rec.vehicleId, rec);
      }
    }
    return Array.from(uniqueMap.values()).sort((a, b) => b.score - a.score);
  }
  /**
   * حفظ التوصيات في قاعدة البيانات
   */
  async saveRecommendations(input, recs) {
    if (!recs.length) return;
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    const recommendationsToInsert = recs.map((rec) => ({
      sessionId: input.sessionId,
      customerId: input.customerId,
      vehicleId: rec.vehicleId,
      recommendationType: rec.type,
      score: rec.score.toString(),
      reason: rec.reason,
      metadata: rec.metadata,
      expiresAt
    }));
    await db.insert(recommendations).values(recommendationsToInsert);
  }
  /**
   * تسجيل تفاعل المستخدم
   */
  async trackUserInteraction(sessionId, customerId, vehicleId, interactionType, source = "unknown", duration, metadata) {
    await db.insert(userInteractions).values({
      sessionId,
      customerId,
      vehicleId,
      interactionType,
      duration,
      source,
      metadata
    });
  }
  /**
   * تسجيل عملية البحث
   */
  async trackSearch(sessionId, customerId, searchQuery, categoryId, regionId, priceRange, filters, resultsCount, clickedVehicleIds = [], userAgent, ipAddress) {
    await db.insert(searchHistory).values({
      sessionId,
      customerId,
      searchQuery,
      categoryId,
      regionId,
      priceRange,
      filters,
      resultsCount,
      clickedVehicleIds,
      userAgent,
      ipAddress
    });
  }
  /**
   * تحديث حالة التوصية عند العرض
   */
  async markRecommendationAsShown(recommendationId) {
    await db.update(recommendations).set({ shown: true }).where(eq2(recommendations.id, recommendationId));
  }
  /**
   * تحديث حالة التوصية عند النقر
   */
  async markRecommendationAsClicked(recommendationId) {
    await db.update(recommendations).set({ clicked: true }).where(eq2(recommendations.id, recommendationId));
  }
};
var recommendationEngine = new RecommendationEngine();

// server/routes.ts
import session from "express-session";
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
async function registerRoutes(app2) {
  app2.use(session({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1e3
      // 24 hours
    }
  }));
  const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Token required" });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
  app2.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      const admin = await storage.verifyAdminPassword(username, password);
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign(
        { id: admin.id, username: admin.username, role: "admin" },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
      res.json({
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions
        }
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  app2.get("/api/admin/dashboard", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });
  app2.get("/api/admin/admins", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const admins2 = await storage.getAllAdmins();
      const safeAdmins = admins2.map(({ password, ...admin }) => admin);
      res.json(safeAdmins);
    } catch (error) {
      console.error("Error fetching admins:", error);
      res.status(500).json({ message: "Failed to fetch admins" });
    }
  });
  app2.post("/api/admin/admins", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const admin = await storage.createAdmin({
        ...req.body,
        createdBy: req.user.username
      });
      const { password, ...safeAdmin } = admin;
      res.json(safeAdmin);
    } catch (error) {
      console.error("Error creating admin:", error);
      res.status(500).json({ message: "Failed to create admin" });
    }
  });
  app2.get("/api/admin/customers", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const customers2 = await storage.getAllCustomers();
      const safeCustomers = customers2.map(({ password, ...customer }) => customer);
      res.json(safeCustomers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });
  app2.post("/api/admin/customers", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const customer = await storage.createCustomer(req.body);
      const { password, ...safeCustomer } = customer;
      res.json(safeCustomer);
    } catch (error) {
      console.error("Error creating customer:", error);
      res.status(500).json({ message: "Failed to create customer" });
    }
  });
  app2.put("/api/admin/customers/:id", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const customer = await storage.updateCustomer(parseInt(req.params.id), req.body);
      const { password, ...safeCustomer } = customer;
      res.json(safeCustomer);
    } catch (error) {
      console.error("Error updating customer:", error);
      res.status(500).json({ message: "Failed to update customer" });
    }
  });
  app2.delete("/api/admin/customers/:id", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      await storage.deleteCustomer(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting customer:", error);
      res.status(500).json({ message: "Failed to delete customer" });
    }
  });
  app2.get("/api/admin/partners", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const status = req.query.status;
      const partners2 = status ? await storage.getPartnersByStatus(status) : await storage.getAllPartners();
      const safePartners = partners2.map(({ password, ...partner }) => partner);
      res.json(safePartners);
    } catch (error) {
      console.error("Error fetching partners:", error);
      res.status(500).json({ message: "Failed to fetch partners" });
    }
  });
  app2.post("/api/admin/partners", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const partner = await storage.createPartner(req.body);
      const { password, ...safePartner } = partner;
      res.json(safePartner);
    } catch (error) {
      console.error("Error creating partner:", error);
      res.status(500).json({ message: "Failed to create partner" });
    }
  });
  app2.put("/api/admin/partners/:id/approve", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const partner = await storage.approvePartner(parseInt(req.params.id), req.user.id);
      const temporaryPassword = Math.random().toString(36).slice(-10);
      await storage.updatePartner(partner.id, { password: temporaryPassword });
      const updatedPartner = await storage.getPartnerById(partner.id);
      res.json({
        partner: updatedPartner,
        message: "\u062A\u0645 \u0642\u0628\u0648\u0644 \u0627\u0644\u0634\u0631\u064A\u0643 \u0628\u0646\u062C\u0627\u062D \u0648\u0625\u0646\u0634\u0627\u0621 \u062D\u0633\u0627\u0628 \u0627\u0644\u062F\u062E\u0648\u0644",
        loginCredentials: {
          email: partner.email,
          password: temporaryPassword,
          message: "\u064A\u062C\u0628 \u0625\u0631\u0633\u0627\u0644 \u0647\u0630\u0647 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0644\u0644\u0634\u0631\u064A\u0643 \u0639\u0628\u0631 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A"
        }
      });
    } catch (error) {
      console.error("Error approving partner:", error);
      res.status(500).json({ message: "Failed to approve partner" });
    }
  });
  app2.put("/api/admin/partners/:id/reject", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { reason } = req.body;
      const partner = await storage.rejectPartner(parseInt(req.params.id), reason || "\u0644\u0645 \u064A\u062A\u0645 \u062A\u0642\u062F\u064A\u0645 \u0633\u0628\u0628");
      res.json({ partner, message: "\u062A\u0645 \u0631\u0641\u0636 \u0637\u0644\u0628 \u0627\u0644\u0634\u0631\u064A\u0643" });
    } catch (error) {
      console.error("Error rejecting partner:", error);
      res.status(500).json({ message: "Failed to reject partner" });
    }
  });
  app2.put("/api/admin/partners/:id/reject", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { reason } = req.body;
      const partner = await storage.rejectPartner(parseInt(req.params.id), reason || "No reason provided");
      const { password, ...safePartner } = partner;
      res.json(safePartner);
    } catch (error) {
      console.error("Error rejecting partner:", error);
      res.status(500).json({ message: "Failed to reject partner" });
    }
  });
  app2.get("/api/admin/regions", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const regions3 = await storage.getAllRegions();
      res.json(regions3);
    } catch (error) {
      console.error("Error fetching regions:", error);
      res.status(500).json({ message: "Failed to fetch regions" });
    }
  });
  app2.post("/api/admin/regions", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const region = await storage.createRegion(req.body);
      res.json(region);
    } catch (error) {
      console.error("Error creating region:", error);
      res.status(500).json({ message: "Failed to create region" });
    }
  });
  app2.put("/api/admin/regions/:id", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const region = await storage.updateRegion(parseInt(req.params.id), req.body);
      res.json(region);
    } catch (error) {
      console.error("Error updating region:", error);
      res.status(500).json({ message: "Failed to update region" });
    }
  });
  app2.get("/api/admin/categories", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const categories3 = await storage.getAllCategories();
      res.json(categories3);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  app2.post("/api/admin/categories", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const category = await storage.createCategory(req.body);
      res.json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });
  app2.get("/api/admin/content", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const content2 = await storage.getAllContent();
      res.json(content2);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });
  app2.put("/api/admin/content/:key", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const content2 = await storage.updateContent(req.params.key, req.body, req.user.id);
      res.json(content2);
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(500).json({ message: "Failed to update content" });
    }
  });
  app2.get("/api/admin/settings", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const settings2 = await storage.getAllSettings();
      res.json(settings2);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });
  app2.put("/api/admin/settings/:key", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { value } = req.body;
      const setting = await storage.updateSetting(req.params.key, value, req.user.id);
      res.json(setting);
    } catch (error) {
      console.error("Error updating setting:", error);
      res.status(500).json({ message: "Failed to update setting" });
    }
  });
  app2.get("/api/admin/vehicles", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const vehicles2 = await storage.getAllVehicles();
      res.json(vehicles2);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });
  app2.put("/api/admin/vehicles/:id/approve", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const vehicle = await storage.approveVehicle(parseInt(req.params.id), req.user.id);
      res.json(vehicle);
    } catch (error) {
      console.error("Error approving vehicle:", error);
      res.status(500).json({ message: "Failed to approve vehicle" });
    }
  });
  app2.get("/api/admin/bookings", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const bookings3 = await storage.getAllBookings();
      res.json(bookings3);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });
  app2.get("/api/categories", async (req, res) => {
    try {
      const categories3 = await storage.getActiveCategories();
      res.json(categories3);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  app2.get("/api/regions", async (req, res) => {
    try {
      const regions3 = await storage.getActiveRegions();
      res.json(regions3);
    } catch (error) {
      console.error("Error fetching regions:", error);
      res.status(500).json({ message: "Failed to fetch regions" });
    }
  });
  app2.get("/api/vehicles", async (req, res) => {
    try {
      const { search, category, region } = req.query;
      let vehicles2;
      if (search) {
        vehicles2 = await storage.searchVehicles(search, {
          categoryId: category ? parseInt(category) : void 0,
          regionId: region ? parseInt(region) : void 0
        });
      } else if (category) {
        vehicles2 = await storage.getVehiclesByCategory(parseInt(category));
      } else if (region) {
        vehicles2 = await storage.getVehiclesByRegion(parseInt(region));
      } else {
        vehicles2 = await storage.getAllVehicles();
        vehicles2 = vehicles2.filter((v) => v.isActive && v.isApproved);
      }
      res.json(vehicles2);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });
  app2.get("/api/vehicles/:id", async (req, res) => {
    try {
      const vehicle = await storage.getVehicleById(parseInt(req.params.id));
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      res.status(500).json({ message: "Failed to fetch vehicle" });
    }
  });
  app2.post("/api/customers/register", async (req, res) => {
    try {
      const customer = await storage.createCustomer(req.body);
      const { password, ...safeCustomer } = customer;
      const token = jwt.sign(
        { id: customer.id, email: customer.email, role: "customer" },
        JWT_SECRET,
        { expiresIn: "30d" }
      );
      res.json({ token, customer: safeCustomer });
    } catch (error) {
      console.error("Customer registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });
  app2.post("/api/customers/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const customer = await storage.verifyCustomerPassword(email, password);
      if (!customer) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign(
        { id: customer.id, email: customer.email, role: "customer" },
        JWT_SECRET,
        { expiresIn: "30d" }
      );
      const { password: _, ...safeCustomer } = customer;
      res.json({ token, customer: safeCustomer });
    } catch (error) {
      console.error("Customer login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  app2.post("/api/partners/register", async (req, res) => {
    try {
      const {
        contactName,
        businessName,
        businessNameAr,
        email,
        phone,
        businessType,
        businessDescription,
        experienceYears,
        regionId,
        address,
        serviceAreas,
        vehicleTypes,
        fleetSize,
        services,
        commercialRegister,
        taxNumber,
        licenseNumber
      } = req.body;
      const existingPartner = await storage.getPartnerByEmail(email);
      if (existingPartner) {
        return res.status(400).json({ message: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0645\u0633\u062C\u0644 \u0628\u0627\u0644\u0641\u0639\u0644" });
      }
      const partnerData = {
        contactName,
        businessName,
        businessNameAr,
        email,
        phone,
        businessType,
        businessDescription,
        experienceYears,
        regionId: parseInt(regionId),
        address,
        serviceAreas,
        fleetSize,
        services,
        commercialRegister,
        taxNumber: taxNumber || null,
        licenseNumber,
        status: "pending",
        isActive: false,
        isVerified: false,
        rating: 0,
        totalReviews: 0,
        // حفظ أنواع المركبات كـ JSON
        metadata: JSON.stringify({ vehicleTypes })
      };
      const partner = await storage.createPartner(partnerData);
      res.json({
        message: "\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628 \u0628\u0646\u062C\u0627\u062D! \u0633\u064A\u062A\u0645 \u0645\u0631\u0627\u062C\u0639\u062A\u0647 \u0645\u0646 \u0642\u0628\u0644 \u0627\u0644\u0625\u062F\u0627\u0631\u0629",
        partnerId: partner.id
      });
    } catch (error) {
      console.error("Error creating partner:", error);
      res.status(500).json({ message: "\u0641\u0634\u0644 \u0641\u064A \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628" });
    }
  });
  app2.post("/api/partners/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const partner = await storage.verifyPartnerPassword(email, password);
      if (!partner) {
        return res.status(401).json({ message: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0623\u0648 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u0629" });
      }
      if (partner.status !== "approved") {
        return res.status(401).json({ message: "\u062D\u0633\u0627\u0628\u0643 \u063A\u064A\u0631 \u0645\u0641\u0639\u0644 \u0628\u0639\u062F. \u064A\u0631\u062C\u0649 \u0627\u0646\u062A\u0638\u0627\u0631 \u0645\u0648\u0627\u0641\u0642\u0629 \u0627\u0644\u0625\u062F\u0627\u0631\u0629" });
      }
      const token = jwt.sign(
        { id: partner.id, email: partner.email, role: "partner" },
        JWT_SECRET,
        { expiresIn: "30d" }
      );
      const { password: _, ...safePartner } = partner;
      res.json({ token, partner: safePartner });
    } catch (error) {
      console.error("Partner login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  app2.get("/api/partners/stats", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "partner") {
        return res.status(403).json({ message: "Partner access required" });
      }
      const stats = {
        totalBookings: 0,
        pendingBookings: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        averageRating: 0,
        totalVehicles: 0,
        activeVehicles: 0
      };
      res.json(stats);
    } catch (error) {
      console.error("Error fetching partner stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });
  app2.get("/api/partners/bookings", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "partner") {
        return res.status(403).json({ message: "Partner access required" });
      }
      res.json([]);
    } catch (error) {
      console.error("Error fetching partner bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });
  app2.get("/api/partners/vehicles", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "partner") {
        return res.status(403).json({ message: "Partner access required" });
      }
      res.json([]);
    } catch (error) {
      console.error("Error fetching partner vehicles:", error);
      res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });
  app2.post("/api/bookings", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "customer") {
        return res.status(403).json({ message: "Customer access required" });
      }
      const booking = await storage.createBooking({
        ...req.body,
        customerId: req.user.id
      });
      res.json(booking);
    } catch (error) {
      console.error("Booking creation error:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });
  app2.get("/api/recommendations", async (req, res) => {
    try {
      const sessionId = req.sessionID;
      const customerId = req.user?.id;
      const { vehicleId, categoryId, regionId, limit = 10 } = req.query;
      const recommendations2 = await recommendationEngine.generateRecommendations({
        sessionId,
        customerId,
        currentVehicleId: vehicleId ? parseInt(vehicleId) : void 0,
        categoryId: categoryId ? parseInt(categoryId) : void 0,
        regionId: regionId ? parseInt(regionId) : void 0,
        limit: parseInt(limit)
      });
      const vehicleIds = recommendations2.map((r) => r.vehicleId);
      const vehicles2 = await storage.getVehiclesByIds(vehicleIds);
      const enrichedRecommendations = recommendations2.map((rec) => {
        const vehicle = vehicles2.find((v) => v.id === rec.vehicleId);
        return {
          ...rec,
          vehicle
        };
      }).filter((rec) => rec.vehicle);
      res.json(enrichedRecommendations);
    } catch (error) {
      console.error("Recommendations error:", error);
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });
  app2.post("/api/interactions/track", async (req, res) => {
    try {
      const sessionId = req.sessionID;
      const customerId = req.user?.id;
      const { vehicleId, interactionType, duration, source, metadata } = req.body;
      await recommendationEngine.trackUserInteraction(
        sessionId,
        customerId,
        vehicleId,
        interactionType,
        source || "web",
        duration,
        metadata
      );
      res.json({ success: true });
    } catch (error) {
      console.error("Track interaction error:", error);
      res.status(500).json({ message: "Failed to track interaction" });
    }
  });
  app2.post("/api/search/track", async (req, res) => {
    try {
      const sessionId = req.sessionID;
      const customerId = req.user?.id;
      const {
        searchQuery,
        categoryId,
        regionId,
        priceRange,
        filters,
        resultsCount,
        clickedVehicleIds
      } = req.body;
      await recommendationEngine.trackSearch(
        sessionId,
        customerId,
        searchQuery,
        categoryId,
        regionId,
        priceRange,
        filters,
        resultsCount,
        clickedVehicleIds || [],
        req.get("User-Agent"),
        req.ip
      );
      res.json({ success: true });
    } catch (error) {
      console.error("Track search error:", error);
      res.status(500).json({ message: "Failed to track search" });
    }
  });
  app2.post("/api/recommendations/:id/shown", async (req, res) => {
    try {
      const recommendationId = parseInt(req.params.id);
      await recommendationEngine.markRecommendationAsShown(recommendationId);
      res.json({ success: true });
    } catch (error) {
      console.error("Mark recommendation shown error:", error);
      res.status(500).json({ message: "Failed to mark recommendation as shown" });
    }
  });
  app2.post("/api/recommendations/:id/clicked", async (req, res) => {
    try {
      const recommendationId = parseInt(req.params.id);
      await recommendationEngine.markRecommendationAsClicked(recommendationId);
      res.json({ success: true });
    } catch (error) {
      console.error("Mark recommendation clicked error:", error);
      res.status(500).json({ message: "Failed to mark recommendation as clicked" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
