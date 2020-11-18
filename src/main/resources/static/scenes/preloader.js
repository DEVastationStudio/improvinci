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
			this.loadingText.setText('Loading ' + file.key + '...');
		}, this);

		this.load.on('complete', function (file) {
			this.loadingText.setText('Loading complete.');
			this.cameras.main.fadeOut(200);
            this.cameras.main.once('camerafadeoutcomplete', function(camera) {
                this.scene.start('Menu');
            }, this);
		}, this);

		this.load.spritesheet('TimeAnim', 'assets/interface/Tiempo.png',
		{
			frameWidth: 332,
			frameHeight: 303
		});
		this.load.image('Menu', 'assets/backgrounds/Menu.png');
		this.load.image('cartelImprovinci', 'assets/interface/Pancarta.png');
		this.load.image('Gameplay', 'assets/backgrounds/Gameplay.png');
		this.load.image('credsFondoO', 'assets/backgrounds/credsFondoO.png');
		this.load.image('finFondoO', 'assets/backgrounds/finFondoO.png');
    	this.load.image('Caballete_gameplay', 'assets/interface/Caballete_gameplay.png');
		this.load.image('Play_en', 'assets/interface/Play_en.png');
		this.load.image('Play_es', 'assets/interface/Play_es.png');
		this.load.image('Credits_es', 'assets/interface/Credits_es.png');
		this.load.image('Credits_en', 'assets/interface/Credits_en.png');
		this.load.image('CrearPartida_en', 'assets/interface/CrearPartida_en.png');
		this.load.image('CrearPartida_es', 'assets/interface/CrearPartida_es.png');
		this.load.image('UnirsePartida_en', 'assets/interface/UnirsePartida_en.png');
		this.load.image('UnirsePartida_es', 'assets/interface/UnirsePartida_es.png');
		this.load.image('Config_es', 'assets/interface/Config_es.png');
		this.load.image('Config_en', 'assets/interface/Config_en.png');
		this.load.image('Copiar_es', 'assets/interface/Copiar_es.png');
		this.load.image('Copiar_en', 'assets/interface/Copiar_en.png');
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
		this.load.image('DobleConfirm_es', 'assets/interface/DobleConfirm_es.png');
		this.load.image('DobleConfirm_en', 'assets/interface/DobleConfirm_en.png');
		this.load.image('DobleConfirmSi_es', 'assets/interface/DobleConfirmSi_es.png');
		this.load.image('DobleConfirmSi_en', 'assets/interface/DobleConfirmSi_en.png');
		this.load.image('DobleConfirmNo_es', 'assets/interface/DobleConfirmNo_es.png');
		this.load.image('DobleConfirmNo_en', 'assets/interface/DobleConfirmNo_en.png');
		
		//keyboard
		this.load.image('KeyBoardBg', 'assets/backgrounds/KeyBoardBg.png');
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
		this.load.image('Daily_en', 'assets/backgrounds/Configuracion/Daily_en.png');
		this.load.image('Blind_en', 'assets/backgrounds/Configuracion/Blind_en.png');
		this.load.image('Default_en', 'assets/backgrounds/Configuracion/Default_en.png');
		this.load.image('Dificil_en', 'assets/backgrounds/Configuracion/Dificil_en.png');
		this.load.image('Facil_en', 'assets/backgrounds/Configuracion/Facil_en.png');
		this.load.image('Growing_en', 'assets/backgrounds/Configuracion/Growing_en.png');
		this.load.image('Limit_en', 'assets/backgrounds/Configuracion/Limit_en.png');
		this.load.image('Modos_en', 'assets/backgrounds/Configuracion/Modos_en.png');
		this.load.image('NumRondas_en', 'assets/backgrounds/Configuracion/NumRondas_en.png');
		this.load.image('One_en', 'assets/backgrounds/Configuracion/One_en.png');
		this.load.image('RondaC_en', 'assets/backgrounds/Configuracion/Ronda_en.png');
		this.load.image('Tiempos_en', 'assets/backgrounds/Configuracion/Tiempos_en.png');
		this.load.image('Votacion_en', 'assets/backgrounds/Configuracion/Votacion_en.png');
		this.load.image('Mas', 'assets/backgrounds/Configuracion/Mas.png');
		this.load.image('Menos', 'assets/backgrounds/Configuracion/Menos.png');
		this.load.image('TickNoCheck', 'assets/backgrounds/Configuracion/TickNoCheck.png');
		this.load.image('TickCheck', 'assets/backgrounds/Configuracion/TickCheck.png');
		this.load.image('ukFlag', 'assets/backgrounds/Configuracion/ukFlag.png');
		this.load.image('spainFlag', 'assets/backgrounds/Configuracion/spainFlag.png');
		this.load.image('language_en', 'assets/backgrounds/Configuracion/Language_en.png');
		this.load.image('vowels_en', 'assets/backgrounds/Configuracion/vowels_en.png');
		//------//
		this.load.image('Daily_es', 'assets/backgrounds/Configuracion/Daily_es.png');
		this.load.image('Blind_es', 'assets/backgrounds/Configuracion/Blind_es.png');
		this.load.image('Default_es', 'assets/backgrounds/Configuracion/Default_es.png');
		this.load.image('Dificil_es', 'assets/backgrounds/Configuracion/Dificil_es.png');
		this.load.image('Facil_es', 'assets/backgrounds/Configuracion/Facil_es.png');
		this.load.image('Growing_es', 'assets/backgrounds/Configuracion/Growing_es.png');
		this.load.image('Limit_es', 'assets/backgrounds/Configuracion/Limit_es.png');
		this.load.image('Modos_es', 'assets/backgrounds/Configuracion/Modos_es.png');
		this.load.image('NumRondas_es', 'assets/backgrounds/Configuracion/NumRondas_es.png');
		this.load.image('One_es', 'assets/backgrounds/Configuracion/One_es.png');
		this.load.image('RondaC_es', 'assets/backgrounds/Configuracion/Ronda_es.png');
		this.load.image('Tiempos_es', 'assets/backgrounds/Configuracion/Tiempos_es.png');
		this.load.image('Votacion_es', 'assets/backgrounds/Configuracion/Votacion_es.png');
		this.load.image('language_es', 'assets/backgrounds/Configuracion/Language_es.png');
		this.load.image('vowels_es', 'assets/backgrounds/Configuracion/vowels_es.png');

		//Developers
		this.load.image('RetratoBelen', 'assets/retratos_creditos/RetratoBelenCubismoSinLetra.png');
		this.load.image('RetratoImanol', 'assets/retratos_creditos/RetratoImanolFovismoSinLetra.png');
		this.load.image('RetratoMaria', 'assets/retratos_creditos/RetratoMariaAsiaticoSinLetra.png');
		this.load.image('RetratoPablo', 'assets/retratos_creditos/RetratoPabloMedievoSinLetra.png');
		this.load.image('RetratoTomas', 'assets/retratos_creditos/RetratoTomasEgipcioSinLetra.png');

		//Spanish
		//---Iconos
		this.load.image('ModoACiegas_es', 'assets/gamemodes/ModoACiegas_es.png');
		this.load.image('ModoBrochaIncremental_es', 'assets/gamemodes/ModoBrochaIncremental_es.png');
		this.load.image('ModoNormal_es', 'assets/gamemodes/ModoNormal_es.png');
		this.load.image('ModoTrazosLim_es', 'assets/gamemodes/ModoTrazosLim_es.png');
		this.load.image('ModoUnSoloTrazo_es', 'assets/gamemodes/ModoUnSoloTrazo_es.png');
		
		//English
		//---Icons
		this.load.image('ModoACiegas_en', 'assets/gamemodes/ModoACiegas_en.png');
		this.load.image('ModoBrochaIncremental_en', 'assets/gamemodes/ModoBrochaIncremental_en.png');
		this.load.image('ModoNormal_en', 'assets/gamemodes/ModoNormal_en.png');
		this.load.image('ModoTrazosLim_en', 'assets/gamemodes/ModoTrazosLim_en.png');
		this.load.image('ModoUnSoloTrazo_en', 'assets/gamemodes/ModoUnSoloTrazo_en.png');

		this.load.image('empty', 'assets/empty.png');

    }

    create() {
        /*this.input.on('pointerdown', function(pointer){
            this.scene.scene.start('Menu');
        });*/
    }
    
    update() { 

    }
}