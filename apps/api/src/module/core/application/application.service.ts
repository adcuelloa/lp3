import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";

import { application, cat } from "@project/db";

import { db } from "@/lib/drizzle";

import type { CreateApplicationDto } from "./dto/create-application.dto";

@Injectable()
export class ApplicationService {
  findAll() {
    return db.select().from(application);
  }

  findByCat(catId: number) {
    return db.select().from(application).where(eq(application.catId, catId));
  }

  async create(dto: CreateApplicationDto) {
    const [created] = await db.insert(application).values(dto).returning();
    return created;
  }

  async updateStatus(id: number, status: string) {
    const [updated] = await db
      .update(application)
      .set({ status })
      .where(eq(application.id, id))
      .returning();

    if (status === "approved" && updated) {
      await db.update(cat).set({ isAvailable: false }).where(eq(cat.id, updated.catId));
    }

    return updated;
  }
}
