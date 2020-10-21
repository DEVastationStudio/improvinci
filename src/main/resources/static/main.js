"use strict";

//Phaser configuration
var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'phaser-example',
        width: 800,
        height: 600
    },
    parent: "game",
    dom: {
        createContainer: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [Preloader, Menu, Credits, Options, DrawAvatar, Lobby, InGame, GameOver]
};


var game = new Phaser.Game(config);

game.global = {
}