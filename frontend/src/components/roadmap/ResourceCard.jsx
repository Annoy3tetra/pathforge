import { memo, useMemo } from "react";
import { ExternalLink, Video, FileText, GraduationCap, BookOpen } from "lucide-react";
import { cn } from "../../lib/utils";

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

export const ResourceCard = memo(function ResourceCard({ resource }) {
  const config = TYPE_CONFIG[resource.type] || TYPE_CONFIG.article;
  const Icon = config.icon;

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl border transition-[border-color,background-color] duration-200 group glass hover:border-white/20",
        config.color,
        "bg-opacity-5"
      )}
    >
      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner", config.badge)}>
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-100 truncate group-hover:text-white transition-colors">
          {resource.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg", config.badge)}>
            {resource.type}
          </span>
          {resource.difficulty && (
            <span className={cn("text-[10px] font-bold uppercase tracking-widest", DIFFICULTY_COLORS[resource.difficulty] || "text-slate-500")}>
              {resource.difficulty}
            </span>
          )}
        </div>
      </div>

      <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-white shrink-0 transition-colors" />
    </a>
  );
});

export const ResourceList = memo(function ResourceList({ resources, filter }) {
  const filtered = useMemo(() => (
    filter === "all"
      ? resources
      : resources.filter((r) => r.type === filter)
  ), [filter, resources]);

  if (filtered.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-xs text-slate-500 font-medium italic">
          No {filter === "all" ? "" : filter + " "}resources found for this milestone.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      {filtered.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
});
