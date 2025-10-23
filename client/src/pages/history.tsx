import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, Clock, Phone, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Child } from "@shared/schema";

export default function History() {
  const { data: children = [], isLoading } = useQuery<Child[]>({
    queryKey: ["/api/children"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground" data-testid="text-loading">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">Child History</h1>
          <p className="text-muted-foreground mt-2" data-testid="text-page-subtitle">
            Complete record of all children registered today
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle data-testid="text-card-title">All Children</CardTitle>
            <CardDescription data-testid="text-children-count">
              {children.length} {children.length === 1 ? "child" : "children"} registered today
            </CardDescription>
          </CardHeader>
          <CardContent>
            {children.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium" data-testid="text-empty-title">No children registered yet</p>
                <p className="text-sm text-muted-foreground mt-2" data-testid="text-empty-message">
                  Children will appear here as they are registered
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Primary Phone</TableHead>
                      <TableHead>Secondary Phone</TableHead>
                      <TableHead>Pickup Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registered</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {children.map((child) => (
                      <TableRow key={child.id} data-testid={`row-child-${child.id}`}>
                        <TableCell className="font-mono font-medium" data-testid={`text-dailyid-${child.id}`}>
                          #{child.dailyId}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium" data-testid={`text-name-${child.id}`}>
                              {child.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-mono text-sm" data-testid={`text-phone1-${child.id}`}>
                              {child.parentPhone}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {child.parentPhone2 ? (
                            <div className="flex items-center gap-2">
                              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="font-mono text-sm" data-testid={`text-phone2-${child.id}`}>
                                {child.parentPhone2}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-mono text-sm" data-testid={`text-pickuptime-${child.id}`}>
                              {child.pickupTime}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={child.status === "active" ? "default" : "secondary"}
                            data-testid={`badge-status-${child.id}`}
                          >
                            {child.status === "active" ? "Active" : "Picked Up"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground" data-testid={`text-registered-${child.id}`}>
                            {format(new Date(child.registeredAt), "h:mm a")}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
