import { Injectable } from "@nestjs/common";

import { breed } from "@project/db";

import { db } from "@/lib/drizzle";

import type { CreateBreedDto } from "./dto/create-breed.dto";

@Injectable()
export class BreedService {
  findAll() {
    return db.select().from(breed);
  }

  async create(dto: CreateBreedDto) {
    const [created] = await db.insert(breed).values(dto).returning();
    return created;
  }
}
