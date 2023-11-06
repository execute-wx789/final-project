#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, jsonify, make_response, session
from flask_restful import Resource
from flask_socketio import emit, SocketIO,send

# Local imports
from config import app, db, api
from models import User, Game, Victory, Ranking
import math
# Add your model imports

socketio = SocketIO(app,cors_allowed_origins="*")

# Views go here!

connectedUsers = []

class Login(Resource):
    def post(self):
        user = User.query.filter_by(username=request.json["username"]).one_or_none()
        password = request.json["password"]
        if user and user.authenticate(password):
            session["user_id"] = user.id
            return make_response(user.to_dict(rules=("-_pass_hash",)),201)
        else:
            return make_response("password or username wrong",400)

api.add_resource(Login, "/login")

class Logout(Resource):
    def delete(self):
        session["user_id"] = None
        return make_response("",204)

api.add_resource(Logout, "/logout")

class AutoLogin(Resource):
    def get(self):
        if session["user_id"]:
            user_hold = User.query.filter_by(id=session["user_id"]).one_or_none()
            if user_hold:
                return make_response(user_hold.to_dict(rules=("-_pass_hash",)),200)
            else:
                return make_response("User Not Found",404)
        else:
            return make_response("",204)

api.add_resource(AutoLogin, "/autologin")

class UserList(Resource):
    def get(self):
        return_list = [u.to_dict(rules=("-_pass_hash",)) for u in User.query.all()]
        return make_response(return_list,200)
    def post(self):
        data = request.get_json()
        try:
            user_hold = User(
                username = data["username"],
                pass_hash = data["password"],
                settings = {"darkMode":False,"gameColors":{"inactive":"#696969","active":"#ffffff","placed":"#1e90ff","miss":"#ffd700","hit":"#ff0000","text":"#ffffff","background":"#858585"}}
            )
            db.session.add(user_hold)
            db.session.commit()
            session["user_id"] = user_hold.id
            return make_response(user_hold.to_dict(rules=("-_pass_hash",)),201)
        except:
            return make_response("Failure to create user, server error",400)

class UserByID(Resource):
    def get(self,id):
        user_hold = User.query.filter_by(id=id).one_or_none()
        if not user_hold:
            return make_response("User not Found",404)
        return make_response(user_hold.to_dict(rules=("-_pass_hash",)),200)
    def patch(self,id):
        user_hold = User.query.filter_by(id=id).one_or_none()
        if not user_hold:
            return make_response("User not Found",404)
        try:
            data = request.get_json()
            for attr in data:
                setattr(user_hold,attr,data[attr])
            db.session.add(user_hold)
            db.session.commit()
            return make_response(user_hold.to_dict(rules=("-_pass_hash",)),202)
        except:
            return make_response("Failed to update user",400)

api.add_resource(UserList, "/users")
api.add_resource(UserByID, "/users/<int:id>")

class GameList(Resource):
    def get(self):
        return_list = [g.to_dict() for g in Game.query.all()]
        return make_response(return_list,200)
    def post(self):
        data = request.get_json()
        try:
            game_hold = Game(
                status = "Ongoing", 
                victor = 0, 
                challenger_id = data["challenger_id"],
                challenged_id = data["challenged_id"]
            )
            db.session.add(game_hold)
            db.session.commit()
            return make_response(game_hold.to_dict(),201)
        except:
            return make_response("Failure to start game, server error",400)

class GameByID(Resource):
    def patch(self,id):
        game_hold = Game.query.filter_by(id=id).one_or_none()
        if not game_hold:
            return make_response("Game not Found",404)
        try:
            data = request.get_json()
            for attr in data:
                setattr(game_hold,attr,data[attr])
            db.session.add(game_hold)
            db.session.commit()
            return make_response(game_hold.to_dict(),202)
        except:
            return make_response("Failed to update game",400)

api.add_resource(GameList, "/games")
api.add_resource(GameByID, "/games/<int:id>")

class VictoryList(Resource):
    def get(self):
        return_list = [v.to_dict() for v in Victory.query.all()]
        return make_response(return_list,200)
    def post(self):
        data = request.get_json()
        try:
            victor_hold = Ranking.query.filter_by(id=data["victor"]).one_or_none()
            loser_hold = Ranking.query.filter_by(id=data["loser"]).one_or_none()
            if not victor_hold or not loser_hold:
                return make_response("Failed to find users in fight",404)
            rating_dif = abs(victor_hold.rating-loser_hold.rating)
            victor_rating_gain = 0
            loser_rating_loss = 0
            victor_higher_rating = victor_hold.rating > loser_hold.rating

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
            if victor_rating_gain + victor_hold.rating > 999:
                victor_rating_gain = 999 - victor_hold.rating
            if loser_rating_loss + loser_hold.rating < 1:
                loser_rating_loss = loser_hold.rating - 1

            victory_hold = Victory(
                victor = data["victor"],
                loser = data["loser"],
                game_id = data["game_id"],
                rating_gain = victor_rating_gain,
                rating_loss = loser_rating_loss * -1
            )
            setattr(victor_hold,"rating",victor_hold.rating+victor_rating_gain)
            setattr(loser_hold,"rating",loser_hold.rating-loser_rating_loss)


            db.session.add(victory_hold)
            db.session.add(victor_hold)
            db.session.add(loser_hold)
            db.session.commit()

            return make_response(victory_hold.to_dict(),201)
        except:
            return make_response("Failure to finish game, server error",400)

api.add_resource(VictoryList, "/victories")

class RankingList(Resource):
    def get(self):
        return_list = [r.to_dict(rules=("-user.settings",)) for r in Ranking.query.all()]
        return make_response(return_list,200)

api.add_resource(RankingList, "/rankings")

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

@socketio.on("disconnect")
def handleDisconnect():
    for user in connectedUsers:
        if user["sid"] == request.sid:
            connectedUsers.remove(user)
        send({"message_type":2,"data":connectedUsers},broadcast=True)

@socketio.on("message")
def handleMessage(msg):
    if msg["message_type"] == 2:
        addUser = True
        for user in connectedUsers:
            if user["id"] == msg["data"]["id"]:
                addUser = False
        if addUser:
            userToAdd = {
                "id":msg["data"]["id"],
                "username":msg["data"]["username"],
                "userColor":msg["data"]["userColor"],
                "sid":request.sid
            }
            connectedUsers.append(userToAdd)
        send({"message_type":2,"data":connectedUsers},broadcast=True)
        return None
    send(msg,broadcast=True)
    return None

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5555)

