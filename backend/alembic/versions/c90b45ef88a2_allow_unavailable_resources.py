"""Allow unavailable roadmap resources

Revision ID: c90b45ef88a2
Revises: b7a2f91d4a10
Create Date: 2026-05-12 00:00:01.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "c90b45ef88a2"
down_revision: Union[str, Sequence[str], None] = "b7a2f91d4a10"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column("resources", "url", existing_type=sa.String(), nullable=True)


def downgrade() -> None:
    op.alter_column("resources", "url", existing_type=sa.String(), nullable=False)
