import { Heart, HeartHandshake, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Cat {
  id: number;
  name: string;
  color?: string | null;
  gender?: string;
  ageMonths?: number | null;
  isAvailable?: boolean;
}

const PALETTES = [
  { bg: "#fde8d4", border: "#f0c4a0", emoji: "🐱" },
  { bg: "#e4f0e4", border: "#b8d8b8", emoji: "😸" },
  { bg: "#f4eae0", border: "#e4c8b0", emoji: "🐈" },
  { bg: "#e2ecf8", border: "#b8cce8", emoji: "😺" },
  { bg: "#f4e2ee", border: "#e8b8d4", emoji: "😻" },
  { bg: "#edf4e2", border: "#c8e0b0", emoji: "🐈‍⬛" },
];

interface CatCardProps {
  cat: Cat;
  index: number;
  onEdit: () => void;
  onAdopt: () => void;
  hasRequest?: boolean;
  showEdit?: boolean;
}

export default function CatCard({
  cat,
  index,
  onEdit,
  onAdopt,
  hasRequest = false,
  showEdit = false,
}: CatCardProps) {
  const palette = PALETTES[cat.id % PALETTES.length];
  const isAdopted = cat.isAvailable === false;

  const ageLabel =
    cat.ageMonths != null
      ? cat.ageMonths < 12
        ? `${cat.ageMonths}mo`
        : `${Math.floor(cat.ageMonths / 12)}yr`
      : null;

  const genderLabel =
    cat.gender === "male" ? "♂ Male" : cat.gender === "female" ? "♀ Female" : null;

  const subtitle = [genderLabel, ageLabel, cat.color].filter(Boolean).join(" · ");

  return (
    <Card
      className="gap-0 py-0 transition-transform duration-300 hover:-translate-y-1"
      style={{
        backgroundColor: isAdopted ? "#f5f5f5" : palette.bg,
        borderColor: isAdopted ? "#e0e0e0" : palette.border,
        opacity: isAdopted ? 0.75 : 1,
        animation: `fade-up 0.5s ease-out ${index * 65}ms both`,
      }}
    >
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between">
          <span
            className="text-5xl leading-none select-none"
            style={{
              filter: isAdopted
                ? "grayscale(0.6) drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
                : "drop-shadow(0 2px 4px rgba(0,0,0,0.08))",
            }}
          >
            {palette.emoji}
          </span>
          {showEdit && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onEdit}
              aria-label={`Edit ${cat.name}`}
              className="text-muted-foreground"
            >
              <Pencil data-icon />
            </Button>
          )}
        </div>

        <div>
          <h3
            className="text-foreground text-2xl leading-tight font-semibold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {cat.name}
          </h3>
          {subtitle && (
            <Badge variant="secondary" className="mt-2 text-xs tracking-widest uppercase">
              {subtitle}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        {isAdopted ? (
          <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-700">
            ❤️ Adopted
          </div>
        ) : hasRequest ? (
          <div className="text-primary bg-primary/10 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold">
            <HeartHandshake size={16} className="animate-heart-pop" />
            Application sent!
          </div>
        ) : (
          <Button className="w-full rounded-xl" onClick={onAdopt}>
            <Heart data-icon="inline-start" />
            Adopt
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
