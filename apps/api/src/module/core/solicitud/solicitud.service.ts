import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";

import { solicitud } from "@project/db";

import { db } from "@/lib/drizzle";

import type { CreateSolicitudDto } from "./dto/create-solicitud.dto";

@Injectable()
export class SolicitudService {
  findAll() {
    return db.select().from(solicitud);
  }

  findByCat(catId: number) {
    return db.select().from(solicitud).where(eq(solicitud.catId, catId));
  }

  async create(dto: CreateSolicitudDto) {
    const [created] = await db.insert(solicitud).values(dto).returning();
    return created;
  }
}
