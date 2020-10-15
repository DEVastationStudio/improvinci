"use strict";

//Phaser configuration
var config = {
    type: Phaser.AUTO,
    //width: window.innerWidth * window.devicePixelRatio,
    //height: window.innerHeight * window.devicePixelRatio,    
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
    scene: [sc_Preloader, sc_Menu, sc_Credits, sc_Options, sc_DrawAvatar, sc_Lobby, sc_InGame, sc_GameOver]
};


var game = new Phaser.Game(config);