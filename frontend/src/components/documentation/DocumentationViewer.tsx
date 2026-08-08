import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Cloud,
  Copy,
  Database,
  Download,
  FileCode,
  FileText,
  FolderTree,
  ListChecks,
  ListOrdered,
  Network,
  Printer,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  Timer,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { MermaidDiagram } from "@/components/diagrams/MermaidDiagram";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useDiagrams } from "@/hooks/useDiagrams";
import { documentationService } from "@/services/documentation.service";
import type {
  BlueprintApiEndpoint,
  BlueprintDatabaseTable,
  DocumentationData,
  FutureEnhancementItem,
  UseCaseItem,
} from "@/types";

interface SectionMeta {
  key: keyof DocumentationData;
  number: number;
  title: string;
  icon: LucideIcon;
  accent: "brand" | "violet" | "emerald" | "amber";
}

const SECTIONS: SectionMeta[] = [
  { key: "executive_summary", number: 1, title: "Executive Summary", icon: Target, accent: "brand" },
  { key: "project_vision", number: 2, title: "Project Vision", icon: BookOpen, accent: "brand" },
  { key: "functional_requirements", number: 3, title: "Functional Requirements", icon: ListChecks, accent: "emerald" },
  { key: "non_functional_requirements", number: 4, title: "Non-Functional Requirements", icon: Zap, accent: "amber" },
  { key: "user_roles", number: 5, title: "User Roles", icon: Users, accent: "violet" },
  { key: "use_cases", number: 6, title: "Use Cases", icon: ListOrdered, accent: "violet" },
  { key: "tech_stack", number: 7, title: "Tech Stack", icon: Wrench, accent: "brand" },
  { key: "database_tables", number: 8, title: "Database Design", icon: Database, accent: "violet" },
  { key: "api_endpoints", number: 9, title: "API Documentation", icon: ArrowLeftRight, accent: "emerald" },
  { key: "folder_structure", number: 10, title: "Folder Structure", icon: FolderTree, accent: "amber" },
  { key: "system_architecture_description", number: 11, title: "System Architecture", icon: Network, accent: "brand" },
  { key: "deployment_strategy", number: 12, title: "Deployment Strategy", icon: Cloud, accent: "violet" },
  { key: "development_timeline", number: 13, title: "Development Timeline", icon: Timer, accent: "amber" },
  { key: "future_enhancements", number: 14, title: "Future Enhancements", icon: Sparkles, accent: "emerald" },
];

