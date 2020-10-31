"use strict";

class InGame extends Phaser.Scene {
    constructor() {
        super("InGame");
    }
    preload() {

    }

    create() {
        this.sent = false;
        this.randomize = true;
        this.canvas = new improCanvas(this);
        this.graphics = this.canvas.graphics;
        this.drawing = this.canvas.drawing;
        this.imageSize = this.canvas.imageSize;

        this.keyBoard = this.input.keyboard.addKeys({
            'M': Phaser.Input.Keyboard.KeyCodes.M,
            'J': Phaser.Input.Keyboard.KeyCodes.J,
            'N': Phaser.Input.Keyboard.KeyCodes.N,
            'L': Phaser.Input.Keyboard.KeyCodes.L,
            'I': Phaser.Input.Keyboard.KeyCodes.I
        });
    }

    update() {
        if (this.randomize) {
            this.canvas.onUpdate();
        }
        //Controls
        if (this.keyBoard.M.isDown) {
            let msg = new Object();
            msg.event = 'PRUEBA';
            game.global.socketDir.send(JSON.stringify(msg));
        }
        if (this.keyBoard.J.isDown) {
            let msg = new Object();
            msg.event = 'TRY_JOIN';
            game.global.socketDir.send(JSON.stringify(msg));
        }
        if (this.keyBoard.N.isDown) {
            let msg = new Object();
            msg.event = 'PEOPLE_IN_ROOM';
            game.global.socketDir.send(JSON.stringify(msg));
        }
        if (this.keyBoard.L.isDown) {
            let msg = new Object();
            msg.event = 'TRY_LEAVE';
            game.global.socketDir.send(JSON.stringify(msg));
        }
        if (this.keyBoard.I.isDown && !this.sent) {
            this.sent = true;
            let msg = new Object();
            msg.event = 'SEND_IMAGE';
            this.randomize = false;
            //Add image to message

            

            msg.image = this.canvas.toString();
            console.log("Sending " + msg.image);
            game.global.socketDir.send(JSON.stringify(msg));
        }
    }
    /*decodeImage(img) {

        var arr;

        for (let i = 0; i < this.drawing.length; i++) {
            for (let j = 0; j < this.drawing.length / 4; j++) {
                arr = parseInt(img[j + i * this.drawing.length / 4], 16).toString(2).padStart(4, "0");
                for (let k = 0; k < 4; k++) {
                    this.drawing[j * 4 + k][i] = arr[k];
                }
            }
        }

        this.graphics.clear();
        for (let i = 0; i < this.imageSize; i++) {
            for (let j = 0; j < this.imageSize; j++) {
                if (this.drawing[i][j] == 0) {
                    this.graphics.fillStyle(0xFFFFFF, 1.0);
                    this.graphics.fillPoint(i, j);
                }
                else {
                    this.graphics.fillStyle(0x000000, 1.0);
                    this.graphics.fillPoint(i, j);
                }

            }
        }
    }*/
}