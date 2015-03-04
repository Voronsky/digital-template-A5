var state = {};

//var keys = Phaser.Keyboard;

state.main = function (game) {

};

state.main.prototype = {
    preload: function(){


    },
    create: function(){
	//Intro text setup
	this.intro = this.add.text(this.world.centerX, this.world.height/5,"",{size: "32px", fill:"#FFF", align: "center"}); //Setting the introduction text object

	this.intro.anchor.setTo(0.5,0.5); //Anchoring it to top center

	this.introText(); //Calling text

    },
    update: function(){
	//Code goes here
	if(this.input.activePointer.isDown){
	    this.intro.setText("Have fun! Use arrow keys to move!");
	    //Event delay
	    this.time.events.add(Phaser.Timer.SECOND*3,this.startGame,this);
	}
    },
    
    introText: function(){
	this.intro.setText("Don't hesitate to make decisions. Otherwise you lose points!\n<click Mouse>");
	

    },
    startGame: function(){
	this.state.start('Game');
    }
} 
