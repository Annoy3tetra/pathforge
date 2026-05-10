import random
from collections import Counter
from datetime import datetime, timezone

def generate_insights(roadmaps, profile=None):
    if not roadmaps:
        return {
            "pace": "Start your first roadmap to unlock pace insights.",
            "consistency": "Complete a few milestones to see your consistency.",
            "domains": "We'll track your preferred topics here.",
            "suggestions": _fallback_suggestions(profile)
        }

    all_milestones = []
    for r in roadmaps:
        all_milestones.extend(r.milestones)
        
    completed_milestones = [m for m in all_milestones if m.completed and m.completed_at]
    
    if len(completed_milestones) < 2:
        return {
            "pace": "Complete a few more milestones to get pace insights.",
            "consistency": "Keep going! Consistency insights will appear soon.",
            "domains": "Exploring new topics? We'll analyze your trends here.",
            "suggestions": _fallback_suggestions(profile)
        }

    # 1. Pace Analysis
    # Compare actual days taken vs estimated days
    # (Assuming we have a way to roughly gauge time taken. If we don't have start time per milestone,
    # we can just look at estimated_days of completed milestones vs pending)
    short_completed = sum(1 for m in completed_milestones if m.estimated_days <= 5)
    long_completed = sum(1 for m in completed_milestones if m.estimated_days > 5)
    
    if short_completed > long_completed * 2:
        pace_insight = "You perform exceptionally well with shorter, focused milestones."
    elif long_completed > short_completed * 2:
        pace_insight = "You excel at tackling long-term, complex milestones."
    else:
        pace_insight = "You maintain a steady pace across both short and long milestones."

    # 2. Consistency Analysis
    # Look at recent activity
    now = datetime.now(timezone.utc)
    recent_completions = [m for m in completed_milestones if (now - m.completed_at.replace(tzinfo=timezone.utc)).days <= 7]
    
    if len(recent_completions) >= 3:
        consistency_insight = "Great momentum! You're highly active this week."
    elif len(recent_completions) > 0:
        consistency_insight = "You're making steady, consistent progress."
    else:
        consistency_insight = "It's been a while since your last milestone. Try completing one today!"

    # 3. Domain Analysis
    # Extract keywords from roadmap titles
    words = []
    for r in roadmaps:
        title_words = r.title.lower().replace('-', ' ').replace('_', ' ').split()
        words.extend([w for w in title_words if len(w) > 3])
        
    word_counts = Counter(words)
    common_words = [w[0] for w in word_counts.most_common(2) if w[0] not in ["learn", "guide", "roadmap", "basic", "advanced", "introduction"]]
    
    if common_words:
        domain_insight = f"You show a strong focus on learning paths related to {' and '.join(common_words).title()}."
    else:
        domain_insight = "You are exploring a diverse range of topics."

    return {
        "pace": pace_insight,
        "consistency": consistency_insight,
        "domains": domain_insight,
        "suggestions": _generate_suggestions(roadmaps, profile, common_words)
    }

def _fallback_suggestions(profile):
    if profile and profile.get("interests"):
        interests = profile["interests"]
        return {
            "topics": [f"Introduction to {i}" for i in interests[:3]],
            "skills": interests[:3]
        }
    return {
        "topics": ["Full-Stack Web Development", "Python Data Science", "Cloud Fundamentals"],
        "skills": ["JavaScript", "Python", "SQL"]
    }

def _generate_suggestions(roadmaps, profile, common_words):
    topics = []
    skills = []
    
    # Base suggestions on profile interests and career goal
    if profile:
        if profile.get("career_goal"):
            topics.append(f"Advanced {profile['career_goal']} concepts")
        if profile.get("interests"):
            skills.extend(profile["interests"][:2])
            
    # Base suggestions on common domains
    if common_words:
        for w in common_words:
            topics.append(f"{w.title()} Best Practices")
            skills.append(f"{w.title()} Tooling")
            
    # Fallback padding
    fallbacks = _fallback_suggestions(None)
    
    while len(topics) < 3:
        topics.append(random.choice(fallbacks["topics"]))
    while len(skills) < 3:
        skills.append(random.choice(fallbacks["skills"]))
        
    # Deduplicate and limit
    topics = list(dict.fromkeys(topics))[:3]
    skills = list(dict.fromkeys(skills))[:3]
    
    return {
        "topics": topics,
        "skills": skills
    }
