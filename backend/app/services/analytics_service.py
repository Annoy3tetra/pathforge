from datetime import datetime, timezone, timedelta
from app.models.roadmap import Roadmap


def compute_analytics(roadmap: Roadmap) -> dict:
    """
    Compute comprehensive analytics for a single roadmap.
    Returns metrics including completion rate, speed, overdue milestones,
    estimated finish date, and a per-milestone productivity trend.
    """
    now = datetime.now(timezone.utc)
    created_at = roadmap.created_at
    if created_at and created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)

    milestones = sorted(roadmap.milestones, key=lambda m: m.id)
    total = len(milestones)

    if total == 0:
        return _empty_analytics()

    completed_milestones = [m for m in milestones if m.completed]
    completed_count = len(completed_milestones)
    remaining_count = total - completed_count

    # --- Completion rate ---
    completion_rate = round((completed_count / total) * 100, 1)

    # --- Estimated days ---
    total_estimated_days = sum(m.estimated_days for m in milestones)
    remaining_estimated_days = sum(
        m.estimated_days for m in milestones if not m.completed
    )
    elapsed_days = (now - created_at).days if created_at else 0

    # --- Average completion speed ---
    avg_days_per_milestone = (
        round(elapsed_days / completed_count, 1)
        if completed_count > 0
        else None
    )

    # --- Estimated finish date ---
    if avg_days_per_milestone and remaining_count > 0:
        est_remaining_actual_days = round(
            avg_days_per_milestone * remaining_count
        )
        estimated_finish_date = (
            now + timedelta(days=est_remaining_actual_days)
        ).strftime("%b %d, %Y")
    elif remaining_count == 0:
        estimated_finish_date = "Completed"
    else:
        estimated_finish_date = None

    # --- Overdue milestones ---
    # A milestone is overdue if cumulative expected days up to and including
    # that milestone have elapsed but it's still incomplete.
    overdue = []
    cumulative_days = 0
    for m in milestones:
        cumulative_days += m.estimated_days
        if not m.completed and elapsed_days > cumulative_days:
            overdue.append({
                "id": m.id,
                "title": m.title,
                "overdue_by": elapsed_days - cumulative_days
            })

    # --- Productivity trend (per-milestone data for charts) ---
    # Build a list of data points for completed milestones showing
    # expected vs actual cumulative days.
    trend = []
    cumulative_expected = 0
    for idx, m in enumerate(milestones):
        cumulative_expected += m.estimated_days
        entry = {
            "milestone": f"Step {idx + 1}",
            "title": m.title,
            "expected_day": cumulative_expected,
            "completed": m.completed,
        }
        if m.completed and m.completed_at:
            completed_at = m.completed_at
            if completed_at.tzinfo is None:
                completed_at = completed_at.replace(tzinfo=timezone.utc)
            actual_day = (completed_at - created_at).days
            entry["actual_day"] = actual_day
        else:
            entry["actual_day"] = None
        trend.append(entry)

    return {
        "completion_rate": completion_rate,
        "completed_milestones": completed_count,
        "remaining_milestones": remaining_count,
        "total_milestones": total,
        "elapsed_days": elapsed_days,
        "total_estimated_days": total_estimated_days,
        "remaining_estimated_days": remaining_estimated_days,
        "avg_days_per_milestone": avg_days_per_milestone,
        "estimated_finish_date": estimated_finish_date,
        "overdue_milestones": overdue,
        "productivity_trend": trend,
    }


def _empty_analytics() -> dict:
    return {
        "completion_rate": 0,
        "completed_milestones": 0,
        "remaining_milestones": 0,
        "total_milestones": 0,
        "elapsed_days": 0,
        "total_estimated_days": 0,
        "remaining_estimated_days": 0,
        "avg_days_per_milestone": None,
        "estimated_finish_date": None,
        "overdue_milestones": [],
        "productivity_trend": [],
    }
