import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Search,
  User,
  Building2,
  BookOpen,
  ExternalLink,
  Mail,
  Star,
  Filter,
  Globe,
  GraduationCap,
  FileText,
  ChevronRight,
  Sparkles,
  MapPin,
  Award,
} from "lucide-react";

interface Professor {
  id: string;
  name: string;
  title: string;
  university: string;
  department: string;
  researchAreas: string[];
  publications: number;
  citations: number;
  email: string;
  website?: string;
  hIndex: number;
  country: string;
  openToMentoring: boolean;
  recentPapers: { title: string; year: number; citations: number }[];
}

// Mock data for demonstration
const mockProfessors: Professor[] = [
  {
    id: "1",
    name: "Dr. Sarah Mitchell",
    title: "Associate Professor",
    university: "MIT",
    department: "Computer Science",
    researchAreas: ["Machine Learning", "Natural Language Processing", "AI Ethics"],
    publications: 87,
    citations: 4523,
    email: "s.mitchell@mit.edu",
    website: "https://mit.edu/~smitchell",
    hIndex: 32,
    country: "USA",
    openToMentoring: true,
    recentPapers: [
      { title: "Bias Detection in Large Language Models", year: 2024, citations: 156 },
      { title: "Efficient Transformers for Edge Devices", year: 2023, citations: 89 },
    ],
  },
  {
    id: "2",
    name: "Prof. James Chen",
    title: "Professor",
    university: "Stanford University",
    department: "Biology",
    researchAreas: ["Genomics", "CRISPR", "Synthetic Biology"],
    publications: 142,
    citations: 12450,
    email: "jchen@stanford.edu",
    website: "https://stanford.edu/~jchen",
    hIndex: 48,
    country: "USA",
    openToMentoring: false,
    recentPapers: [
      { title: "Novel CRISPR Applications in Agriculture", year: 2024, citations: 234 },
      { title: "Gene Editing for Disease Resistance", year: 2023, citations: 178 },
    ],
  },
  {
    id: "3",
    name: "Dr. Priya Patel",
    title: "Assistant Professor",
    university: "Oxford University",
    department: "Psychology",
    researchAreas: ["Cognitive Psychology", "Memory", "Learning"],
    publications: 45,
    citations: 1890,
    email: "p.patel@ox.ac.uk",
    hIndex: 18,
    country: "UK",
    openToMentoring: true,
    recentPapers: [
      { title: "Digital Learning and Memory Retention", year: 2024, citations: 67 },
      { title: "Sleep and Academic Performance in Teens", year: 2023, citations: 112 },
    ],
  },
  {
    id: "4",
    name: "Prof. Ahmed Hassan",
    title: "Professor",
    university: "ETH Zurich",
    department: "Environmental Science",
    researchAreas: ["Climate Modeling", "Sustainability", "Renewable Energy"],
    publications: 98,
    citations: 6780,
    email: "a.hassan@ethz.ch",
    hIndex: 38,
    country: "Switzerland",
    openToMentoring: true,
    recentPapers: [
      { title: "Urban Heat Islands: Mitigation Strategies", year: 2024, citations: 89 },
      { title: "Carbon Capture in Developing Nations", year: 2023, citations: 156 },
    ],
  },
];

const researchFields = [
  "All Fields",
  "Computer Science",
  "Biology",
  "Psychology",
  "Environmental Science",
  "Physics",
  "Chemistry",
  "Economics",
  "Medicine",
];

interface ProfessorLookupProps {
  onSelectProfessor?: (professor: Professor) => void;
}

