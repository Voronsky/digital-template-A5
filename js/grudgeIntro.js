state.grudgeIntro = function (game) {

};


state.grudgeIntro.prototype = {
    preload: function(){

    },
    create: function(){
	this.intro = this.add.text(this.world.centerX, this.world.height/5,"",{size: "32px", fill:"#FFF", align:"center"});

	this.intro.anchor.setTo(0.5,0.5);

	this.intro.setText("In this world, you must overcome your grudes.\nThe flowers will let go bits of it,\nbut you will never see the light of day\nuntil you let go of all of it...\nTotal time taken to make decision:"+parseInt(this.time.totalElapsedSeconds())+"\n\n<click mouse>");
    },
    update: function(){
	if(this.input.activePointer.isDown){
	    this.intro.setText("One bit, dodge the rabbits.\nAlthough they seem harmful,\nthey will remind you of your grudges.");
	    this.time.events.add(Phaser.Timer.SECOND*5,this.startGame,this);

	}
    },

    startGame: function(){
	this.state.start('grudgeLevel');
    }
}
