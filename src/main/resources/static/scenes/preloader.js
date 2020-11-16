'use strict';

class Preloader extends Phaser.Scene {


    constructor() {
        super('Preloader');
    }
    preload() {
    	this.load.image('Menu', 'assets/backgrounds/Menu.png');
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
		this.load.image('CriticoLejos', 'assets/character/critico_lejos.png');

		//GameMode Icons
		//this.load.image('iconoDefault', 'assets/gamemodes/.png');
		this.load.image('iconoBlind', 'assets/gamemodes/iconoBlind.png');
		this.load.image('iconoLimit', 'assets/gamemodes/iconoLimit.png');
		this.load.image('iconoOne', 'assets/gamemodes/iconoOne.png');
		this.load.image('iconoGrowing', 'assets/gamemodes/iconoGrowing.png');
		
		//keyboard
		this.load.image('ConfirmarCod', 'assets/backgrounds/Confirmar.png');
    	this.load.image('SalirCod', 'assets/backgrounds/Salir.png');
    	this.load.image('BarraCod', 'assets/backgrounds/BarraCodigo.png');
    	this.load.image('BorrarCod', 'assets/backgrounds/Borrar.png');
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

		//menu Configuración
		this.load.image('Daily', 'assets/backgrounds/Configuracion/Daily.png');
		this.load.image('Blind', 'assets/backgrounds/Configuracion/Blind.png');
		this.load.image('Default', 'assets/backgrounds/Configuracion/Default.png');
		this.load.image('Dificil', 'assets/backgrounds/Configuracion/Dificil.png');
		this.load.image('Facil', 'assets/backgrounds/Configuracion/Facil.png');
		this.load.image('Growing', 'assets/backgrounds/Configuracion/Growing.png');
		this.load.image('Limit', 'assets/backgrounds/Configuracion/Limit.png');
		this.load.image('Modos', 'assets/backgrounds/Configuracion/Modos.png');
		this.load.image('NumRondas', 'assets/backgrounds/Configuracion/NumRondas.png');
		this.load.image('One', 'assets/backgrounds/Configuracion/One.png');
		this.load.image('Ronda', 'assets/backgrounds/Configuracion/Ronda.png');
		this.load.image('Tiempos', 'assets/backgrounds/Configuracion/Tiempos.png');
		this.load.image('Votacion', 'assets/backgrounds/Configuracion/Votacion.png');
		this.load.image('Mas', 'assets/backgrounds/Configuracion/Mas.png');
		this.load.image('Menos', 'assets/backgrounds/Configuracion/Menos.png');
		this.load.image('TickNoCheck', 'assets/backgrounds/Configuracion/TickNoCheck.png');
		this.load.image('TickCheck', 'assets/backgrounds/Configuracion/TickCheck.png');


    }

    create() {
        this.input.on('pointerdown', function(pointer){
            this.scene.scene.start('Menu');
        });
    }
    
    update() { 

    }
}