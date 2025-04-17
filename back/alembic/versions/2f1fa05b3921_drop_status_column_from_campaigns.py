"""drop status column from campaigns

Revision ID: 2f1fa05b3921
Revises: d6f6611efd7f
Create Date: 2025-04-17 16:33:57.052130

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2f1fa05b3921'
down_revision: Union[str, None] = 'd6f6611efd7f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_column('campaigns', 'start_date')
    op.drop_column('campaigns', 'end_date')


def downgrade() -> None:
    """Downgrade schema."""
    op.add_column('campaigns', sa.Column('start_date', sa.DateTime(), nullable=True))
    op.add_column('campaigns', sa.Column('end_date', sa.DateTime(), nullable=True))
