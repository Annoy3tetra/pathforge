import React from "react";
import { ExternalLink, Video, FileText, GraduationCap, BookOpen } from "lucide-react";

const TYPE_CONFIG = {
  video: {
    icon: Video,
    color: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    badge: "bg-rose-500/20 text-rose-400",
  },
  article: {
    icon: FileText,
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    badge: "bg-blue-500/20 text-blue-400",
  },
  course: {
    icon: GraduationCap,
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    badge: "bg-purple-500/20 text-purple-400",
  },
  docs: {
    icon: BookOpen,
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    badge: "bg-emerald-500/20 text-emerald-400",
  },
};

const DIFFICULTY_COLORS = {
  beginner: "text-emerald-400",
  intermediate: "text-amber-400",
  advanced: "text-rose-400",
};

export function ResourceCard({ resource }) {
  const config = TYPE_CONFIG[resource.type] || TYPE_CONFIG.article;
  const Icon = config.icon;

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] hover:shadow-md group ${config.color} bg-opacity-5 border-opacity-30 hover:bg-opacity-10`}
    >
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${config.badge}`}>
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
          {resource.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${config.badge} px-1.5 py-0.5 rounded`}>
            {resource.type}
          </span>
          {resource.difficulty && (
            <span className={`text-[10px] font-medium capitalize ${DIFFICULTY_COLORS[resource.difficulty] || "text-slate-400"}`}>
              {resource.difficulty}
            </span>
          )}
        </div>
      </div>

      <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-white shrink-0 transition-colors" />
    </a>
  );
}

export function ResourceList({ resources, filter }) {
  const filtered = filter === "all"
    ? resources
    : resources.filter((r) => r.type === filter);

  if (filtered.length === 0) {
    return (
      <p className="text-xs text-slate-500 italic py-2">
        No {filter === "all" ? "" : filter + " "}resources for this milestone.
      </p>
    );
  }

  return (
    <div className="space-y-2 mt-3">
      {filtered.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
}
