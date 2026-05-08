from app.models.roadmap import Roadmap
from app.models.milestone import Milestone


def calculate_progress(roadmap: Roadmap):
    total = len(roadmap.milestones)

    if total == 0:
        return 0

    completed = sum(
        milestone.completed
        for milestone in roadmap.milestones
    )

    progress = (completed / total) * 100

    return round(progress, 2)


def roadmap_status(progress: float):
    if progress == 100:
        return "Completed"

    if progress >= 60:
        return "On Track"

    if progress >= 30:
        return "In Progress"

    return "Just Started"