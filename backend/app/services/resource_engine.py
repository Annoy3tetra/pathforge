"""
Trusted roadmap resource matcher.

The AI model is allowed to create milestone topics, but it is not allowed to
invent URLs. This module maps topics to a curated set of stable public
resources and returns "Resource currently unavailable" when no trusted match
exists.
"""

RESOURCE_UNAVAILABLE = "Resource currently unavailable"


RESOURCE_CATALOG = [
    {
        "keywords": ["python", "python basics", "python programming"],
        "article": {
            "title": "Python Official Tutorial",
            "url": "https://docs.python.org/3/tutorial/",
            "type": "docs",
            "difficulty": "beginner",
        },
        "video": {
            "title": "Python Full Course - freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=rfscVS0vtbw",
            "type": "video",
            "difficulty": "beginner",
        },
    },
    {
        "keywords": ["javascript", "js", "ecmascript"],
        "article": {
            "title": "MDN JavaScript Guide",
            "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
            "type": "docs",
            "difficulty": "beginner",
        },
        "video": {
            "title": "JavaScript Full Course - freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=PkZNo7MFNFg",
            "type": "video",
            "difficulty": "beginner",
        },
    },
    {
        "keywords": ["html", "semantic html"],
        "article": {
            "title": "MDN HTML Basics",
            "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Basic_HTML_syntax",
            "type": "docs",
            "difficulty": "beginner",
        },
        "video": {
            "title": "HTML Full Course - freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=pQN-pnXPaVg",
            "type": "video",
            "difficulty": "beginner",
        },
    },
    {
        "keywords": ["css", "responsive design", "flexbox", "grid"],
        "article": {
            "title": "MDN CSS First Steps",
            "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics",
            "type": "docs",
            "difficulty": "beginner",
        },
        "video": {
            "title": "CSS Tutorial - freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=OXGznpKZ_sA",
            "type": "video",
            "difficulty": "beginner",
        },
    },
    {
        "keywords": ["react", "react hooks", "react components"],
        "article": {
            "title": "React Official Learn Docs",
            "url": "https://react.dev/learn",
            "type": "docs",
            "difficulty": "intermediate",
        },
        "video": {
            "title": "React Course - freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=bMknfKXIFA8",
            "type": "video",
            "difficulty": "intermediate",
        },
    },
    {
        "keywords": ["typescript", "ts"],
        "article": {
            "title": "TypeScript Handbook",
            "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
            "type": "docs",
            "difficulty": "intermediate",
        },
        "video": {
            "title": "TypeScript Course - freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=30LWjhZzg50",
            "type": "video",
            "difficulty": "intermediate",
        },
    },
    {
        "keywords": ["git", "github", "version control"],
        "article": {
            "title": "Git Handbook - GitHub Docs",
            "url": "https://docs.github.com/en/get-started/using-git/about-git",
            "type": "docs",
            "difficulty": "beginner",
        },
        "video": {
            "title": "Git and GitHub for Beginners - freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=RGOj5yH7evk",
            "type": "video",
            "difficulty": "beginner",
        },
    },
    {
        "keywords": ["sql", "database", "postgres", "postgresql"],
        "article": {
            "title": "PostgreSQL Official Tutorial",
            "url": "https://www.postgresql.org/docs/current/tutorial.html",
            "type": "docs",
            "difficulty": "beginner",
        },
        "video": {
            "title": "SQL Tutorial - freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=HXV3zeQKqGY",
            "type": "video",
            "difficulty": "beginner",
        },
    },
    {
        "keywords": ["fastapi", "api backend"],
        "article": {
            "title": "FastAPI Official Tutorial",
            "url": "https://fastapi.tiangolo.com/tutorial/",
            "type": "docs",
            "difficulty": "intermediate",
        },
        "video": {
            "title": "FastAPI Course - freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=0sOvCWFmrtA",
            "type": "video",
            "difficulty": "intermediate",
        },
    },
    {
        "keywords": ["node", "node.js", "express"],
        "article": {
            "title": "Node.js Official Learn Docs",
            "url": "https://nodejs.org/en/learn",
            "type": "docs",
            "difficulty": "intermediate",
        },
        "video": {
            "title": "Node.js and Express.js Course - freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=Oe421EPjeBE",
            "type": "video",
            "difficulty": "intermediate",
        },
    },
    {
        "keywords": ["machine learning", "ml", "ai"],
        "article": {
            "title": "Machine Learning Crash Course - Google",
            "url": "https://developers.google.com/machine-learning/crash-course",
            "type": "course",
            "difficulty": "intermediate",
        },
        "video": {
            "title": "Machine Learning for Everybody - freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=i_LwzRVP7bg",
            "type": "video",
            "difficulty": "beginner",
        },
    },
    {
        "keywords": ["data structures", "algorithms", "dsa"],
        "article": {
            "title": "GeeksforGeeks Data Structures",
            "url": "https://www.geeksforgeeks.org/data-structures/",
            "type": "article",
            "difficulty": "intermediate",
        },
        "video": {
            "title": "Data Structures Easy to Advanced Course - freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=RBSGKlAvoiM",
            "type": "video",
            "difficulty": "intermediate",
        },
    },
    {
        "keywords": ["docker", "containers", "containerization"],
        "article": {
            "title": "Docker Official Get Started Guide",
            "url": "https://docs.docker.com/get-started/",
            "type": "docs",
            "difficulty": "intermediate",
        },
        "video": {
            "title": "Docker Tutorial for Beginners - freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=fqMOX6JJhGo",
            "type": "video",
            "difficulty": "beginner",
        },
    },
    {
        "keywords": ["kubernetes", "k8s"],
        "article": {
            "title": "Kubernetes Official Tutorials",
            "url": "https://kubernetes.io/docs/tutorials/",
            "type": "docs",
            "difficulty": "advanced",
        },
        "video": {
            "title": "Kubernetes Course - freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=d6WC5n9G_sM",
            "type": "video",
            "difficulty": "advanced",
        },
    },
    {
        "keywords": ["cybersecurity", "security", "web security"],
        "article": {
            "title": "OWASP Web Security Testing Guide",
            "url": "https://owasp.org/www-project-web-security-testing-guide/",
            "type": "docs",
            "difficulty": "intermediate",
        },
        "video": {
            "title": "Cyber Security Full Course - freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=U_P23SqJaDc",
            "type": "video",
            "difficulty": "beginner",
        },
    },
    {
        "keywords": ["java"],
        "article": {
            "title": "Java Tutorials - Oracle",
            "url": "https://docs.oracle.com/javase/tutorial/",
            "type": "docs",
            "difficulty": "beginner",
        },
        "video": {
            "title": "Java Programming for Beginners - freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=A74TOX803D0",
            "type": "video",
            "difficulty": "beginner",
        },
    },
    {
        "keywords": ["c++", "cpp"],
        "article": {
            "title": "C++ Tutorial - GeeksforGeeks",
            "url": "https://www.geeksforgeeks.org/cpp/cpp-tutorial/",
            "type": "article",
            "difficulty": "beginner",
        },
        "video": {
            "title": "C++ Tutorial for Beginners - freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=vLnPwxZdW4Y",
            "type": "video",
            "difficulty": "beginner",
        },
    },
    {
        "keywords": ["computer science", "cs50", "cs fundamentals"],
        "article": {
            "title": "CS50x Official Course",
            "url": "https://cs50.harvard.edu/x/",
            "type": "course",
            "difficulty": "beginner",
        },
        "video": {
            "title": "CS50x Lectures Playlist",
            "url": "https://www.youtube.com/playlist?list=PLhQjrBD2T383Xfn0zECHrOTpfOSlptPAB",
            "type": "video",
            "difficulty": "beginner",
        },
    },
]


