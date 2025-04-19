"""add status to participant

Revision ID: bb154240113d
Revises: 06ee2361a4fe
Create Date: 2025-04-18 20:35:29.459454

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bb154240113d'
down_revision: Union[str, None] = '06ee2361a4fe'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('participants', sa.Column('status', sa.String(), nullable=False))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('participants', 'status')
