import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { Bell, Palette, Info, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DEFAULT_TEMPLATES = {
  message_emergency: "There's an emergency. Please contact the daycare immediately.",
  message_child_wishes: "Your child wishes to be picked up.",
  message_pickup_time: "It's your scheduled pickup time.",
};

export default function Settings() {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState("");
  const [emergencyMessage, setEmergencyMessage] = useState(DEFAULT_TEMPLATES.message_emergency);
  const [childWishesMessage, setChildWishesMessage] = useState(DEFAULT_TEMPLATES.message_child_wishes);
  const [pickupTimeMessage, setPickupTimeMessage] = useState(DEFAULT_TEMPLATES.message_pickup_time);

  const { data: settings, isLoading } = useQuery<Record<string, string>>({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    if (settings) {
      if (settings.n8n_webhook_url) {
        setWebhookUrl(settings.n8n_webhook_url);
      }
      if (settings.message_emergency) {
        setEmergencyMessage(settings.message_emergency);
      }
      if (settings.message_child_wishes) {
        setChildWishesMessage(settings.message_child_wishes);
      }
      if (settings.message_pickup_time) {
        setPickupTimeMessage(settings.message_pickup_time);
      }
    }
  }, [settings]);

  const saveWebhookMutation = useMutation({
    mutationFn: (url: string) =>
      apiRequest("PUT", "/api/settings/n8n_webhook_url", { value: url }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings saved",
        description: "n8n webhook URL has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to save",
        description: "Could not update the webhook URL. Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveMessagesMutation = useMutation({
    mutationFn: async () => {
      await Promise.all([
        apiRequest("PUT", "/api/settings/message_emergency", { value: emergencyMessage }),
        apiRequest("PUT", "/api/settings/message_child_wishes", { value: childWishesMessage }),
        apiRequest("PUT", "/api/settings/message_pickup_time", { value: pickupTimeMessage }),
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Templates saved",
        description: "Message templates have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to save",
        description: "Could not update the message templates. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveWebhook = () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid webhook URL.",
        variant: "destructive",
      });
      return;
    }
    saveWebhookMutation.mutate(webhookUrl);
  };

  const handleSaveMessages = () => {
    if (!emergencyMessage.trim() || !childWishesMessage.trim() || !pickupTimeMessage.trim()) {
      toast({
        title: "Invalid messages",
        description: "All message templates must be filled in.",
        variant: "destructive",
      });
      return;
    }
    saveMessagesMutation.mutate();
  };

  const isWebhookConfigured = settings?.n8n_webhook_url && settings.n8n_webhook_url.length > 0;

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
              <CardTitle className="text-base">WhatsApp Integration</CardTitle>
            </div>
            <CardDescription>
              Configure n8n webhook for WhatsApp notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-url" className="text-sm font-medium">
                n8n Webhook URL
              </Label>
              <Input
                id="webhook-url"
                type="url"
                placeholder="https://your-n8n-instance.com/webhook/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                disabled={isLoading}
                data-testid="input-webhook-url"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <Badge
                variant={isWebhookConfigured ? "default" : "secondary"}
                className={
                  isWebhookConfigured
                    ? "bg-green-500/10 text-green-700 dark:text-green-400"
                    : "bg-primary/10 text-primary"
                }
              >
                {isWebhookConfigured ? "Configured" : "Not Configured"}
              </Badge>
              <Button
                onClick={handleSaveWebhook}
                disabled={saveWebhookMutation.isPending || isLoading}
                size="sm"
                data-testid="button-save-webhook"
              >
                <Save className="mr-2 h-4 w-4" />
                {saveWebhookMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {isWebhookConfigured
                ? "WhatsApp notifications will be sent via your n8n webhook"
                : "Configure your n8n webhook to enable WhatsApp notifications"}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Message Templates</CardTitle>
            </div>
            <CardDescription>
              Customize messages sent to parents for different scenarios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-xs">
                    Emergency
                  </Badge>
                  <Label htmlFor="message-emergency" className="text-sm font-medium">
                    Emergency Message
                  </Label>
                </div>
                <Textarea
                  id="message-emergency"
                  placeholder="Enter emergency message template"
                  value={emergencyMessage}
                  onChange={(e) => setEmergencyMessage(e.target.value)}
                  disabled={isLoading}
                  rows={2}
                  data-testid="input-message-emergency"
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-warning text-warning-foreground text-xs">
                    Child Wishes Pickup
                  </Badge>
                  <Label htmlFor="message-child-wishes" className="text-sm font-medium">
                    Child Wishes Pickup Message
                  </Label>
                </div>
                <Textarea
                  id="message-child-wishes"
                  placeholder="Enter child wishes pickup message template"
                  value={childWishesMessage}
                  onChange={(e) => setChildWishesMessage(e.target.value)}
                  disabled={isLoading}
                  rows={2}
                  data-testid="input-message-child-wishes"
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-xs">
                    Pickup Time
                  </Badge>
                  <Label htmlFor="message-pickup-time" className="text-sm font-medium">
                    Pickup Time Message
                  </Label>
                </div>
                <Textarea
                  id="message-pickup-time"
                  placeholder="Enter pickup time message template"
                  value={pickupTimeMessage}
                  onChange={(e) => setPickupTimeMessage(e.target.value)}
                  disabled={isLoading}
                  rows={2}
                  data-testid="input-message-pickup-time"
                  className="resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSaveMessages}
                disabled={saveMessagesMutation.isPending || isLoading}
                data-testid="button-save-messages"
              >
                <Save className="mr-2 h-4 w-4" />
                {saveMessagesMutation.isPending ? "Saving..." : "Save Templates"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
