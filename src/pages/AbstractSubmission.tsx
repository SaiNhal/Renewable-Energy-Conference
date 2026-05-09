import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link as LinkIcon, Upload, FileText, FolderOpen, Download, X } from "lucide-react";

type StoredFileInfo = {
  name: string;
  path: string;
  type: string;
};

const titles = ["Dr.", "Prof.", "Mr.", "Mrs.", "Miss."];

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Cote d'Ivoire",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

const AbstractSubmission = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    titlePrefix: "",
    name: "",
    email: "",
    phone: "",
    organization: "",
    country: "",
    presentationType: "",
    abstractTitle: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const appendFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const nextFile = files[0];
    setSelectedFiles([nextFile]);
  };

  const removeFile = (target: File) => {
    setSelectedFiles((current) => current.filter((file) => file !== target));
  };

  const uploadFileToStorage = async (file: File, folder: "documents") => {
    const extension = file.name.includes(".") ? file.name.split(".").pop() : "";
    const filePath = `${folder}/${crypto.randomUUID()}-${file.name.replace(/\s+/g, "-")}${extension ? "" : ""}`;

    const { error } = await supabase.storage.from("abstract-assets").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      throw error;
    }

    return filePath;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredValues = [
      formData.titlePrefix,
      formData.name,
      formData.email,
      formData.phone,
      formData.organization,
      formData.country,
      formData.presentationType,
      formData.abstractTitle,
    ];

    if (requiredValues.some((value) => value.trim() === "")) {
      toast({
        title: "All fields are required",
        description: "Please complete every mandatory field before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (selectedFiles.length === 0) {
      toast({
        title: "Document required",
        description: "Please upload your abstract document before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const storedFiles: StoredFileInfo[] = [];

      for (const file of selectedFiles) {
        const path = await uploadFileToStorage(file, "documents");
        storedFiles.push({
          name: file.name,
          path,
          type: file.type || "application/octet-stream",
        });
      }

      const { error } = await supabase.from("abstract_submissions").insert({
        full_name: `${formData.titlePrefix} ${formData.name}`.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        affiliation: formData.organization.trim(),
        country: formData.country.trim(),
        presentation_type: formData.presentationType.trim(),
        abstract_title: formData.abstractTitle.trim(),
        abstract_text: "Submitted as uploaded document.",
        file_paths: storedFiles.length > 0 ? storedFiles : null,
        status: "submitted",
      });

      if (error) {
        throw error;
      }

      toast({ title: "Abstract Submitted!", description: "Files and links were saved successfully." });
      setFormData({
        titlePrefix: "",
        name: "",
        email: "",
        phone: "",
        organization: "",
        country: "",
        presentationType: "",
        abstractTitle: "",
      });
      setSelectedFiles([]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast({ title: "Submission failed", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 hero-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gold font-display mb-4">Abstract Submission</h1>
          <p className="text-hero-foreground/80 font-body max-w-2xl mx-auto">
            Submit your research abstract and supporting materials for Renewable Energy - 2027
          </p>
        </div>
      </div>
      <div className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-card-foreground mb-2">Abstract Submission Guidelines</h2>
                <ul className="text-muted-foreground text-sm font-body space-y-2">
                  <li>- Please download the abstract template and follow the format carefully to avoid revisions.</li>
                  <li>- Abstract submissions must be prepared in English.</li>
                  <li>- The abstract should clearly include the background, purpose, methodology, results, and conclusion of the research.</li>
                  <li>- Please include complete author details, affiliation, presentation category (Oral/Poster), and a brief biography of the presenting author.</li>
                </ul>
              </div>
              <Button asChild variant="outline" className="shrink-0">
                <a href="/Abstract-submission-sample.docx" download>
                  <Download className="mr-2 h-4 w-4" />
                  Download Template
                </a>
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4">
                <div>
                  <label className="text-sm font-body font-medium text-card-foreground mb-1 block">Title *</label>
                  <Select value={formData.titlePrefix} onValueChange={(value) => setFormData({ ...formData, titlePrefix: value })} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select title" />
                    </SelectTrigger>
                    <SelectContent>
                      {titles.map((title) => (
                        <SelectItem key={title} value={title}>
                          {title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-body font-medium text-card-foreground mb-1 block">Name *</label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-body font-medium text-card-foreground mb-1 block">Email *</label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
                <div>
                  <label className="text-sm font-body font-medium text-card-foreground mb-1 block">Phone *</label>
                  <Input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                </div>
              </div>

              <div>
                <label className="text-sm font-body font-medium text-card-foreground mb-1 block">Organization *</label>
                <Input value={formData.organization} onChange={(e) => setFormData({ ...formData, organization: e.target.value })} required />
              </div>

              <div>
                <label className="text-sm font-body font-medium text-card-foreground mb-1 block">Country *</label>
                <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-body font-medium text-card-foreground mb-1 block">Presentation Category *</label>
                <Select value={formData.presentationType} onValueChange={(value) => setFormData({ ...formData, presentationType: value })} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Oral Presentation">Oral</SelectItem>
                    <SelectItem value="Poster Presentation">Poster</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-body font-medium text-card-foreground mb-1 block">Abstract Title *</label>
                <Input value={formData.abstractTitle} onChange={(e) => setFormData({ ...formData, abstractTitle: e.target.value })} required />
              </div>

              <div
                className={`rounded-[2rem] border border-dashed p-8 transition-colors ${
                  isDragging ? "border-gold bg-gold/5" : "border-border bg-[#1d2026] text-white"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  appendFiles(e.dataTransfer.files);
                }}
              >
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-semibold text-white">Drop your files</h3>
                  <p className="mt-2 text-base text-white/65">PDF, Images, docs and more</p>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-4 text-base font-semibold text-white transition hover:bg-white/10"
                  >
                    <Upload size={18} />
                    Upload files
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                  onChange={(e) => appendFiles(e.target.files)}
                />
              </div>

              {selectedFiles.length > 0 && (
                <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">Selected files</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedFiles.map((file) => (
                        <div
                          key={`${file.name}-${file.size}-${file.lastModified}`}
                          className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-2 text-sm text-muted-foreground border border-border"
                        >
                          <FileText size={14} />
                          {file.name}
                          <button
                            type="button"
                            onClick={() => removeFile(file)}
                            className="ml-1 text-muted-foreground hover:text-destructive"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" disabled={isSubmitting} className="w-full gold-gradient text-hero-bg font-semibold hover:opacity-90 font-body py-6">
                {isSubmitting ? "Submitting..." : "Submit Abstract"}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AbstractSubmission;
