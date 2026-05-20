import { memo, useMemo } from "react";
import { ExternalLink, Video, FileText, GraduationCap, BookOpen } from "lucide-react";
import { cn } from "../../lib/utils";

const TYPE_CONFIG = {
  video: {
    icon: Video,
    color: "border-rose-200",
    badge: "bg-rose-50 text-rose-600",
  },
  article: {
    icon: FileText,
    color: "border-blue-200",
    badge: "bg-blue-50 text-blue-600",
  },
  course: {
    icon: GraduationCap,
    color: "border-violet-200",
    badge: "bg-violet-50 text-violet-600",
  },
  docs: {
    icon: BookOpen,
    color: "border-emerald-200",
    badge: "bg-emerald-50 text-emerald-600",
  },
};

const DIFFICULTY_COLORS = {
  beginner: "text-emerald-600",
  intermediate: "text-amber-600",
  advanced: "text-rose-600",
};

export const ResourceCard = memo(function ResourceCard({ resource }) {
  const config = TYPE_CONFIG[resource.type] || TYPE_CONFIG.article;
  const Icon = config.icon;
  const unavailable = !resource.url;
  const content = (
    <>
      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", config.badge)}>
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-semibold truncate transition-colors",
          unavailable ? "text-slate-400 italic" : "text-slate-700 group-hover:text-slate-900"
        )}>
          {resource.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md", config.badge)}>
            {resource.type}
          </span>
          {resource.difficulty && (
            <span className={cn("text-[10px] font-semibold uppercase tracking-wider", DIFFICULTY_COLORS[resource.difficulty] || "text-slate-400")}>
              {resource.difficulty}
            </span>
          )}
        </div>
      </div>

      {!unavailable && <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 shrink-0 transition-colors" />}
    </>
  );

  if (unavailable) {
    return (
      <div className={cn("flex items-center gap-3 p-3 rounded-xl border bg-slate-50 text-slate-400", config.color)}>
        {content}
      </div>
    );
  }

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 group bg-white hover:shadow-sm",
        config.color,
        "hover:border-indigo-200"
      )}
    >
      {content}
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
        <p className="text-xs text-slate-400 font-medium italic">
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
