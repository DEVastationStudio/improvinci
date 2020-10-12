"use strict";

var sc_Preloader = new Phaser.Scene("sc_Preloader");

sc_Preloader.preload = function()
{
    //this.load.image("sample", "../assets/sample.png");
    //this.load.spritesheet('sample2', '../assets/sample2.png', { frameWidth: 40, frameHeight: 120 });

}

sc_Preloader.create = function()
{      
    sc_Preloader.input.on('pointerdown', function(pointer){
        sc_Preloader.scene.start("sc_InGame");
     });
}

sc_Preloader.update = function()
{

}