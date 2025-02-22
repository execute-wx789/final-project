"""empty message

Revision ID: 27fbd979d41c
Revises: 279eca00035c
Create Date: 2023-10-26 17:26:08.376609

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '27fbd979d41c'
down_revision = '279eca00035c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('gamerelations')
    with op.batch_alter_table('games', schema=None) as batch_op:
        batch_op.add_column(sa.Column('challenger_id', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('challenged_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(batch_op.f('fk_games_challenged_id_users'), 'users', ['challenged_id'], ['id'])
        batch_op.create_foreign_key(batch_op.f('fk_games_challenger_id_users'), 'users', ['challenger_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('games', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_games_challenger_id_users'), type_='foreignkey')
        batch_op.drop_constraint(batch_op.f('fk_games_challenged_id_users'), type_='foreignkey')
        batch_op.drop_column('challenged_id')
        batch_op.drop_column('challenger_id')

    op.create_table('gamerelations',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('relationship', sa.VARCHAR(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###
