# Spaceshooter.io

A canvas based multiplayer game made with typescript.  
Currently available on: <https://spaceshooter.sjoegd.me/>

## What it is

Spaceshooter.io is my first attempt of making a multiplayer javascript game.  
It was mostly designed to get hands on experience with canvas rendering, server hosting, physics engines, socket management, ... and to create an environment to train Deep RL Agents.

Now the last part was the actual main reason i started this project, but due to the lack of viable deep reinforcement learning libraries for javascript, i've decided to stop working on the project and switch to a new project made with python.

## How its made

To serve the game in a multiplier setting, the architecture used is a client-server model, where clients send requests to the server and the server handles everything.

This approach was used since i wanted to make sure every client had the same representation of the game at every single moment.

### Client

The client uses a basic React setup with a custom made Canvas renderer to provide the game visually.

It uses socket.io to connect to the server and through it, it can receive the current game render from the server and give inputs to the server, along with other useful messages.

### Server

To serve the game to clients through the web, the server needs two main functionalities:
-   Serving the static web content
-   Serving access to the game through sockets

To accomplish this, it uses two libraries called Express and socket.io
Express makes it extremely easy to serve static web content and socket.io is a very clean and useful socket library.

Now the actual game is fully run on the server, with a custom made wrapper around a physics engine called matter.js.

It uses a custom game loop, custom bodies and much much more.

To found out more about it, just look at the source code.

### Goal

The goal of this project was to create a game similar to popular .io games, but with the twist of providing an environment to train RL agents so that players can play against them.

I managed to get this working, but the reinforcement learning libraries i used just didn't provide what i wanted and actually training on a server running for multiplayer turned out to be not so great of an idea, since it had to be hosted on the cloud which resulted in terrible performance for the training.

Because of this i stopped working on the project, but i wouldn't say it is a failure, since it still provides a working multiplayer game.

### Author
Everything was made by Sjoegd
