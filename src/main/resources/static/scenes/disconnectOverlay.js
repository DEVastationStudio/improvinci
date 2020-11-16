'use strict';

class DisconnectOverlay extends Phaser.Scene {
    constructor() {
        super('DisconnectOverlay');
    }

    create() {
        this.textInfo = this.add.text(400, 150, 'CONNECTION LOST', {fontSize: '30px', fontFamily: 'Bookman', color: '#ff6600', stroke: '#000000', strokeThickness: 2, align: 'center'}).setOrigin(0.5, 0.5);
        this.disconnectButton = this.add.sprite(0,0,'');

        this.disconnectButton.setInteractive({cursor: 'pointer'});
        this.disconnectButton.on('pointerdown', function (event) {
            this.scene.start('Menu');
        }, this);
    }
    
    update() { 

    }
}