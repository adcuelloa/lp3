import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";

import { cat } from "@project/db";

import { db } from "@/lib/drizzle";

@Injectable()
export class CatService {
  /**
   * find all cats
   * @returns an array of cats
   */
  async findAll() {
    return db.select().from(cat);
  }

  /**
   * create a new cat
   * @param name the name of the cat
   * @returns the created cat
   */
  async create(name: string) {
    const [createdCat] = await db.insert(cat).values({ name }).returning();
    return createdCat;
  }

  /**
   * update a cat by id
   * @param id the id of the cat to update
   * @returns the updated cat
   */
  async update(id: number, name: string) {
    const [updatedCat] = await db.update(cat).set({ name }).where(eq(cat.id, id)).returning();
    return updatedCat;
  }
}
