import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import type { Child } from "@shared/schema";
import { EmptyState } from "@/components/empty-state";
import { useSocket } from "@/contexts/SocketContext";
import { Archive, Phone, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Archived() {
  const { socket } = useSocket();
  const { data: children, isLoading } = useQuery<Child[]>({
    queryKey: ["/api/children"],
  });

  useEffect(() => {
    if (!socket) return;

    socket.on("child:deleted", () => {
      queryClient.invalidateQueries({ queryKey: ["/api/children"] });
    });

    socket.on("child:created", () => {
      queryClient.invalidateQueries({ queryKey: ["/api/children"] });
    });

    return () => {
      socket.off("child:deleted");
      socket.off("child:created");
    };
  }, [socket]);

  const archivedChildren =
    children?.filter((c) => c.status === "picked_up") || [];

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Archived Children
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Children who were picked up today - {todayDate}
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="space-y-4 rounded-xl border border-card-border bg-card p-6"
            >
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : archivedChildren.length === 0 ? (
        <EmptyState
          icon={Archive}
          title="No archived children yet"
          description="Children who are picked up will appear here for today's records."
          testId="empty-state-no-archived"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="archived-grid">
          {archivedChildren.map((child) => (
            <Card key={child.id} data-testid={`card-archived-${child.id}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-card-foreground">
                    {child.name}
                  </h3>
                </div>
                <Badge variant="secondary" className="font-mono text-xs">
                  #{child.dailyId}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-card-foreground">
                    {child.parentPhone}
                  </span>
                </div>
                {child.parentPhone2 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-card-foreground">
                      {child.parentPhone2}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-card-foreground">
                    Scheduled: {child.pickupTime}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Badge
                    variant="secondary"
                    className="bg-muted text-muted-foreground"
                  >
                    Picked Up
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
