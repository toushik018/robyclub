import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Child } from "@shared/schema";
import {
  AlertTriangle,
  User,
  Clock,
  Phone,
  CheckCircle2,
} from "lucide-react";

interface ChildCardProps {
  child: Child;
  onEmergency: (child: Child) => void;
  onChildWishes: (child: Child) => void;
  onPickupTime: (child: Child) => void;
  onMarkPickedUp: (child: Child) => void;
  isLoading?: boolean;
}

export function ChildCard({
  child,
  onEmergency,
  onChildWishes,
  onPickupTime,
  onMarkPickedUp,
  isLoading,
}: ChildCardProps) {
  const isNearPickupTime = () => {
    const now = new Date();
    const [hours, minutes] = child.pickupTime.split(":");
    const pickupDate = new Date();
    pickupDate.setHours(parseInt(hours), parseInt(minutes), 0);
    const diffMinutes = (pickupDate.getTime() - now.getTime()) / (1000 * 60);
    return diffMinutes <= 15 && diffMinutes >= -15;
  };

  return (
    <Card
      className={`transition-all hover:shadow-lg ${
        isNearPickupTime()
          ? "border-warning ring-2 ring-warning/20"
          : ""
      }`}
      data-testid={`card-child-${child.id}`}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
        <div className="flex-1">
          <h3
            className="text-lg font-semibold text-card-foreground"
            data-testid={`text-child-name-${child.id}`}
          >
            {child.name}
          </h3>
        </div>
        <Badge
          variant="secondary"
          className="font-mono text-xs"
          data-testid={`badge-child-id-${child.id}`}
        >
          #{child.dailyId}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span
              className="text-card-foreground"
              data-testid={`text-phone-${child.id}`}
            >
              {child.parentPhone}
            </span>
          </div>
          {child.parentPhone2 && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span
                className="text-card-foreground"
                data-testid={`text-phone-2-${child.id}`}
              >
                {child.parentPhone2}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span
              className="font-medium text-card-foreground"
              data-testid={`text-pickup-time-${child.id}`}
            >
              Pickup: {child.pickupTime}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-success" />
          <Badge
            variant="secondary"
            className="bg-success/10 text-success hover:bg-success/20"
            data-testid={`badge-status-${child.id}`}
          >
            In Daycare
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEmergency(child)}
            disabled={isLoading}
            data-testid={`button-emergency-${child.id}`}
            className="border-destructive/30 bg-destructive/5 text-destructive"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Emergency
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChildWishes(child)}
            disabled={isLoading}
            data-testid={`button-child-wishes-${child.id}`}
            className="border-warning/30 bg-warning/5 text-warning"
          >
            <User className="mr-2 h-4 w-4" />
            Child Wishes
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPickupTime(child)}
            disabled={isLoading}
            data-testid={`button-pickup-time-${child.id}`}
            className="border-primary/30 bg-primary/5 text-primary"
          >
            <Clock className="mr-2 h-4 w-4" />
            Pickup Time
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMarkPickedUp(child)}
            disabled={isLoading}
            data-testid={`button-picked-up-${child.id}`}
            className="border-success/30 bg-success/5 text-success"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Picked Up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
