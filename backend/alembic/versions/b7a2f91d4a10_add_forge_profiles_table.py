"""Add forge_profiles table

Revision ID: b7a2f91d4a10
Revises: 2354f79b40c0
Create Date: 2026-05-12 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "b7a2f91d4a10"
down_revision: Union[str, Sequence[str], None] = "2354f79b40c0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "forge_profiles",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("current_skill_level", sa.String(), nullable=True),
        sa.Column("career_goal", sa.String(), nullable=True),
        sa.Column("preferred_domains", sa.JSON(), nullable=True),
        sa.Column("weekly_study_hours", sa.Float(), nullable=True),
        sa.Column("preferred_learning_style", sa.String(), nullable=True),
        sa.Column("biggest_learning_struggle", sa.String(), nullable=True),
        sa.Column("motivation_type", sa.String(), nullable=True),
        sa.Column("preferred_project_type", sa.String(), nullable=True),
        sa.Column("confidence_level", sa.Integer(), nullable=True),
        sa.Column("target_timeline", sa.String(), nullable=True),
        sa.Column("preferred_resource_format", sa.String(), nullable=True),
        sa.Column("interests", sa.JSON(), nullable=True),
        sa.Column("current_focus", sa.String(), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id"),
    )
    op.create_index(op.f("ix_forge_profiles_id"), "forge_profiles", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_forge_profiles_id"), table_name="forge_profiles")
    op.drop_table("forge_profiles")
