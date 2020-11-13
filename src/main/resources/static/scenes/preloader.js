'use strict';

class Preloader extends Phaser.Scene {


    constructor() {
        super('Preloader');
    }
    preload() {
    	this.load.image('Menu', 'assets/backgrounds/Menu.png');
    	this.load.image('KeyBoardBg', 'assets/backgrounds/KeyBoardBg.png');
		this.load.image('ConfirmarCod', 'assets/backgrounds/Confirmar.png');
    	this.load.image('SalirCod', 'assets/backgrounds/Salir.png');
    	this.load.image('BarraCod', 'assets/backgrounds/BarraCodigo.png');
    	this.load.image('BorrarCod', 'assets/backgrounds/Borrar.png');
		this.load.image('Gameplay', 'assets/backgrounds/Gameplay.png');
    	this.load.image('Caballete_gameplay', 'assets/interface/Caballete_gameplay.png');
    	this.load.image('Ready_es', 'assets/interface/Ready_es.png');
    	this.load.image('Ready_en', 'assets/interface/Ready_en.png');
    	this.load.image('Ready_host_es', 'assets/interface/Ready_host_es.png');
    	this.load.image('Ready_host_en', 'assets/interface/Ready_host_en.png');
    	this.load.image('Ronda_es', 'assets/interface/Ronda_es.png');
    	this.load.image('Ronda_es', 'assets/interface/Ronda_en.png');
    	this.load.image('Corona', 'assets/interface/Corona.png');
    	this.load.image('Marco1', 'assets/interface/Marco1.png');
    	this.load.image('Marco2', 'assets/interface/Marco2.png');
    	this.load.image('Marco3', 'assets/interface/Marco3.png');
		this.load.image('Marco4', 'assets/interface/Marco4.png');
		//letras teclado
    	this.load.image('Letra_A', 'assets/backgrounds/letras/A.png');
    	this.load.image('Letra_B', 'assets/backgrounds/letras/B.png');
    	this.load.image('Letra_C', 'assets/backgrounds/letras/C.png');
    	this.load.image('Letra_D', 'assets/backgrounds/letras/D.png');
    	this.load.image('Letra_E', 'assets/backgrounds/letras/E.png');
    	this.load.image('Letra_F', 'assets/backgrounds/letras/F.png');
    	this.load.image('Letra_G', 'assets/backgrounds/letras/G.png');
    	this.load.image('Letra_H', 'assets/backgrounds/letras/H.png');
    	this.load.image('Letra_I', 'assets/backgrounds/letras/I.png');
    	this.load.image('Letra_J', 'assets/backgrounds/letras/J.png');
    	this.load.image('Letra_K', 'assets/backgrounds/letras/K.png');
    	this.load.image('Letra_L', 'assets/backgrounds/letras/L.png');
    	this.load.image('Letra_M', 'assets/backgrounds/letras/M.png');
    	this.load.image('Letra_N', 'assets/backgrounds/letras/N.png');
    	this.load.image('Letra_O', 'assets/backgrounds/letras/O.png');
		this.load.image('Letra_P', 'assets/backgrounds/letras/P.png');
    }

    create() {
        this.input.on('pointerdown', function(pointer){
            this.scene.scene.start('Menu');
        });
    }
    
    update() { 

    }
}