import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Child, InsertChild } from "@shared/schema";
import { ChildCard } from "@/components/child-card";
import { ChildRegistrationForm } from "@/components/child-registration-form";
import { StatsCard } from "@/components/stats-card";
import { EmptyState } from "@/components/empty-state";
import { useToast } from "@/hooks/use-toast";
import { Users, Clock, TrendingUp, UserPlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

  const { data: children, isLoading } = useQuery<Child[]>({
    queryKey: ["/api/children"],
  });

  const registerMutation = useMutation({
    mutationFn: (data: InsertChild) =>
      apiRequest("POST", "/api/children", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/children"] });
      toast({
        title: "Child registered successfully",
        description: "The child has been added to the active list.",
      });
      setShowForm(false);
    },
    onError: () => {
      toast({
        title: "Registration failed",
        description: "There was an error registering the child. Please try again.",
        variant: "destructive",
      });
    },
  });

  const actionMutation = useMutation({
    mutationFn: ({
      childId,
      childName,
      actionType,
      parentPhone,
      message,
    }: {
      childId: string;
      childName: string;
      actionType: string;
      parentPhone: string;
      message: string;
    }) =>
      apiRequest("POST", "/api/actions", {
        childId,
        childName,
        actionType,
        parentPhone,
        message,
      }),
    onSuccess: () => {
      toast({
        title: "Notification sent",
        description: "WhatsApp message has been sent to the parent.",
      });
    },
  });

  const pickupMutation = useMutation({
    mutationFn: (childId: string) =>
      apiRequest("DELETE", `/api/children/${childId}`, undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/children"] });
      toast({
        title: "Child picked up",
        description: "The child has been removed from the active list.",
      });
    },
  });

  const handleAction = (child: Child, actionType: string, message: string) => {
    actionMutation.mutate({
      childId: child.id,
      childName: child.name,
      actionType,
      parentPhone: child.parentPhone,
      message,
    });
  };

  const activeChildren = children?.filter((c) => c.status === "active") || [];
  const upcomingPickups = activeChildren.filter((child) => {
    const now = new Date();
    const [hours, minutes] = child.pickupTime.split(":");
    const pickupDate = new Date();
    pickupDate.setHours(parseInt(hours), parseInt(minutes), 0);
    const diffMinutes = (pickupDate.getTime() - now.getTime()) / (1000 * 60);
    return diffMinutes <= 30 && diffMinutes >= 0;
  });

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Active Children Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{todayDate}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatsCard
          title="Total Children"
          value={activeChildren.length}
          icon={Users}
          description="Currently in daycare"
          testId="stat-total-children"
        />
        <StatsCard
          title="Upcoming Pickups"
          value={upcomingPickups.length}
          icon={Clock}
          description="Within next 30 minutes"
          testId="stat-upcoming-pickups"
        />
        <StatsCard
          title="Today's Total"
          value={children?.length || 0}
          icon={TrendingUp}
          description="All registrations today"
          testId="stat-today-total"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Active Children
            </h2>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4 rounded-xl border border-card-border bg-card p-6">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : activeChildren.length === 0 ? (
            <EmptyState
              icon={UserPlus}
              title="No children registered yet"
              description="Register the first child to get started with daycare management today."
              testId="empty-state-no-children"
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2" data-testid="children-grid">
              {activeChildren.map((child) => (
                <ChildCard
                  key={child.id}
                  child={child}
                  onEmergency={(child) =>
                    handleAction(
                      child,
                      "emergency",
                      "There's an emergency. Please contact the daycare immediately."
                    )
                  }
                  onChildWishes={(child) =>
                    handleAction(
                      child,
                      "child_wishes",
                      "Your child wishes to be picked up."
                    )
                  }
                  onPickupTime={(child) =>
                    handleAction(
                      child,
                      "pickup_time",
                      "It's your scheduled pickup time."
                    )
                  }
                  onMarkPickedUp={(child) => pickupMutation.mutate(child.id)}
                  isLoading={
                    actionMutation.isPending || pickupMutation.isPending
                  }
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <ChildRegistrationForm
            onSubmit={(data) => registerMutation.mutate(data)}
            isPending={registerMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
