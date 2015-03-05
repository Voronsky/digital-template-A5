//Game state code
var keys = Phaser.Keyboard;
state.Game = function (game) {

};

state.Game.prototype = {

    preload: function(){
	this.load.image('sky','assets/sky.png');
	this.load.spritesheet('dude', 'assets/dude.png',32,48);
	this.load.image('ground','assets/platform.png');
	this.load.audio('jump',['assets/audio/mario_jump.mp3']);
	this.load.image('gate','assets/gate.png');
	this.load.spritesheet('player','assets/guy.png',33,34,9,0,4);
    },

    create: function(){
	
	this.physics.startSystem(Phaser.Physics.ARCADE);
	this.bgtile = this.add.tileSprite(0,0, 800,600,'sky');

	this.jump = this.add.audio('jump');
	
	//Ground
	this.platforms = this.add.group();
	this.platforms.enableBody = true;
	
	this.ground = this.platforms.create(0, this.world.height - 10, 'ground');

	this.ground.scale.setTo(8,8);
	this.ground.body.immovable = true;

	//Platforms
	this.ledge = this.platforms.create(-200,410, 'ground');
	this.ledge.body.immovable = true;
	this.ledge = this.platforms.create(this.world.width - 200, this.world.height - 210, 'ground');
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
	this.raceText = this.add.text(10,320,"World 1",{size: "16px", fill: "#FFF", align: "center"});
	

	//Grudge gate
	this.grudgeGate = this.gates.create(this.world.width - 100, this.world.height - 270,'gate');
	this.grudgeGate.body.immovable = true;
	this.grudgeText = this.add.text(this.world.width - 100, this.world.height - 290, "World 2",{size: "16px",fill: "#FFF", align:"center"});

	//Loop advisor text
	this.talk = this.add.text(this.world.width - 120, this.world.height - 192, "", {size: "2px", fill: "#FFF",wordWrap: true, wordWrapWidth: this.advisorNPC.width*5, align: "center"});

	//Timer
	this.gameTimer = this.add.text(this.world.centerX-100, 50, "",{size: "16px", fill: "#FFF", align:"center"});
	
	//Loop the advisor dialog
	this.time.events.loop(Phaser.Timer.SECOND*3, this.advisorTalk, this);

	
	//Player creation
	this.player = this.add.sprite(this.world.centerX, this.world.height - 150, 'player');
	this.physics.arcade.enable(this.player);
	this.player.body.bounce.y = 0.1;
	this.player.body.gravity.y = 400;
	this.player.body.collideWorldBounds = true;
	this.player.animations.add('left',[4,3,2,1],10,true);
	this.player.animations.add('right',[5,6,7,8],10,true);
	
	this.camera.follow(this.player);

    },

    update: function(){
	this.physics.arcade.collide(this.advisorNPC, this.platforms);
	this.physics.arcade.collide(this.player, this.platforms);
	//If player runs into race door, start the race level
	this.physics.arcade.overlap(this.player, this.raceGate, this.startRace,null,this);
	this.physics.arcade.overlap(this.player, this.grudgeGate, this.startGrudge,null,this);
	
	this.gameTimer.setText("Time:"+parseInt(this.time.totalElapsedSeconds()));

	this.player.body.velocity.x = 0;
	
	if(this.input.keyboard.isDown(keys.RIGHT)){
	    this.player.body.velocity.x = 300;
	    this.player.animations.play('right');
	}
	else if(this.input.keyboard.isDown(keys.LEFT)){
	    this.player.body.velocity.x = -300;
	    this.player.animations.play('left');
	}else{
	    this.player.animations.stop();
	    this.player.frame = 0;
	}

	//Jump mechanics
	if(this.input.keyboard.isDown(keys.UP) && this.player.body.touching.down){
	    this.jump.volume = 0.5;
	    this.jump.play();
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

	this.state.start('raceIntro');
    },
    
    startGrudge: function(){

	this.state.start('grudgeIntro');
    }


}
