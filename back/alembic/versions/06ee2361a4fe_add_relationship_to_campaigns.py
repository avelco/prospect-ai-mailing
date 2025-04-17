"""add relationship to campaigns

Revision ID: 06ee2361a4fe
Revises: 2f1fa05b3921
Create Date: 2025-04-17 16:41:17.047776

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '06ee2361a4fe'
down_revision: Union[str, None] = '2f1fa05b3921'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('campaigns', sa.Column('product_id', sa.Integer(), nullable=False))
    op.create_foreign_key('campaigns_product_id_fkey', 'campaigns', 'products', ['product_id'], ['id'])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint('campaigns_product_id_fkey', 'campaigns', type_='foreignkey')
    op.drop_column('campaigns', 'product_id')