export default function ProfessorLookup({ onSelectProfessor }: ProfessorLookupProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState("All Fields");
  const [showMentoringOnly, setShowMentoringOnly] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Professor[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    setHasSearched(true);

    // Simulate search delay
    setTimeout(() => {
      let filtered = mockProfessors;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.researchAreas.some((a) => a.toLowerCase().includes(query)) ||
            p.university.toLowerCase().includes(query)
        );
      }

      if (selectedField !== "All Fields") {
        filtered = filtered.filter((p) => p.department === selectedField);
      }

      if (showMentoringOnly) {
        filtered = filtered.filter((p) => p.openToMentoring);
      }

      setResults(filtered);
      setIsSearching(false);
    }, 800);
  };

  const ProfessorCard = ({ professor }: { professor: Professor }) => (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className={`p-5 border-3 border-foreground bg-card cursor-pointer transition-all ${
        selectedProfessor?.id === professor.id ? "ring-2 ring-primary" : ""
      }`}
      style={{ boxShadow: "var(--shadow-brutal-sm)" }}
      onClick={() => setSelectedProfessor(professor)}
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-primary/10 border-2 border-foreground flex items-center justify-center">
          <User className="w-7 h-7 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">{professor.name}</h3>
            {professor.openToMentoring && (
              <span className="px-2 py-0.5 text-xs bg-comic-green text-white border border-foreground font-bold">
                OPEN TO MENTORING
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{professor.title}</p>
          <div className="flex items-center gap-2 mt-1 text-sm">
            <Building2 className="w-4 h-4" />
            <span>{professor.university}</span>
            <span className="text-muted-foreground">•</span>
            <MapPin className="w-4 h-4" />
            <span>{professor.country}</span>
          </div>

          <div className="flex flex-wrap gap-1 mt-3">
            {professor.researchAreas.map((area) => (
              <span
                key={area}
                className="px-2 py-0.5 text-xs bg-muted border border-foreground/30 font-medium"
              >
                {area}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {professor.publications} papers
            </span>
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              h-index: {professor.hIndex}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              {professor.citations.toLocaleString()} citations
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary border-2 border-foreground flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-comic text-2xl">Professor & Research Lookup</h2>
          <p className="text-sm text-muted-foreground">
            Find experts in your field and discover relevant research
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search by name, research area, or university..."
              className="w-full h-12 pl-11 pr-4 border-3 border-foreground bg-card font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              style={{ boxShadow: "var(--shadow-brutal-sm)" }}
            />
          </div>
          <Button
            onClick={handleSearch}
            className="brutal-button bg-primary text-primary-foreground h-12 px-6"
          >
            <Search className="w-5 h-5 mr-2" />
            Search
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="h-10 px-4 border-2 border-foreground bg-card font-medium focus:outline-none"
          >
            {researchFields.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showMentoringOnly}
              onChange={(e) => setShowMentoringOnly(e.target.checked)}
              className="w-5 h-5 border-2 border-foreground"
            />
            <span className="font-medium">Open to mentoring only</span>
          </label>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="space-y-4">
          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-primary/10 border-2 border-foreground flex items-center justify-center animate-pulse">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <p className="mt-4 font-medium">Searching professors...</p>
            </div>
          ) : hasSearched && results.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted border-2 border-foreground flex items-center justify-center mx-auto">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="mt-4 font-medium">No professors found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          ) : !hasSearched ? (
            <div className="text-center py-12 bg-muted/30 border-2 border-dashed border-foreground/30">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-comic text-xl mb-2">Find Your Research Mentor</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Search for professors by name, research area, or university. Filter by those open to mentoring high school students.
              </p>
            </div>
          ) : (
            results.map((professor) => (
              <ProfessorCard key={professor.id} professor={professor} />
            ))
          )}
        </div>

        {/* Detail Panel */}
        <AnimatePresence mode="wait">
          {selectedProfessor && (
            <motion.div
              key={selectedProfessor.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6 border-3 border-foreground bg-card sticky top-4"
              style={{ boxShadow: "var(--shadow-brutal)" }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 bg-primary border-3 border-foreground flex items-center justify-center">
                  <User className="w-10 h-10 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-comic text-2xl">{selectedProfessor.name}</h2>
                  <p className="text-muted-foreground">{selectedProfessor.title}</p>
                  <p className="font-medium">{selectedProfessor.university}</p>
                  <p className="text-sm text-muted-foreground">{selectedProfessor.department}</p>
                </div>
              </div>

              {selectedProfessor.openToMentoring && (
                <div className="p-3 bg-comic-green/10 border-2 border-comic-green mb-4">
                  <div className="flex items-center gap-2 text-comic-green font-bold">
                    <Star className="w-5 h-5" />
                    Open to Mentoring High School Students
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-3 bg-muted border-2 border-foreground text-center">
                  <div className="font-comic text-2xl text-primary">{selectedProfessor.publications}</div>
                  <div className="text-xs text-muted-foreground font-bold uppercase">Papers</div>
                </div>
                <div className="p-3 bg-muted border-2 border-foreground text-center">
                  <div className="font-comic text-2xl text-primary">{selectedProfessor.hIndex}</div>
                  <div className="text-xs text-muted-foreground font-bold uppercase">h-index</div>
                </div>
                <div className="p-3 bg-muted border-2 border-foreground text-center">
                  <div className="font-comic text-2xl text-primary">{(selectedProfessor.citations / 1000).toFixed(1)}K</div>
                  <div className="text-xs text-muted-foreground font-bold uppercase">Citations</div>
                </div>
              </div>

              {/* Research Areas */}
              <div className="mb-6">
                <h4 className="font-bold mb-2">Research Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProfessor.researchAreas.map((area) => (
                    <span
                      key={area}
                      className="px-3 py-1 bg-primary/10 border border-primary text-primary font-medium text-sm"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Papers */}
              <div className="mb-6">
                <h4 className="font-bold mb-2">Recent Papers</h4>
                <div className="space-y-2">
                  {selectedProfessor.recentPapers.map((paper, i) => (
                    <div key={i} className="p-3 bg-muted/50 border border-foreground/20">
                      <p className="font-medium text-sm">{paper.title}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span>{paper.year}</span>
                        <span>{paper.citations} citations</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="flex-1 brutal-button bg-primary text-primary-foreground">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>
                {selectedProfessor.website && (
                  <Button variant="outline" className="border-2 border-foreground">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}