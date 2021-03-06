'use strict';

class Preloader extends Phaser.Scene {


	constructor() {
		super({key: 'Preloader', pack: { files: [ {type: 'spritesheet', key: 'LoadGraphic', url: 'assets/interface/Tiempo.png', frameConfig: {frameWidth: 256, frameHeight: 256}}, {'type': 'image', 'key': 'logoDEV', 'url': 'assets/logoDEV.png'}]}});
	}
	
	preload() {
		this.LoadGraphic = this.add.sprite(game.canvas.width / 2, game.canvas.height / 2, 'Menu2');
		this.anims.create({
			key: 'LoadAnim',
			frames: this.anims.generateFrameNumbers('LoadGraphic'),
			frameRate: 12,
			repeat: -1
		});
		this.LoadGraphic.anims.load('LoadAnim');
		this.LoadGraphic.setScale(Math.min(game.canvas.width/game.global.WIDTH,game.canvas.height/game.global.HEIGHT));
		
		this.logoDEV = this.add.sprite(game.canvas.width / 2, game.canvas.height / 2, 'logoDEV');
		this.logoDEV.setScale(2*Math.min(game.canvas.width/game.global.WIDTH,game.canvas.height/game.global.HEIGHT));
		this.logoDEV.setAlpha(0);

		//Loading bar
		
		this.load.on('progress', function (value) {
			this.LoadGraphic.anims.setProgress(value);
		}, this);

		this.load.on('complete', function (file) {
			this.tweens.add({
				targets: this.LoadGraphic,
				alpha: {from: 1, to: 0},
				duration: 1000,
				ease: 'Quad.easeOut',
				onComplete: function () {
					this.tweens.add({
						targets: this.logoDEV,
						alpha: {from: 0, to: 1},
						duration: 2000,
						ease: 'Quad.easeOut',
						onComplete: function () {
							this.cameras.main.fadeOut(2000);
							this.cameras.main.once('camerafadeoutcomplete', function (camera) {
								this.scene.start('Menu');
							}, this);
						},
						onCompleteScope: this
					});
				},
				onCompleteScope: this
			});
		}, this);

		this.load.spritesheet('TimeAnim', 'assets/interface/Tiempo.png',
			{
				frameWidth: 256,
				frameHeight: 256
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
		this.load.image('Copiar_es', 'assets/interface/Peek_es.png');
		this.load.image('Copiar_en', 'assets/interface/Peek_en.png');
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
		this.load.image('critico_cerca', 'assets/character/critico_cerca.png');
		this.load.image('salirBoton_es', 'assets/interface/salirBoton_es.png');
		this.load.image('salirBoton_en', 'assets/interface/salirBoton_en.png');
		this.load.image('salirMainMenu_es', 'assets/interface/salirMainMenu_es.png');
		this.load.image('salirMainMenu_en', 'assets/interface/salirMainMenu_en.png');
		this.load.image('Desco', 'assets/interface/Desco.png');
		this.load.image('DobleConfirm_es', 'assets/interface/DobleConfirm_es.png');
		this.load.image('DobleConfirm_en', 'assets/interface/DobleConfirm_en.png');
		this.load.image('DobleConfirmSi_es', 'assets/interface/DobleConfirmSi_es.png');
		this.load.image('DobleConfirmSi_en', 'assets/interface/DobleConfirmSi_en.png');
		this.load.image('DobleConfirmNo_es', 'assets/interface/DobleConfirmNo_es.png');
		this.load.image('DobleConfirmNo_en', 'assets/interface/DobleConfirmNo_en.png');
		this.load.image('BorrarDibujo', 'assets/interface/BorrarDibujo.png');
		this.load.image('Vote_en', 'assets/interface/Vote_en.png');
		this.load.image('Vote_es', 'assets/interface/Vote_es.png');
		this.load.image('salirMainMenu_es', 'assets/interface/salirMainMenu_es.png');
		this.load.image('salirMainMenu_en', 'assets/interface/salirMainMenu_en.png');
		this.load.image('otra_es', 'assets/interface/otra_es.png');
		this.load.image('otra_en', 'assets/interface/otra_en.png');

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
		this.load.image('Default', 'assets/backgrounds/Configuracion/Default.png');
		this.load.image('Dificil_en', 'assets/backgrounds/Configuracion/Dificil_en.png');
		this.load.image('Facil_en', 'assets/backgrounds/Configuracion/Facil_en.png');
		this.load.image('Growing', 'assets/backgrounds/Configuracion/Growing.png');
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
		this.load.image('ConfigBg', 'assets/backgrounds/ConfigBg.png');
		//------//
		this.load.image('Daily_es', 'assets/backgrounds/Configuracion/Daily_es.png');
		this.load.image('Blind_es', 'assets/backgrounds/Configuracion/Blind_es.png');
		this.load.image('Dificil_es', 'assets/backgrounds/Configuracion/Dificil_es.png');
		this.load.image('Facil_es', 'assets/backgrounds/Configuracion/Facil_es.png');
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
		this.load.image('RetratoBelen_es', 'assets/retratos_creditos/BelenCubismoESP.png');
		this.load.image('RetratoImanol_es', 'assets/retratos_creditos/ImanolFovismoESP.png');
		this.load.image('RetratoMaria_es', 'assets/retratos_creditos/MariaAsiaticoESP.png');
		this.load.image('RetratoPablo_es', 'assets/retratos_creditos/PabloMedievoESP.png');
		this.load.image('RetratoTomas_es', 'assets/retratos_creditos/TomasEgipcioESP.png');

		this.load.image('RetratoBelen_en', 'assets/retratos_creditos/BelenCubismoENG.png');
		this.load.image('RetratoImanol_en', 'assets/retratos_creditos/ImanolFovismoENG.png');
		this.load.image('RetratoMaria_en', 'assets/retratos_creditos/MariaAsiaticoENG.png');
		this.load.image('RetratoPablo_en', 'assets/retratos_creditos/PabloMedievoENG.png');
		this.load.image('RetratoTomas_en', 'assets/retratos_creditos/TomasEgipcioENG.png');

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

		//Tutorial
		this.load.image('tIzquierda', 'assets/tutorial/TutorialFlechaIzq.png');
		this.load.image('tDerecha', 'assets/tutorial/TutorialFlecha.png');
		this.load.image('tutorialBt', 'assets/interface/tutorial.png');
		//---Español
		this.load.image('TutorialBg1_es', 'assets/tutorial/TutorialBg1_es.png');
		this.load.image('TutorialBg2_es', 'assets/tutorial/TutorialBg2_es.png');
		this.load.image('TutorialBg3_es', 'assets/tutorial/TutorialBg3_es.png');
		this.load.image('TutorialBg4_es', 'assets/tutorial/TutorialBg4_es.png');
		this.load.image('TutorialBg5_es', 'assets/tutorial/TutorialBg5_es.png');
		this.load.image('TutorialBg6_es', 'assets/tutorial/TutorialBg6_es.png');
		this.load.image('TutorialBg7_es', 'assets/tutorial/TutorialBg7_es.png');
		this.load.image('TutorialBg8_es', 'assets/tutorial/TutorialBg8_es.png');
		this.load.image('TutorialBg9_es', 'assets/tutorial/TutorialBg9_es.png');
		this.load.image('TutorialBg10_es', 'assets/tutorial/TutorialBg10_es.png');
		this.load.image('TutorialBg11_es', 'assets/tutorial/TutorialBg11_es.png');
		//---Inglés
		this.load.image('TutorialBg1_en', 'assets/tutorial/TutorialBg1_en.png');
		this.load.image('TutorialBg2_en', 'assets/tutorial/TutorialBg2_en.png');
		this.load.image('TutorialBg3_en', 'assets/tutorial/TutorialBg3_en.png');
		this.load.image('TutorialBg4_en', 'assets/tutorial/TutorialBg4_en.png');
		this.load.image('TutorialBg5_en', 'assets/tutorial/TutorialBg5_en.png');
		this.load.image('TutorialBg6_en', 'assets/tutorial/TutorialBg6_en.png');
		this.load.image('TutorialBg7_en', 'assets/tutorial/TutorialBg7_en.png');
		this.load.image('TutorialBg8_en', 'assets/tutorial/TutorialBg8_en.png');
		this.load.image('TutorialBg9_en', 'assets/tutorial/TutorialBg9_en.png');
		this.load.image('TutorialBg10_en', 'assets/tutorial/TutorialBg10_en.png');
		this.load.image('TutorialBg11_en', 'assets/tutorial/TutorialBg11_en.png');

		//Puntuaciones
		this.load.image('Puntuaciones_es', 'assets/interface/Puntuaciones_es.png');
		this.load.image('Puntuaciones_en', 'assets/interface/Puntuaciones_en.png');
		this.load.image('TopScores_es', 'assets/interface/TopScores_es.png');
		this.load.image('TopScores_en', 'assets/interface/TopScores_en.png');

	}

	create() {
	}

	update() {

	}
}