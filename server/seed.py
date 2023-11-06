#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
import math

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
            username="Panther_1",
            pass_hash="pass_1",
            settings={"darkMode":True,"gameColors":{"inactive":"#292929","active":"#bababa","placed":"#ff3c00","miss":"#00c3ff","hit":"#003cff","text":"#ff3c00","background":"#141414"}}
        )
        me_ranking = Ranking(
            rating=999,
            user_id=1
        )

        usersAdd = [me,me_ranking]
        ratings_hold = [999]

        i = 2

        while i < 26:

            username = fake.simple_profile()["username"]

            darkModeRandom = fake.pybool()

            textColor = fake.hex_color()
            backgroundColor = fake.hex_color()

            inactiveColor = fake.hex_color()
            activeColor = fake.hex_color()
            placedColor = fake.hex_color()
            missColor = fake.hex_color()
            hitColor = fake.hex_color()

            ratingRandom = fake.pyint(10,950)



            user = User(
                username=f"{username}_{i}",
                pass_hash=f"pass_{i}",
                settings={"darkMode":darkModeRandom,"gameColors":{"inactive":inactiveColor,"active":activeColor,"placed":placedColor,"miss":missColor,"hit":hitColor,"text":textColor,"background":backgroundColor}}
            )
            usersAdd.append(user)
            user_ranking = Ranking(
                rating=ratingRandom,
                user_id=i
            )
            ratings_hold.append(ratingRandom)
            usersAdd.append(user_ranking)

            i += 1


        db.session.add_all(usersAdd)
        db.session.commit()
        gamesAdd = []

        i = 1

        while i < 350:

            challenger_hold = fake.pyint(1,25)
            challenged_hold = fake.pyint(1,25)
            turns_hold = fake.pyint(59,200)
            if challenged_hold == challenger_hold:
                if challenger_hold == 25:
                    challenger_hold = challenger_hold - 1
                if challenged_hold == 1:
                    challenger_hold = challenger_hold + 1
            challenger_rating = ratings_hold[challenger_hold - 1]
            challenged_rating = ratings_hold[challenged_hold - 1]
            rating_dif = abs(challenger_rating - challenged_rating)
            


            determineVictor = fake.pybool()

            victor_hold = 0
            loser_hold = 0
            victor_rating = 0
            loser_rating = 0

            if determineVictor:
                victor_hold = challenged_hold
                loser_hold = challenger_hold
                victor_rating = challenged_rating
                loser_rating = challenger_rating
            else:
                victor_hold = challenger_hold
                loser_hold = challenged_hold
                victor_rating = challenger_rating
                loser_rating = challenged_rating

            victor_rating_gain = 0
            loser_rating_loss = 0
            victor_higher_rating = victor_rating > loser_rating

            if victor_higher_rating:
                victor_rating_gain = int(rating_dif * ((math.sqrt(rating_dif)/pow(rating_dif,2)) * 10))
                loser_rating_loss = int(rating_dif * ((math.sqrt(2*rating_dif)/pow(rating_dif,2)) * 30))
            else:
                if rating_dif == 0:
                    rating_dif = 1
                    victor_rating_gain = int(rating_dif * (math.sqrt(pow(rating_dif,1.6))/rating_dif)+ 10)
                    loser_rating_loss = int(((math.sqrt(2*rating_dif)/pow(rating_dif,2)) * 30)/2)
                else:
                    victor_rating_gain = int(rating_dif * (math.sqrt(pow(rating_dif,1.6))/rating_dif)+ 10)
                    loser_rating_loss = int(pow(rating_dif,0.8))

            game = Game(
                status = "Over",
                victor = victor_hold,
                challenger_id = challenger_hold,
                challenged_id = challenged_hold,
                turns = turns_hold
            )

            gamesAdd.append(game)

            victory = Victory(
                victor = victor_hold,
                loser = loser_hold,
                rating_gain = victor_rating_gain,
                rating_loss = loser_rating_loss * -1,
                game_id = i
            )

            gamesAdd.append(victory)

            i += 1



        db.session.add_all(gamesAdd)
        db.session.commit()

        print("Finished seeding!")