export function DocumentationViewer({
  blueprintId,
  title: _title,
  data,
  isRegenerating,
  onRegenerate,
}: {
  blueprintId: number;
  title?: string;
  data: DocumentationData;
  isRegenerating: boolean;
  onRegenerate: () => Promise<void>;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const { byType: diagrams } = useDiagrams(blueprintId);

  const allCollapsed = useMemo(() => {
    return SECTIONS.every((sec) => collapsedSections[sec.key]);
  }, [collapsedSections]);

  const toggleAll = () => {
    if (allCollapsed) {
      setCollapsedSections({});
    } else {
      const next: Record<string, boolean> = {};
      SECTIONS.forEach((sec) => {
        next[sec.key] = true;
      });
      setCollapsedSections(next);
    }
  };

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const formatSectionText = (key: keyof DocumentationData, sectionTitle: string): string => {
    let content = `## ${sectionTitle}\n\n`;
    const val = data[key];
    if (!val) return content + "N/A";

    if (typeof val === "string") {
      content += val;
    } else if (Array.isArray(val)) {
      if (typeof val[0] === "string") {
        content += (val as string[]).map((i) => `- ${i}`).join("\n");
      } else if (key === "use_cases") {
        content += (val as UseCaseItem[])
          .map(
            (uc) =>
              `### ${uc.title}\n- **Actor**: ${uc.actor}\n- **Preconditions**: ${uc.preconditions}\n- **Steps**:\n${uc.main_flow.map((s, idx) => `  ${idx + 1}. ${s}`).join("\n")}\n- **Postconditions**: ${uc.postconditions}`
          )
          .join("\n\n");
      } else if (key === "database_tables") {
        content += (val as BlueprintDatabaseTable[])
          .map((tbl) => `### Table: \`${tbl.name}\`\n${tbl.purpose || ""}\nColumns: ${(tbl.columns || []).join(", ")}`)
          .join("\n\n");
      } else if (key === "api_endpoints") {
        content += (val as BlueprintApiEndpoint[])
          .map((ep) => `- \`${ep.method.toUpperCase()} ${ep.path}\`: ${ep.description || ""}`)
          .join("\n");
      } else if (key === "future_enhancements") {
        content += (val as FutureEnhancementItem[])
          .map((fe) => `- **${fe.title}** [${fe.impact} Impact]: ${fe.description}`)
          .join("\n");
      }
    }
    return content;
  };

  const handleCopySection = async (key: keyof DocumentationData, sectionTitle: string) => {
    const text = formatSectionText(key, sectionTitle);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(key as string);
      toast.success(`Copied "${sectionTitle}" to clipboard`);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch {
      toast.error("Failed to copy section text");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = (format: "markdown" | "html" | "pdf") => {
    const url = documentationService.getExportUrl(blueprintId, format);
    window.open(url, "_blank");
    toast.success(`Exporting documentation as ${format.toUpperCase()}`);
  };

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return SECTIONS;
    const q = searchQuery.toLowerCase();
    return SECTIONS.filter((sec) => {
      if (sec.title.toLowerCase().includes(q)) return true;
      const rawVal = JSON.stringify(data[sec.key] || "").toLowerCase();
      return rawVal.includes(q);
    });
  }, [searchQuery, data]);

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-300/80 bg-white/90 p-4 shadow-2xs backdrop-blur-md dark:border-stone-800/80 dark:bg-stone-900/90">
        <div className="flex flex-1 items-center gap-3 min-w-[240px]">
          <div className="relative w-full max-w-md">
            <Input
              placeholder="Search documentation sections or specs…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="size-4" />}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleAll}>
            {allCollapsed ? "Expand All" : "Collapse All"}
          </Button>

          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="size-4" />
            Print
          </Button>

          {/* Export Buttons */}
          <div className="flex items-center rounded-xl border border-stone-300/80 bg-stone-100/60 p-0.5 dark:border-stone-700/80 dark:bg-stone-800">
            <button
              onClick={() => handleDownload("pdf")}
              className="inline-flex items-center gap-1 px-2.5 py-1 font-mono text-xs font-semibold text-stone-700 hover:text-amber-600 dark:text-stone-300 dark:hover:text-amber-400"
              title="Download PDF"
            >
              <FileText className="size-3.5" />
              PDF
            </button>
            <span className="h-3.5 w-px bg-stone-300 dark:bg-stone-700" />
            <button
              onClick={() => handleDownload("markdown")}
              className="inline-flex items-center gap-1 px-2.5 py-1 font-mono text-xs font-semibold text-stone-700 hover:text-amber-600 dark:text-stone-300 dark:hover:text-amber-400"
              title="Download Markdown"
            >
              <FileCode className="size-3.5" />
              MD
            </button>
            <span className="h-3.5 w-px bg-stone-300 dark:bg-stone-700" />
            <button
              onClick={() => handleDownload("html")}
              className="inline-flex items-center gap-1 px-2.5 py-1 font-mono text-xs font-semibold text-stone-700 hover:text-amber-600 dark:text-stone-300 dark:hover:text-amber-400"
              title="Download HTML"
            >
              <Download className="size-3.5" />
              HTML
            </button>
          </div>

          <Button variant="secondary" size="sm" loading={isRegenerating} onClick={onRegenerate}>
            <RefreshCw className="size-4" />
            Regenerate
          </Button>
        </div>
      </div>

      {/* Main Layout: Sticky Sidebar TOC + Content Sections */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* TOC Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-20 space-y-1.5 rounded-2xl border border-stone-200/90 bg-white/90 p-4 shadow-2xs dark:border-stone-800/90 dark:bg-stone-900/90">
            <h4 className="mb-2.5 font-mono text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              [ TABLE OF CONTENTS ]
            </h4>
            <nav className="space-y-1 text-xs">
              {SECTIONS.map((sec) => (
                <a
                  key={sec.key}
                  href={`#sec-${sec.number}`}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 font-display text-xs font-medium text-stone-600 transition-all hover:bg-amber-500/10 hover:text-amber-700 dark:text-stone-400 dark:hover:bg-amber-400/10 dark:hover:text-amber-300"
                >
                  <span className="font-mono text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    {sec.number < 10 ? `0${sec.number}` : sec.number}.
                  </span>
                  <span className="truncate">{sec.title}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Sections Content */}
        <div className="space-y-5 lg:col-span-3">
          {filteredSections.map((sec) => {
            const isCollapsed = collapsedSections[sec.key];
            const Icon = sec.icon;

            return (
              <motion.div
                key={sec.key}
                id={`sec-${sec.number}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="overflow-hidden p-0 border border-stone-200/90 dark:border-stone-800/90">
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-3 p-4 bg-[#FAF7F2] dark:bg-[#141C16] border-b border-[#E6DFD5] dark:border-[#2B3D2F]">
                    <button
                      type="button"
                      onClick={() => toggleSection(sec.key as string)}
                      className="flex flex-1 items-center gap-3.5 text-left"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-[#C5D8C9] bg-[#E8F0EA] font-mono text-xs font-bold text-[#223829] dark:border-[#38503E] dark:bg-[#243226] dark:text-[#A3B5A7]">
                        {sec.number < 10 ? `0${sec.number}` : sec.number}
                      </span>
                      <Icon className="size-4.5 text-[#C05621] dark:text-[#E07A48] shrink-0" />
                      <h3 className="font-serif text-lg font-bold tracking-tight text-[#1F2421] dark:text-[#E6ECE7]">{sec.title}</h3>
                      {isCollapsed ? (
                        <ChevronRight className="size-4 text-[#6B726C] dark:text-[#A3B5A7] ml-auto" />
                      ) : (
                        <ChevronDown className="size-4 text-[#6B726C] dark:text-[#A3B5A7] ml-auto" />
                      )}
                    </button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopySection(sec.key, sec.title)}
                      className="text-xs shrink-0 font-mono"
                    >
                      {copiedSection === sec.key ? (
                        <Check className="size-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                      {copiedSection === sec.key ? "Copied" : "Copy"}
                    </Button>
                  </div>

                  {/* Card Body */}
                  {!isCollapsed && (
                    <div className="p-5 space-y-4 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                      {sec.key === "executive_summary" && (
                        <p>{data.executive_summary}</p>
                      )}

                      {sec.key === "project_vision" && (
                        <p>{data.project_vision}</p>
                      )}

                      {sec.key === "functional_requirements" && (
                        <ul className="space-y-2">
                          {(data.functional_requirements || []).map((req, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {sec.key === "non_functional_requirements" && (
                        <ul className="space-y-2">
                          {(data.non_functional_requirements || []).map((req, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {sec.key === "user_roles" && (
                        <div className="flex flex-wrap gap-2">
                          {(data.user_roles || []).map((role, i) => (
                            <Badge key={i} variant="brand">
                              <Users className="size-3" />
                              {role}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {sec.key === "use_cases" && (
                        <div className="space-y-4">
                          {(data.use_cases || []).map((uc, i) => (
                            <div key={i} className="rounded-xl border border-stone-200/90 bg-stone-100/40 p-4 dark:border-stone-800/90 dark:bg-stone-850/40 space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-display font-bold text-amber-700 dark:text-amber-400">{uc.title}</h4>
                                <Badge variant="neutral">Actor: {uc.actor}</Badge>
                              </div>
                              <p className="text-xs text-stone-600 dark:text-stone-400">
                                <strong>Preconditions:</strong> {uc.preconditions}
                              </p>
                              <div>
                                <strong className="text-xs text-stone-700 dark:text-stone-300">Main Flow:</strong>
                                <ol className="mt-1 space-y-1 text-xs text-stone-700 dark:text-stone-300 list-decimal list-inside font-mono">
                                  {(uc.main_flow || []).map((step, sIdx) => (
                                    <li key={sIdx}>{step}</li>
                                  ))}
                                </ol>
                              </div>
                              <p className="text-xs text-stone-600 dark:text-stone-400">
                                <strong>Postconditions:</strong> {uc.postconditions}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {sec.key === "tech_stack" && (
                        <div className="flex flex-wrap gap-2">
                          {(data.tech_stack || []).map((tech, i) => (
                            <span key={i} className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-xs font-semibold text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      {sec.key === "database_tables" && (
                        <div className="space-y-4">
                          {diagrams.database_er && (
                            <div className="mb-4">
                              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                                Database ER Diagram
                              </h4>
                              <MermaidDiagram code={diagrams.database_er.mermaid_code} />
                            </div>
                          )}
                          <div className="space-y-3">
                            {(data.database_tables || []).map((tbl, i) => (
                              <div key={i} className="rounded-xl border border-stone-200/90 bg-stone-100/40 p-3.5 dark:border-stone-800/90 dark:bg-stone-850/40">
                                <div className="flex items-center justify-between">
                                  <span className="font-mono font-bold text-sm text-stone-900 dark:text-stone-100">{tbl.name}</span>
                                  <span className="font-mono text-xs text-stone-500 dark:text-stone-400">{tbl.purpose}</span>
                                </div>
                                <div className="mt-2.5 flex flex-wrap gap-1.5">
                                  {(tbl.columns || []).map((col, cIdx) => (
                                    <span key={cIdx} className="rounded-md border border-stone-200 bg-white px-2 py-0.5 font-mono text-[11px] text-stone-700 shadow-2xs dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300">
                                      {col}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {sec.key === "api_endpoints" && (
                        <div className="space-y-4">
                          {diagrams.api_sequence && (
                            <div className="mb-4">
                              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                                API Sequence Diagram
                              </h4>
                              <MermaidDiagram code={diagrams.api_sequence.mermaid_code} />
                            </div>
                          )}
                          <div className="space-y-2.5">
                            {(data.api_endpoints || []).map((ep, i) => (
                              <div key={i} className="flex items-center gap-3 rounded-xl border border-stone-200/90 bg-stone-100/40 p-3.5 dark:border-stone-800/90 dark:bg-stone-850/40">
                                <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold text-white uppercase ${
                                  ep.method.toUpperCase() === 'GET' ? 'bg-sky-600' :
                                  ep.method.toUpperCase() === 'POST' ? 'bg-emerald-600' :
                                  ep.method.toUpperCase() === 'PUT' || ep.method.toUpperCase() === 'PATCH' ? 'bg-amber-600' : 'bg-rose-600'
                                }`}>
                                  {ep.method.toUpperCase()}
                                </span>
                                <span className="font-mono text-xs font-semibold text-stone-900 dark:text-stone-100">{ep.path}</span>
                                <span className="text-xs text-stone-500 dark:text-stone-400 ml-auto">{ep.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {sec.key === "folder_structure" && (
                        <pre className="overflow-x-auto rounded-xl border border-stone-300/70 bg-stone-950 p-4 font-mono text-xs leading-relaxed text-amber-300 dark:border-stone-800">
                          {Array.isArray(data.folder_structure) ? data.folder_structure.join("\n") : data.folder_structure}
                        </pre>
                      )}

                      {sec.key === "system_architecture_description" && (
                        <div className="space-y-4">
                          <p>{data.system_architecture_description}</p>
                          {diagrams.system_architecture && (
                            <div>
                              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                                System Architecture Diagram
                              </h4>
                              <MermaidDiagram code={diagrams.system_architecture.mermaid_code} />
                            </div>
                          )}
                        </div>
                      )}

                      {sec.key === "deployment_strategy" && (
                        <div className="space-y-4">
                          {diagrams.deployment && (
                            <div className="mb-4">
                              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                                Deployment Diagram
                              </h4>
                              <MermaidDiagram code={diagrams.deployment.mermaid_code} />
                            </div>
                          )}
                          <ul className="space-y-2">
                            {(data.deployment_strategy || []).map((dep, i) => (
                              <li key={i} className="flex items-start gap-2.5">
                                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500" />
                                <span>{dep}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {sec.key === "development_timeline" && (
                        <div className="space-y-4">
                          {diagrams.application_flowchart && (
                            <div className="mb-4">
                              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                                Workflow Flowchart
                              </h4>
                              <MermaidDiagram code={diagrams.application_flowchart.mermaid_code} />
                            </div>
                          )}
                          <ul className="space-y-2">
                            {(data.development_timeline || []).map((step, i) => (
                              <li key={i} className="flex items-start gap-2.5">
                                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500" />
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {sec.key === "future_enhancements" && (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {(data.future_enhancements || []).map((fe, i) => (
                            <div key={i} className="rounded-xl border border-stone-200/90 bg-stone-100/40 p-4 dark:border-stone-800/90 dark:bg-stone-850/40 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <h4 className="font-display font-bold text-sm text-stone-900 dark:text-stone-100">{fe.title}</h4>
                                <Badge variant={fe.impact === 'High' ? 'danger' : 'warning'}>
                                  {fe.impact} Impact
                                </Badge>
                              </div>
                              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">{fe.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
