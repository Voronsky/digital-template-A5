//Game state code
var keys = Phaser.Keyboard;

state.Game = function (game) {

};

state.Game.prototype = {

    preload: function(){
	this.load.image('sky','assets/sky.png');
	this.load.spritesheet('dude', 'assets/dude.png',32,48);
	this.load.image('ground','assets/platform.png');
	this.load.image('gate','assets/gate.png');
	this.load.spritesheet('player','assets/george.png',46,42,16);
    },
    create: function(){
	
	this.physics.startSystem(Phaser.Physics.ARCADE);
	this.bgtile = this.add.tileSprite(0,0, 800,600,'sky');

	//Ground
	this.platforms = this.add.group();
	this.platforms.enableBody = true;
	
	this.ground = this.platforms.create(0, this.world.height - 10, 'ground');

	this.ground.scale.setTo(8,8);
	this.ground.body.immovable = true;

	//Platforms
	this.ledge = this.platforms.create(-200,410, 'ground');
	this.ledge.body.immovable = true;

	//creating the advisorNPC
	this.advisorNPC = this.add.sprite(this.world.width - 94, this.world.height - 150, 'dude');
	this.physics.arcade.enable(this.advisorNPC);
	this.advisorNPC.body.bounce.y = 0.2;
	this.advisorNPC.body.gravity.y = 400;
	this.advisorNPC.body.collideWorldBounds = true;
	

	//Adding gate to other world
	this.gates = this.add.group();
	this.gates.enableBody = true;
	
	//First gate
	this.raceGate = this.gates.create(30,346,'gate');
	this.raceGate.body.immovable = true;
	this.raceText = this.add.text(10,340,"To the race",{size: "16px", fill: "#FFF", align: "center"});

	//Loop advisor text
	this.talk = this.add.text(this.world.width - 120, this.world.height - 192, "", {size: "2px", fill: "#FFF",wordWrap: true, wordWrapWidth: this.advisorNPC.width*5, align: "center"});
	this.time.events.loop(Phaser.Timer.SECOND*3, this.advisorTalk, this);
	
	//Player creation
	this.player = this.add.sprite(32, this.world.height - 150, 'player');
	this.physics.arcade.enable(this.player);
	this.player.body.bounce.y = 0.1;
	this.player.body.gravity.y = 400;
	this.player.body.collideWorldBounds = true;
	this.player.animations.add('left',[1,5,9,13],10,true);
	this.player.animations.add('right',[3,7,11,15],10,true);

    },

    update: function(){
	this.physics.arcade.collide(this.advisorNPC, this.platforms);
	this.physics.arcade.collide(this.player, this.platforms);
	//If player runs into race door, start the race level
	this.physics.arcade.overlap(this.player, this.gates, this.startRace,null,this);

	this.player.body.velocity.x = 0;
	
	if(this.input.keyboard.isDown(keys.RIGHT)){
	    this.player.body.velocity.x = 400;
	    this.player.animations.play('right');
	}
	else if(this.input.keyboard.isDown(keys.LEFT)){
	    this.player.body.velocity.x = -400;
	    this.player.animations.play('left');
	}else{
	    this.player.animations.stop();
	    this.player.frame = 0;
	}

	//Jump mechanics
	if(this.input.keyboard.isDown(keys.UP) && this.player.body.touching.down){
	    this.player.body.velocity.y = -400;
	}

    },

   /*Idea is using a binary decision making for the advisorNPC chat dialogs*/ 
    advisorTalk: function(){
	this.min = 0;
	this.max = 1;
	this.x = Math.round(Math.random()*(this.max-this.min) + this.min);

	switch(this.x){
	    
	case 0:
	    this.talk.setText("You must choose!\nDo not hesitate!");
	    break;
	    
	case 1:
	    
	    this.talk.setText("Go!");
	    break;
	default:
	    this.x = 0;
	    break;
	}
    },

    startRace: function(){

	this.state.start('raceLevel');
    }


}
