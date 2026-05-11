import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { getDefaultSiteDataValue } from "@/hooks/useSiteData";

type Content = Tables<"site_data">;

const defaultSections: Array<TablesInsert<"site_data">> = [
  { data_key: "hero_title", label: "Hero Title", value: "World Conference on Renewable Energy & Sustainable Energy", group_name: "hero", value_type: "text", is_public: true },
  { data_key: "hero_subtitle", label: "Hero Subtitle", value: "March 3-4, 2027 | Virtual (Online) Live Stream", group_name: "hero", value_type: "text", is_public: true },
  { data_key: "about_text", label: "About Text", value: "Renewable Energy - 2027 is a global forum for scientists, keynote speakers, industry pioneers, and policy leaders advancing low-carbon and sustainable energy futures.", group_name: "about", value_type: "textarea", is_public: true },
  { data_key: "conference_date", label: "Conference Date", value: "2027-03-03", group_name: "conference", value_type: "date", is_public: true },
  { data_key: "conference_venue", label: "Conference Venue", value: "Virtual (Online) Live Stream", group_name: "conference", value_type: "text", is_public: true },
  { data_key: "contact_email", label: "Contact Email", value: "info@yourconference.com", group_name: "contact", value_type: "email", is_public: true },
  { data_key: "registration_link", label: "Registration Link", value: "", group_name: "registration", value_type: "url", is_public: true },
];

const AdminContent = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [newSection, setNewSection] = useState({ data_key: "", label: "", value: "", group_name: "general", value_type: "text" });
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const fetchContent = async () => {
    const { data } = await supabase.from("site_data").select("*").order("group_name").order("label");
    if (data) setContents(data);
  };

  useEffect(() => { fetchContent(); }, []);

  const initDefaults = async () => {
    for (const section of defaultSections) {
      const exists = contents.find((c) => c.data_key === section.data_key);
      if (!exists) {
        await supabase.from("site_data").insert(section);
      }
    }
    toast({ title: "Default sections initialized!" });
    fetchContent();
  };

  const handleUpdate = async (id: string, label: string, value: string) => {
    const { error } = await supabase.from("site_data").update({ label, value }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Content saved!" });
    fetchContent();
  };

  const handleAddSection = async () => {
    if (!newSection.data_key.trim()) {
      toast({ title: "Data key is required", variant: "destructive" });
      return;
    }
    const section: TablesInsert<"site_data"> = {
      data_key: newSection.data_key.trim(),
      label: newSection.label.trim(),
      value: newSection.value.trim() || null,
      group_name: newSection.group_name.trim() || "general",
      value_type: newSection.value_type.trim() || "text",
      is_public: true,
    };
    const { error } = await supabase.from("site_data").insert(section);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Section added!" });
    setNewSection({ data_key: "", label: "", value: "", group_name: "general", value_type: "text" });
    setOpen(false);
    fetchContent();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle className="font-display">Website Content</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={initDefaults}>Init Defaults</Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gold-gradient text-hero-bg" size="sm"><Plus className="w-4 h-4 mr-1" /> Add Section</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display">Add Content Section</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Data Key (e.g. footer_text)" value={newSection.data_key} onChange={(e) => setNewSection({ ...newSection, data_key: e.target.value })} />
                <Input placeholder="Label" value={newSection.label} onChange={(e) => setNewSection({ ...newSection, label: e.target.value })} />
                <Textarea placeholder="Value" value={newSection.value} onChange={(e) => setNewSection({ ...newSection, value: e.target.value })} />
                <Input placeholder="Group Name" value={newSection.group_name} onChange={(e) => setNewSection({ ...newSection, group_name: e.target.value })} />
                <Input placeholder="Value Type (text, textarea, email, etc.)" value={newSection.value_type} onChange={(e) => setNewSection({ ...newSection, value_type: e.target.value })} />
                <Button onClick={handleAddSection} className="w-full">Add Section</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {contents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No content sections yet.</p>
            <Button onClick={initDefaults}>Initialize Default Sections</Button>
          </div>
        ) : (
          contents.map((item) => (
            <ContentRow key={item.id} item={item} onSave={handleUpdate} />
          ))
        )}
      </CardContent>
    </Card>
  );
};

const ContentRow = ({ item, onSave }: { item: Content; onSave: (id: string, label: string, value: string) => void }) => {
  const [label, setLabel] = useState(item.label || "");
  const [value, setValue] = useState(item.value || "");

  return (
    <div className="border border-border rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">{item.data_key}</span>
        <Button variant="ghost" size="sm" onClick={() => onSave(item.id, label, value)}>
          <Save className="w-4 h-4 mr-1" /> Save
        </Button>
      </div>
      <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label" className="text-sm" />
      <Textarea
        className="min-h-[60px]"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Value"
      />
    </div>
  );
};

export default AdminContent;
