#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from flask import jsonify
from faker import Faker

# Local imports
from app import app
from models import db, User, Game, Victory, Ranking

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        Game.query.delete()
        User.query.delete()
        Victory.query.delete()
        Ranking.query.delete()
        # Seed code goes here!

        me = User(
            username="Panther",
            pass_hash="notMYpass",
            settings={"darkMode":True,"gameColors":{"inactive":"#292929","active":"#bababa","placed":"#ff3c00","miss":"#00c3ff","hit":"#003cff","text":"#ff3c00","background":"#141414"}}
        )
        me_ranking = Ranking(
            rating=730,
            user_id=1
        )

        usersAdd = [me,me_ranking]

        i = 2

        while i < 25:

            user = User(
                username=f"testuser{i}",
                pass_hash=f"testpass{i}",
                settings={"darkMode":False,"gameColors":{"inactive":"#696969","active":"#ffffff","placed":"#1e90ff","miss":"#ffd700","hit":"#ff0000","text":"#ffffff","background":"#858585"}}
            )
            usersAdd.append(user)
            user_ranking = Ranking(
                rating=90,
                user_id=i
            )
            usersAdd.append(user_ranking)

            i += 1


        db.session.add_all(usersAdd)
        db.session.commit()

        gameTest = Game(
            status = "Over",
            victor = 1,
            challenger_id = 1,
            challenged_id = 2
        )

        db.session.add(gameTest)
        db.session.commit()

        victoryTest = Victory(
            victor = 1,
            loser = 2,
            rating_gain = 10,
            rating_loss = -10,
            game_id = 1
        )

        db.session.add(victoryTest)
        db.session.commit()

        print("Finished seeding!")