'use strict';
class improCanvas {

    constructor(scene, imageSize) {
        this.imageSize = imageSize;
        this.imageHalf = this.imageSize / 2;
        this.drawing = Array(this.imageSize).fill(0).map(x => Array(this.imageSize).fill(0));
        this.curScene = scene;
        this.graphics = scene.add.graphics();
        this.x = game.canvas.width / 2;
        this.y = game.canvas.height / 2;
        this.creationTime = Date.now();
        this.hidden = false;
        this.locked = false;

        this.curScene.input.on('pointermove', function (pointer) {this.scene.canvas.onPointer(pointer, false)});
        this.curScene.input.on('pointerdown', function (pointer) {this.scene.canvas.onPointer(pointer, true)});

        this.modes = {
            DEFAULT: 'default',
            LIMIT: 'limit',
            ONE: 'one',
            BLIND: 'blind',
            FIGURES: 'figures',
            GROWING: 'growing'
        }

        this.pointer_mode = this.modes.DEFAULT;
    }
    
    onPointer(pointer, isPointerDown)
    {
        if (Date.now()-this.creationTime < 250) return;
        if (this.hidden || this.locked) return;
        //let pointer = this.curScene.input.activePointer;
        //pointer.getDuration();
        if (pointer.isDown)
        {
            //if (((pointer.worldX > (this.x - this.imageHalf)) && (pointer.worldX < (this.x + this.imageHalf))) && ((pointer.worldY > (this.y - this.imageHalf)) && (pointer.worldY < (this.y + this.imageHalf)))) { 
                //maybe check this later when implementing device pixel ratio
                let positions;
                if (isPointerDown) {
                    positions = [pointer];
                } else {
                    positions = pointer.getInterpolatedPosition(256);
                }    

                for (let k = 0; k < positions.length; k++)
                {
                    let drawX = Math.floor(positions[k].x - this.x + this.imageHalf);
                    let drawY = Math.floor(positions[k].y - this.y + this.imageHalf);
    
                    this.drawAt(drawX, drawY);
                }
            //}
        }
                
    }

    linearInterpolation(x0,y0,x1,y1,x) {
        return (((x-x0)*(y1-y0))/(x1-x0))+y0;
    }

    drawAt(x,y) {

        switch (this.pointer_mode) {
            case this.modes.LIMIT:
            break;
            case this.modes.ONE:
            break;
            case this.modes.BLIND:
            break;
            case this.modes.FIGURES:
            break;
            case this.modes.GROWING:
            break;
            case this.modes.DEFAULT:
            default:
                let size = 2;
                for (let i = x-size; i < x+size; i++)
                {
                    for (let j = y-size; j < y+size; j++)
                    {
                        if (i >= 0 && i < this.drawing.length && j >= 0 && j < this.drawing.length)
                        {
                            if (this.drawing[i][j] !== 1) this.drawing[i][j] = 1;
                        }
                    }
                }
            break;
        }
        
    }

    onUpdate() {
        if (this.hidden) return;
        //if middle position is different, update it
        if (this.x !== game.canvas.width / 2) this.x = game.canvas.width / 2;
        if (this.y !== game.canvas.height / 2) this.y = game.canvas.height / 2;

        this.graphics.clear();
        let sX = Math.floor(this.x - this.imageHalf);
        let sY = Math.floor(this.y - this.imageHalf);

        for (let i = 0; i < this.imageSize; i++) {
            for (let j = 0; j < this.imageSize; j++) {
                this.graphics.fillStyle(((this.drawing[i][j] == 0) ? 0xFFFFFF : 0x000000), 1.0);
                this.graphics.fillPoint(sX + i, sY + j);
            }
        }
    }

    toString() {
        let image_to_send = '';
        let partial_image = '';
        for (let i = 0; i < this.imageSize; i++) {
            for (let j = 0; j < this.imageSize / 4; j++) {
                for (let k = 0; k < 4; k++) {
                    partial_image += this.drawing[j * 4 + k][i];
                }
                image_to_send += parseInt(partial_image, 2).toString(16).toUpperCase();
                partial_image = '';
            }
        }
        return image_to_send;
    }

    loadDrawing(img) {
        let arr;

        for (let i = 0; i < this.drawing.length; i++) {
            for (let j = 0; j < this.drawing.length / 4; j++) {
                arr = parseInt(img[j + i * this.drawing.length / 4], 16).toString(2).padStart(4, '0');
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
    }
    clear() {
        this.drawing = Array(this.imageSize).fill(0).map(x => Array(this.imageSize).fill(0));
    }

    showCanvas() {
        this.hidden = false;
        this.unlockCanvas();
    }

    hideCanvas() {
        this.graphics.clear();
        this.hidden = true;
    }

    lockCanvas() {
        this.locked = true;
    }
    unlockCanvas() {
        this.locked = false;
    }

    setDrawMode(drawMode) {
        this.pointer_mode = drawMode;
    }

    static makeTexture(name, img, scene, size) {
        let texture = [];
        for (let i = 0; i < size; i++) {
            texture[i] = '';
            for (let j = 0; j < size / 4; j++) {
                let arr = parseInt(img[j + i * size / 4], 16).toString(2).padStart(4, '0');
                for (let k = 0; k < 4; k++) {
                    texture[i] += arr[k];
                }
            }
        }
        scene.textures.generate(name, { data: texture, pixelWidth: 1, palette: {0:'#ffffff', 1:'#000000'}}); 
    }
}