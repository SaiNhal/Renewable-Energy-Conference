import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

type RegistrationIntent = Tables<"registration_intents">;
type AbstractSubmission = Tables<"abstract_submissions">;
type ContactMessage = Tables<"contact_messages">;

const formatDate = (value: string | null) => {
  if (!value) return "-";
  return new Date(value).toLocaleString();
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
                          <div className="text-sm text-muted-foreground">{item.payment_status}</div>
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
