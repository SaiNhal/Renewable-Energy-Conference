import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type RegistrationIntent = Tables<"registration_intents">;
type AbstractSubmission = Tables<"abstract_submissions">;
type ContactMessage = Tables<"contact_messages">;

const formatDate = (value: string | null) => {
  if (!value) return "-";
  return new Date(value).toLocaleString();
};

const getPaymentBadgeVariant = (status: string) => {
  const normalized = status.toLowerCase();
  if (["paid", "success", "successful", "completed"].includes(normalized)) return "default";
  if (["failed", "cancelled", "canceled"].includes(normalized)) return "destructive";
  return "secondary";
};

const getStoredFiles = (value: unknown): Array<{ name: string; path: string }> => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") return { name: item.split("/").pop() || "Download", path: item };
      if (item && typeof item === "object" && "path" in item) {
        const file = item as { name?: unknown; path?: unknown };
        return {
          name: typeof file.name === "string" ? file.name : "Download",
          path: typeof file.path === "string" ? file.path : "",
        };
      }
      return null;
    })
    .filter((item): item is { name: string; path: string } => Boolean(item?.path));
};

const AdminSubmissions = () => {
  const [registrations, setRegistrations] = useState<RegistrationIntent[]>([]);
  const [abstracts, setAbstracts] = useState<AbstractSubmission[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    const [registrationsResult, abstractsResult, messagesResult] = await Promise.all([
      supabase.from("registration_intents").select("*").order("created_at", { ascending: false }),
      supabase.from("abstract_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
    ]);

    if (registrationsResult.error || abstractsResult.error || messagesResult.error) {
      toast({
        title: "Could not load submissions",
        description:
          registrationsResult.error?.message ||
          abstractsResult.error?.message ||
          messagesResult.error?.message ||
          "Unknown error",
        variant: "destructive",
      });
      return;
    }

    setRegistrations(registrationsResult.data || []);
    setAbstracts(abstractsResult.data || []);
    setMessages(messagesResult.data || []);
  }, [toast]);

  const openStoredFile = async (path: string) => {
    const { data, error } = await supabase.storage.from("abstract-assets").createSignedUrl(path, 60 * 10);

    if (error || !data?.signedUrl) {
      toast({
        title: "Could not open file",
        description: error?.message || "No download URL was created.",
        variant: "destructive",
      });
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const registrationCounts = registrations.reduce(
    (counts, item) => {
      const status = item.payment_status.toLowerCase();
      if (["paid", "success", "successful", "completed"].includes(status)) counts.successful += 1;
      else if (["failed", "cancelled", "canceled"].includes(status)) counts.failed += 1;
      else counts.processing += 1;
      return counts;
    },
    { successful: 0, failed: 0, processing: 0 },
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display">Submissions & Attendees</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="registrations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
            <TabsTrigger value="abstracts">Abstracts</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="registrations">
            <div className="mb-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-md border border-border p-4">
                <p className="text-sm text-muted-foreground">Successful</p>
                <p className="font-display text-2xl font-bold text-foreground">{registrationCounts.successful}</p>
              </div>
              <div className="rounded-md border border-border p-4">
                <p className="text-sm text-muted-foreground">Failed / Cancelled</p>
                <p className="font-display text-2xl font-bold text-foreground">{registrationCounts.failed}</p>
              </div>
              <div className="rounded-md border border-border p-4">
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="font-display text-2xl font-bold text-foreground">{registrationCounts.processing}</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Attendee</TableHead>
                    <TableHead className="hidden md:table-cell">Affiliation</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="hidden lg:table-cell">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No registrations yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    registrations.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="font-medium">{item.full_name}</div>
                          <div className="text-sm text-muted-foreground">{item.email}</div>
                          <div className="text-sm text-muted-foreground">{item.phone}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div>{item.affiliation || "-"}</div>
                          <div className="text-sm text-muted-foreground">{item.country || item.designation || "-"}</div>
                        </TableCell>
                        <TableCell>{item.plan_name}</TableCell>
                        <TableCell>
                          <div className="font-medium capitalize">{item.payment_provider}</div>
                          <Badge variant={getPaymentBadgeVariant(item.payment_status)}>{item.payment_status}</Badge>
                          <div className="mt-1 text-sm text-muted-foreground">{item.status}</div>
                          <div className="text-sm text-muted-foreground">{item.payment_reference || item.payment_session_id || item.payment_order_id || "-"}</div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{formatDate(item.created_at)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="abstracts">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Author</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Assets</TableHead>
                    <TableHead className="hidden lg:table-cell">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {abstracts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No abstract submissions yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    abstracts.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="font-medium">{item.full_name}</div>
                          <div className="text-sm text-muted-foreground">{item.email}</div>
                          <div className="text-sm text-muted-foreground">{item.affiliation}</div>
                        </TableCell>
                        <TableCell>
                          <div>{item.abstract_title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">{item.keywords || item.country || "-"}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{item.presentation_type || "-"}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-sm text-muted-foreground">
                            {[
                              item.website_url ? "Website" : null,
                              item.drive_url ? "Drive" : null,
                              item.supporting_text ? "Text" : null,
                              item.voice_file_name ? "Voice" : null,
                              Array.isArray(item.file_paths) && item.file_paths.length > 0 ? "Files" : null,
                            ]
                              .filter(Boolean)
                              .join(", ") || "-"}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {getStoredFiles(item.file_paths).map((file) => (
                              <Button key={file.path} type="button" size="sm" variant="outline" onClick={() => openStoredFile(file.path)}>
                                <Download className="mr-1 h-3 w-3" />
                                {file.name}
                              </Button>
                            ))}
                            {item.voice_file_path ? (
                              <Button type="button" size="sm" variant="outline" onClick={() => openStoredFile(item.voice_file_path || "")}>
                                <Download className="mr-1 h-3 w-3" />
                                {item.voice_file_name || "Voice"}
                              </Button>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{formatDate(item.created_at)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sender</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="hidden md:table-cell">Message</TableHead>
                    <TableHead className="hidden lg:table-cell">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No contact messages yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    messages.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.email}</div>
                        </TableCell>
                        <TableCell>{item.subject}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-[380px] truncate">{item.message}</TableCell>
                        <TableCell className="hidden lg:table-cell">{formatDate(item.created_at)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminSubmissions;
