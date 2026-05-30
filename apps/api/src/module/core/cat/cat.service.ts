import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";

import { cat } from "@project/db";

import { db } from "@/lib/drizzle";

import type { CreateCatDto } from "./dto/create-cat.dto";

@Injectable()
export class CatService {
  findAll() {
    return db.select().from(cat);
  }

  async create(dto: CreateCatDto, registeredById?: number) {
    const [created] = await db
      .insert(cat)
      .values({
        name: dto.name,
        breedId: dto.breedId,
        color: dto.color,
        gender: dto.gender,
        ageMonths: dto.ageMonths,
        weightKg: dto.weightKg,
        description: dto.description,
        isAvailable: dto.isAvailable,
        registeredById,
      })
      .returning();
    return created;
  }

  async update(id: number, dto: CreateCatDto) {
    const [updated] = await db
      .update(cat)
      .set({
        name: dto.name,
        breedId: dto.breedId,
        color: dto.color,
        gender: dto.gender,
        ageMonths: dto.ageMonths,
        weightKg: dto.weightKg,
        description: dto.description,
        isAvailable: dto.isAvailable,
      })
      .where(eq(cat.id, id))
      .returning();
    return updated;
  }

  async remove(id: number) {
    const [removed] = await db.delete(cat).where(eq(cat.id, id)).returning();
    return removed;
  }
}
