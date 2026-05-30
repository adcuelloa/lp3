import { AlertCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { statusColor } from "@/lib/app-reducer";
import type { Application, Cat } from "@/types";

interface ApplicationsViewProps {
  applications: Application[];
  isLoading: boolean;
  isError: boolean;
  catMap: Map<number, Cat>;
  onViewCats: () => void;
  onUpdateStatus: (id: number, status: string) => void;
  isUpdating: boolean;
}

export default function ApplicationsView({
  applications,
  isLoading,
  isError,
  catMap,
  onViewCats,
  onUpdateStatus,
  isUpdating,
}: ApplicationsViewProps) {
  return (
    <>
      {isLoading && (
        <div className="flex flex-col gap-3">
          {["a", "b", "c", "d"].map((id) => (
            <Skeleton key={id} className="h-24 rounded-2xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="border-border bg-card flex flex-col items-center justify-center gap-3 rounded-2xl border py-20">
          <AlertCircle size={28} className="text-muted-foreground" />
          <p className="text-foreground text-base font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            Could not load applications
          </p>
        </div>
      )}

      {!isLoading && !isError && applications.length === 0 && (
        <div className="border-border bg-card flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed py-24">
          <span className="text-5xl">📋</span>
          <p className="text-foreground text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            No applications yet
          </p>
          <p className="text-muted-foreground text-sm">
            When someone wants to adopt a cat, it will appear here.
          </p>
          <Button size="sm" variant="outline" className="rounded-full" onClick={onViewCats}>
            View available cats
          </Button>
        </div>
      )}

      {!isLoading && !isError && applications.length > 0 && (
        <div className="flex flex-col gap-3">
          {applications.map((app) => {
            const cat = catMap.get(app.catId);
            const colorClass = statusColor[app.status] ?? "bg-gray-100 text-gray-600";
            const fecha = new Date(app.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            return (
              <div
                key={app.id}
                className="border-border bg-card flex flex-col gap-3 rounded-2xl border p-5 sm:flex-row sm:items-start sm:gap-5"
              >
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-3xl leading-none">🐱</span>
                  <div>
                    <p className="text-muted-foreground text-xs tracking-wider uppercase">Cat</p>
                    <p className="text-foreground font-bold" style={{ fontFamily: "var(--font-display)" }}>
                      {cat?.name ?? `#${app.catId}`}
                    </p>
                  </div>
                </div>

                <div className="bg-border hidden w-px self-stretch sm:block" />

                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-foreground font-semibold">{app.applicantName}</p>
                    <Badge className={`border-0 text-[10px] tracking-wider uppercase ${colorClass}`}>
                      {app.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{app.applicantEmail}</p>
                  {app.phone && <p className="text-muted-foreground text-sm">{app.phone}</p>}
                  {app.message && (
                    <p className="text-foreground/70 mt-1 text-sm italic">
                      &ldquo;{app.message}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <p className="text-muted-foreground text-xs">{fecha}</p>
                  {app.status === "pending" && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 rounded-full border-green-300 text-green-700 hover:bg-green-50 text-xs px-3"
                        disabled={isUpdating}
                        onClick={() => onUpdateStatus(app.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 rounded-full border-red-300 text-red-700 hover:bg-red-50 text-xs px-3"
                        disabled={isUpdating}
                        onClick={() => onUpdateStatus(app.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
