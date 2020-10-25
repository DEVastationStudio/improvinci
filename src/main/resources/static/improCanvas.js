"use strict";
class improCanvas {
    imageSize = 256;
    imageHalf = this.imageSize / 2;
    drawing;
    curScene;
    graphics;
    x;
    y;

    constructor(scene) {
        this.drawing = Array(this.imageSize).fill(0).map(x => Array(this.imageSize).fill(0));
        this.curScene = scene;
        this.graphics = scene.add.graphics();
        this.x = game.canvas.width / 2;
        this.y = game.canvas.height / 2;
    }

    onPointer()
    {
        let pointer = this.curScene.input.activePointer;
        if (pointer.isDown)
        {
            if (((pointer.worldX > (this.x - this.imageHalf)) && (pointer.worldX < (this.x + this.imageHalf))) && ((pointer.worldY > (this.y - this.imageHalf)) && (pointer.worldY < (this.y + this.imageHalf)))) { 
                //maybe check this later when implementing device pixel ratio

                let positions = pointer.getInterpolatedPosition();

                for (let k = 0; k < positions.length; k++)
                {
                    let drawX = Math.floor(positions[k].x - this.x + this.imageHalf);
                    let drawY = Math.floor(positions[k].y - this.y + this.imageHalf);
    
                    let size = 3;
    
                    for (let i = drawX-size; i < drawX+size; i++)
                    {
                        for (let j = drawY-size; j < drawY+size; j++)
                        {
                            if (i >= 0 && i < this.drawing.length && j >= 0 && j < this.drawing.length)
                            {
                                if (this.drawing[i][j] !== 1) this.drawing[i][j] = 1;
                            }
                        }
                    }
                }

                
                /*if (this.drawing[drawX][drawY] !== 1) this.drawing[drawX][drawY] = 1;
                if (this.drawing[drawX+1][drawY] !== 1) this.drawing[drawX+1][drawY] = 1;
                if (this.drawing[drawX][drawY+1] !== 1) this.drawing[drawX][drawY+1] = 1;
                if (this.drawing[drawX-1][drawY] !== 1) this.drawing[drawX-1][drawY] = 1;
                if (this.drawing[drawX][drawY-1] !== 1) this.drawing[drawX][drawY-1] = 1;*/
            }
        }
                
    }
    onUpdate() {
        //if middle position is different, update it
        if (this.x !== game.canvas.width / 2) this.x = game.canvas.width / 2;
        if (this.y !== game.canvas.height / 2) this.y = game.canvas.height / 2;

        this.onPointer();

        this.graphics.clear();
        let sX = Math.floor(this.x - this.imageHalf);
        let sY = Math.floor(this.y - this.imageHalf);

        for (let i = 0; i < this.imageSize; i++) {
            for (let j = 0; j < this.imageSize; j++) {
                //this.drawing[i][j] = Math.floor(Math.random() * 2);

                this.graphics.fillStyle(((this.drawing[i][j] == 0) ? 0xFFFFFF : 0x000000), 1.0);
                this.graphics.fillPoint(sX + i, sY + j);
            }
        }
    }

    toString() {
        let image_to_send = "";
        let partial_image = "";
        for (let i = 0; i < this.imageSize; i++) {
            for (let j = 0; j < this.imageSize / 4; j++) {
                for (let k = 0; k < 4; k++) {
                    partial_image += this.drawing[j * 4 + k][i];
                }
                image_to_send += parseInt(partial_image, 2).toString(16).toUpperCase();
                partial_image = "";
            }
        }
        return image_to_send;
    }
}