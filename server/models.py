from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property

from config import db

# Models go here!

class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    _pass_hash = db.Column(db.String, unique=True)
    settings = db.Column(db.PickleType)

    rankings = db.relationship("Ranking", backref="user")

    serialize_rules = ("-rankings.user",)

    @hybrid_property
    def pass_hash(self):
        return self._pass_hash


    @pass_hash.setter
    def pass_hash(self,password):
        from config import bcrypt
        if type(password) is str:
            pass_hash = bcrypt.generate_password_hash(password.encode("utf-8"))
            self._pass_hash = pass_hash.decode("utf-8")
        else:
            raise ValueError("Invalid Password")

    def authenticate(self,password):
        from config import bcrypt
        return bcrypt.check_password_hash(self._pass_hash,password.encode("utf-8"))

class Game(db.Model, SerializerMixin):
    __tablename__ = "games"


    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String)
    victor = db.Column(db.Integer)

    challenger_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    challenged_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    challenger = db.relationship("User",foreign_keys=[challenger_id])
    challenged = db.relationship("User",foreign_keys=[challenged_id])

    victories = db.relationship("Victory", backref="game")

    serialize_rules = ("-challenger._pass_hash","-challenged._pass_hash","-victories.game",)

class Victory(db.Model, SerializerMixin):
    __tablename__ = "victories"


    id = db.Column(db.Integer, primary_key=True)
    victor = db.Column(db.Integer)
    loser = db.Column(db.Integer)
    rating_gain = db.Column(db.Integer)
    rating_loss = db.Column(db.Integer)

    game_id = db.Column(db.Integer, db.ForeignKey("games.id"))

    serialize_rules = ("-game.victories",)

class Ranking(db.Model, SerializerMixin):
    __tablename__ = "rankings"

    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    serialize_rules = ("-user.rankings","-user._pass_hash",)