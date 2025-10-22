import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bell, Palette, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Settings() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your daycare application preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Appearance</CardTitle>
              </div>
              <ThemeToggle />
            </div>
            <CardDescription>
              Toggle between light and dark mode for comfortable viewing
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Notifications</CardTitle>
            </div>
            <CardDescription>
              WhatsApp notifications are sent via n8n webhook integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Mock Mode Active
            </Badge>
            <p className="mt-2 text-xs text-muted-foreground">
              Configure your n8n webhook endpoint in the backend to enable real
              WhatsApp messaging
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">
                Message Templates
              </CardTitle>
            </div>
            <CardDescription>
              Preset messages sent to parents for different scenarios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="text-xs">
                  Emergency
                </Badge>
                <span className="text-sm text-card-foreground">
                  "There's an emergency. Please contact the daycare immediately."
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-warning text-warning-foreground text-xs">
                  Child Wishes Pickup
                </Badge>
                <span className="text-sm text-card-foreground">
                  "Your child wishes to be picked up."
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-xs">
                  Pickup Time
                </Badge>
                <span className="text-sm text-card-foreground">
                  "It's your scheduled pickup time."
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