def build_resources_for_topic(topic: str, description: str = "") -> list[dict]:
    match = _find_best_match(f"{topic} {description}")
    if not match:
        return [
            _unavailable_resource("article"),
            _unavailable_resource("video"),
        ]

    return [
        {**match["article"], "reason": _reason(topic)},
        {**match["video"], "reason": _reason(topic)},
    ]


def attach_trusted_resources(milestones: list[dict]) -> list[dict]:
    enriched = []
    for milestone in milestones:
        enriched.append({
            **milestone,
            "resources": build_resources_for_topic(
                milestone.get("title", ""),
                milestone.get("description", ""),
            ),
        })
    return enriched


def _find_best_match(text: str) -> dict | None:
    normalized = text.lower()
    best_match = None
    best_score = 0

    for entry in RESOURCE_CATALOG:
        score = sum(1 for keyword in entry["keywords"] if keyword in normalized)
        if score > best_score:
            best_match = entry
            best_score = score

    return best_match


def _unavailable_resource(resource_type: str) -> dict:
    return {
        "title": RESOURCE_UNAVAILABLE,
        "url": None,
        "type": resource_type,
        "difficulty": None,
        "reason": "No trusted public resource is currently mapped for this exact topic.",
    }


def _reason(topic: str) -> str:
    clean_topic = topic.strip() or "this topic"
    return f"Selected from PathForge's trusted catalog because it directly supports {clean_topic}."
