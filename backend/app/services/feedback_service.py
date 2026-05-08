from datetime import datetime, timezone
from app.models.roadmap import Roadmap

def evaluate_pace(roadmap: Roadmap) -> dict:
    if not roadmap.created_at:
        return {
            "status": "Unknown",
            "recommendation": "Unable to determine pace.",
            "actual_days": 0,
            "expected_days": 0
        }
        
    now = datetime.now(timezone.utc)
    created_at = roadmap.created_at
    if created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)
        
    actual_days = (now - created_at).days
    
    # Sort milestones by id to determine the sequence
    sorted_milestones = sorted(roadmap.milestones, key=lambda m: m.id)
    
    expected_days_so_far = 0
    all_completed = True
    
    for m in sorted_milestones:
        expected_days_so_far += m.estimated_days
        if not m.completed:
            all_completed = False
            break
            
    if expected_days_so_far == 0:
        return {
            "status": "Just Started",
            "recommendation": "Start tackling your first milestone!",
            "actual_days": actual_days,
            "expected_days": 0
        }
        
    if all_completed:
        return {
            "status": "Completed",
            "recommendation": f"You finished the entire roadmap in {actual_days} days!",
            "actual_days": actual_days,
            "expected_days": expected_days_so_far
        }

    if actual_days <= expected_days_so_far * 0.8:
        status = "Ahead of Schedule"
        recommendation = "You are progressing faster than expected. Keep up the momentum!"
    elif actual_days <= expected_days_so_far * 1.1:
        status = "On Track"
        recommendation = "You are right on schedule. Steady progress is key!"
    elif actual_days <= expected_days_so_far * 1.3:
        status = "Slightly Behind"
        recommendation = "You may need to dedicate a few more hours this week."
    else:
        status = "Significantly Behind"
        recommendation = "Consider revising your timeline or reviewing previous concepts."
        
    return {
        "status": status,
        "recommendation": recommendation,
        "actual_days": actual_days,
        "expected_days": expected_days_so_far
    }
