import { AlertCircle, Plus } from "lucide-react";

import CatCard from "@/components/CatCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Cat } from "@/types";

const CAT_GRID = "grid gap-5";
const CAT_GRID_COLS = { gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" };

interface CatsViewProps {
  cats: Cat[];
  isLoading: boolean;
  isError: boolean;
  appliedCatIds: Set<number>;
  isAdmin: boolean;
  onAddOpen: () => void;
  onEditCat: (cat: Cat) => void;
  onAdoptCat: (cat: Cat) => void;
}

export default function CatsView({
  cats,
  isLoading,
  isError,
  appliedCatIds,
  isAdmin,
  onAddOpen,
  onEditCat,
  onAdoptCat,
}: CatsViewProps) {
  const availableCats = cats.filter((c) => c.isAvailable);
  const adoptedCats = cats.filter((c) => !c.isAvailable);

  return (
    <>
      {isLoading && (
        <div className={CAT_GRID} style={CAT_GRID_COLS}>
          {["a", "b", "c", "d", "e", "f"].map((id) => (
            <Skeleton key={id} className="h-56 rounded-2xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="border-border bg-card flex flex-col items-center justify-center gap-3 rounded-2xl border py-20">
          <AlertCircle size={28} className="text-muted-foreground" />
          <p className="text-foreground text-base font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            Could not connect to the API
          </p>
          <p className="text-muted-foreground text-sm">
            Make sure the server is running on port 3000.
          </p>
        </div>
      )}

      {!isLoading && !isError && cats.length === 0 && (
        <div className="border-border bg-card flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed py-24">
          <span className="animate-float text-5xl">🏠</span>
          <p className="text-foreground text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            The shelter is empty!
          </p>
          <p className="text-muted-foreground mb-1 text-sm">
            Register the first cat available for adoption.
          </p>
          {isAdmin && (
            <Button size="sm" className="rounded-full" onClick={onAddOpen}>
              <Plus data-icon="inline-start" />
              Register Cat
            </Button>
          )}
        </div>
      )}

      {!isLoading && !isError && availableCats.length > 0 && (
        <div className={CAT_GRID} style={CAT_GRID_COLS}>
          {availableCats.map((cat, index) => (
            <CatCard
              key={cat.id}
              cat={cat}
              index={index}
              onEdit={() => onEditCat(cat)}
              onAdopt={() => onAdoptCat(cat)}
              hasRequest={appliedCatIds.has(cat.id)}
              showEdit={isAdmin}
            />
          ))}
        </div>
      )}

      {!isLoading && !isError && isAdmin && adoptedCats.length > 0 && (
        <div className="mt-12">
          <div className="mb-5 flex items-center gap-3">
            <div className="bg-border h-px flex-1" />
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
              ❤️ Already adopted
            </p>
            <div className="bg-border h-px flex-1" />
          </div>
          <div className={CAT_GRID} style={CAT_GRID_COLS}>
            {adoptedCats.map((cat, index) => (
              <CatCard
                key={cat.id}
                cat={cat}
                index={index}
                onEdit={() => onEditCat(cat)}
                onAdopt={() => {}}
                showEdit={isAdmin}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
