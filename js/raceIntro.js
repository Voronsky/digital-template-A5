state.raceIntro = function (game) {

};

state.raceIntro.prototype = {

    preload: function(){
	
    },
    create: function(){
	this.intro = this.add.text(this.world.centerX, this.world.height/5,"",{size:"32px", fill:"#FFF", align: "center"});
	this.intro.anchor.setTo(0.5,0.5);
	this.intro.setText("In this world, you must collect\n as many stars as possible.\nBest advice would be to use ramps,\nand try not to crash the car!\n(WIP)\nTotal time taken to make decision:"+parseInt(this.time.totalElapsedSeconds())+"\n<click mouse>");
    },
    update: function(){
	if(this.input.activePointer.isDown){
	    this.intro.setText("Keep in mind, this level is W.I.P\n Hopefully there will be time to finish it");
	    this.time.events.add(Phaser.Timer.SECOND*5,this.startGame,this);
	}
    },
    startGame: function(){
	this.state.start('raceLevel');
    }

}
