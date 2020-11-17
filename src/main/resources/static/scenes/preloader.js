'use strict';

class Preloader extends Phaser.Scene {


    constructor() {
        super('Preloader');
    }
    preload() {

		//Loading bar
		this.progressBar = this.add.graphics();
		this.progressBox = this.add.graphics();

		this.progressBox.fillStyle(0x222222, 0.8);
		this.progressBox.fillRect(game.canvas.width/4, game.canvas.height*4/9, game.canvas.width/2, game.canvas.height/9);

		this.loadingText = this.make.text({ x:game.canvas.width/2, y:game.canvas.height*4/10, text: 'Loading...', style: { font: '40px monospace', fill: '#ffffff'}}).setOrigin(0.5,0.5);

		this.percentText = this.make.text({ x:game.canvas.width/2, y:game.canvas.height/2, text: '0%', style: {font: '20px monospace', fill: '#ffffff'} }).setOrigin(0.5,0.5);

		this.load.on('progress', function (value) {
			this.progressBar.clear();
			this.progressBar.fillStyle(0xffffff, 1);
			this.progressBar.fillRect(game.canvas.width/3.9, game.canvas.height*4/8.7, value * game.canvas.width/2.05, game.canvas.height/12.5);
			this.percentText.setText(parseInt(value*100)+'%');
		}, this);

		this.load.on('fileprogress', function (file) {
			this.loadingText.setText('Loading complete. Please click to continue.');
		}, this);


		this.load.image('Menu', 'assets/backgrounds/Menu.png');
		this.load.image('cartelImprovinci', 'assets/interface/Pancarta.png');
		this.load.image('Gameplay', 'assets/backgrounds/Gameplay.png');
		this.load.image('credsFondoO', 'assets/backgrounds/credsFondoO.png');
		this.load.image('finFondoO', 'assets/backgrounds/finFondoO.png');
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
		this.load.image('salirBoton_es', 'assets/interface/salirBoton_es.png');
		this.load.image('salirBoton_en', 'assets/interface/salirBoton_en.png');
		this.load.image('Desco_en', 'assets/interface/Desco_en.png');
		this.load.image('Desco_es', 'assets/interface/Desco_es.png');
		this.load.image('DobleConfirm', 'assets/interface/DobleConfirm.png');
		
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
		this.load.image('ukFlag', 'assets/backgrounds/Configuracion/ukFlag.png');
		this.load.image('spainFlag', 'assets/backgrounds/Configuracion/spainFlag.png');
		this.load.image('language', 'assets/backgrounds/Configuracion/Language.png');
		this.load.image('vowels', 'assets/backgrounds/Configuracion/vowels.png');

		//Developers
		this.load.image('RetratoBelen', 'assets/retratos_creditos/RetratoBelenCubismoSinLetra.png');
		this.load.image('RetratoImanol', 'assets/retratos_creditos/RetratoImanolFovismoSinLetra.png');
		this.load.image('RetratoMaria', 'assets/retratos_creditos/RetratoMariaAsiaticoSinLetra.png');
		this.load.image('RetratoPablo', 'assets/retratos_creditos/RetratoPabloMedievoSinLetra.png');
		this.load.image('RetratoTomas', 'assets/retratos_creditos/RetratoTomasEgipcioSinLetra.png');

		//Spanish
		//---Iconos
		this.load.image('Blind_es', 'assets/gamemodes/ModoACiegas_es.png');
		this.load.image('ModoBrochaIncremental', 'assets/gamemodes/ModoBrochaIncremental_es.png');
		this.load.image('ModoNormal_es', 'assets/gamemodes/ModoNormal_es.png');
		this.load.image('ModoTrazosLim_es', 'assets/gamemodes/ModoTrazosLim_es.png');
		this.load.image('ModoUnSoloTrazo_es', 'assets/gamemodes/ModoUnSoloTrazo_es.png');
		
		//English
		//---Icons
		this.load.image('Blind_en', 'assets/gamemodes/ModoACiegas_en.png');
		this.load.image('ModoBrochaIncremental_en', 'assets/gamemodes/ModoBrochaIncremental_en.png');
		this.load.image('ModoNormal_en', 'assets/gamemodes/ModoNormal_en.png');
		this.load.image('ModoTrazosLim_en', 'assets/gamemodes/ModoTrazosLim_en.png');
		this.load.image('ModoUnSoloTrazo_en', 'assets/gamemodes/ModoUnSoloTrazo_en.png');


    }

    create() {
        this.input.on('pointerdown', function(pointer){
            this.scene.scene.start('Menu');
        });
    }
    
    update() { 

    }
}