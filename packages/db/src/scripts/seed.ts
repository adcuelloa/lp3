import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { argon2id, hash } from "argon2";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { breed, role, user } from "../schema/core/index";

const dir = dirname(fileURLToPath(import.meta.url));

try {
  process.loadEnvFile(resolve(dir, "../../../env/backend.env"));
} catch {
  // variables already present in environment
}

const {
  DB_USER = "project_dev",
  DB_PASS = "dev_password",
  DB_HOST = "localhost",
  DB_PORT = "5433",
  DB_NAME = "project_dev",
} = process.env;

const pool = new Pool({
  connectionString: `postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
});

const db = drizzle({ client: pool });

async function seed() {
  console.info("🌱 Seeding database...");

  await db
    .insert(role)
    .values([
      { name: "admin", description: "Full system administrator" },
      { name: "member", description: "Registered user who manages cats in the shelter" },
    ])
    .onConflictDoNothing();

  const [adminRole] = await db.select().from(role).where(eq(role.name, "admin"));
  if (!adminRole) throw new Error("Could not retrieve admin role");

  const [memberRole] = await db.select().from(role).where(eq(role.name, "member"));
  if (!memberRole) throw new Error("Could not retrieve member role");

  const adminHash = await hash("Admin1234!", {
    type: argon2id,
    timeCost: 3,
    memoryCost: 65536,
    parallelism: 1,
  });

  const memberHash = await hash("Member1234!", {
    type: argon2id,
    timeCost: 3,
    memoryCost: 65536,
    parallelism: 1,
  });

  await db
    .insert(user)
    .values([
      {
        name: "Administrator",
        email: "admin@lagateria.com",
        password: adminHash,
        roleId: adminRole.id,
      },
      {
        name: "Ana García",
        email: "ana@lagateria.com",
        password: memberHash,
        roleId: memberRole.id,
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(breed)
    .values([
      {
        name: "Domestic Shorthair",
        description: "Common mixed-breed shorthair",
        origin: "Worldwide",
      },
      {
        name: "Domestic Longhair",
        description: "Common mixed-breed longhair",
        origin: "Worldwide",
      },
      { name: "Siamese", description: "Elegant and vocal breed", origin: "Thailand" },
      { name: "Persian", description: "Long-haired, flat-faced breed", origin: "Iran" },
      {
        name: "Maine Coon",
        description: "Large, sociable breed with tufted ears",
        origin: "United States",
      },
      { name: "Bengal", description: "Wild-looking spotted coat", origin: "United States" },
      { name: "Ragdoll", description: "Gentle, floppy temperament", origin: "United States" },
      { name: "Scottish Fold", description: "Distinctive folded ears", origin: "Scotland" },
    ])
    .onConflictDoNothing();

  console.info("✅ Seed complete");
  console.info("   Admin  → admin@lagateria.com  / Admin1234!");
  console.info("   Member → ana@lagateria.com    / Member1234!");

  await pool.end();
}

void seed().catch((err: unknown) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});
