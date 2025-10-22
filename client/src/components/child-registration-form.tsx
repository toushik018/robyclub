import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertChildSchema, type InsertChild } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Phone, Clock } from "lucide-react";

interface ChildRegistrationFormProps {
  onSubmit: (data: InsertChild) => void;
  isPending: boolean;
}

export function ChildRegistrationForm({
  onSubmit,
  isPending,
}: ChildRegistrationFormProps) {
  const form = useForm<InsertChild>({
    resolver: zodResolver(insertChildSchema),
    defaultValues: {
      name: "",
      parentPhone: "",
      parentPhone2: "",
      pickupTime: "",
    },
  });

  return (
    <Card className="shadow-md">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <UserPlus className="h-5 w-5 text-primary" />
          Register New Child
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    Child Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter child's name"
                      {...field}
                      data-testid="input-child-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    Parent Phone Number
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="+49 123 456789"
                        {...field}
                        data-testid="input-parent-phone"
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentPhone2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    Secondary Phone (Optional)
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="+49 987 654321"
                        {...field}
                        data-testid="input-parent-phone-2"
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pickupTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    Scheduled Pickup Time
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="time"
                        {...field}
                        data-testid="input-pickup-time"
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
              data-testid="button-register-child"
            >
              {isPending ? "Registering..." : "Register Child"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
