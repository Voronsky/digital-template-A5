var keys = Phaser.Keyboard;
var xMove = 80;

state.grudgeLevel = function (game){

};

state.grudgeLevel.prototype = {
    preload: function(){
	this.load.image('darkbg','assets/background_by_sapphireitrenore.png');
	this.load.image('grudgeBar','assets/grudge_bar.png');
	this.load.image('dawn','assets/sora_owen_c.jpg');
	this.load.image('ground','assets/platform_black.png');
	this.load.image('flower','assets/flower.png');
	this.load.audio('music',['assets/audio/Bonobo-Stay_The_Same_(Instrumental).mp3']);
	this.load.audio('jump',['assets/audio/mario_jump.mp3']);
//	this.load.spritesheet('player','assets/guy.png',33,34,9,0,4);
	this.load.spritesheet('enemy','assets/baddie.png',32,32);
	this.load.tilemap('map','assets/world.json',null,Phaser.Tilemap.TILED_JSON);
	this.load.image('tiles', 'assets/tiles/tiles3.png');

    },
    create: function(){

	this.physics.startSystem(Phaser.Physics.ARCADE);
	this.world.setBounds(0,0,5404,920);
	this.background = this.add.tileSprite(0, 0, this.world.width, this.cache.getImage('darkbg').height, 'darkbg');
	
	this.newBg = this.add.tileSprite(0, 0, this.world.width,this.cache.getImage('dawn').height,'dawn');
	this.newBg.visible = false;
	
	//Importing tilemaps
	this.map = this.add.tilemap('map');
	this.map.addTilesetImage('tiles3','tiles');
	this.layer = this.map.createLayer('foreground');
	
	this.map.setCollisionBetween(0, 200);
	
	//Adding game music
	this.music = this.add.audio('music');
	this.music.volume = 0.6;
	this.music.loop = true;
	this.music.play();
	this.jump = this.add.audio('jump');
	

	//Enabling physics on ground and spawn them
	
	this.platform = this.add.group();
	this.platform.enableBody = true;
	this.ground = this.platform.create(0, this.world.height - 10,'ground');
	this.ground.scale.setTo(15,5);
	this.ground.body.immovable = true;

	//Enemy group creation
	this.enemies = this.add.group();
	this.createEnemy();
    
	//Spawning flowers
	this.flowers = this.add.group();
	this.flowers.enableBody = true;
	this.createFlower();

	//making the player
	this.player = this.add.sprite(32,this.world.height - 150,'player');
	this.physics.arcade.enable(this.player);
	this.player.animations.add('left',[4,3,2,1],10,true);
	this.player.animations.add('right',[5,6,7,8],10,true);
	this.player.body.bounce.y = 0.2;
	this.player.body.gravity.y = 400;
	this.player.body.collideWorldBounds = true;
    
	//Adding game camera
	this.camera.follow(this.player);
	
	
	//Enemy movements
	this.time.events.loop(Phaser.Timer.SECOND, this.enemyMove, this);
	
	//Allows player to jump every 2 minutes
	this.time.events.loop(Phaser.Timer.SECOND*2, function(){this.jumpEnable = true;}, this);

	this.scoreText = this.add.text(0,0,'Grudge: ', {fontSize: '32px', fill: '#FFFFFF'});
	this.scoreText.fixedToCamera = true;
	this.grudgeBar = this.add.image(100,1,'grudgeBar');
	this.grudgeBar.fixedToCamera = true;
	this.grudgeBar.width = 180;

	this.grudgeVal = this.grudgeBar.width;

    },

    update: function(){
	this.physics.arcade.collide(this.player, this.platform);
	this.physics.arcade.collide(this.player, this.layer);
	this.physics.arcade.collide(this.player, this.enemies, this.enemyAttack, null, this);
	this.physics.arcade.collide(this.enemies, this.platform);
	this.physics.arcade.collide(this.enemies, this.layer);
	this.physics.arcade.collide(this.flowers, this.layer, this.collisionHandler,null,this);
    
	this.physics.arcade.overlap(this.player, this.flowers, this.collectFlower, null, this);
	
	//This will change the game world once player wins
	this.changeWorld(this.grudgeVal, this.enemies);
	
	this.player.body.velocity.x = 0;
	
	if(this.input.keyboard.isDown(keys.RIGHT))
	{
	    this.player.body.velocity.x = xMove;
	    this.player.animations.play('right');
	    this.background.tilePosition.x -= 0.20;
	}
	else if(this.input.keyboard.isDown(keys.LEFT))
	{
	    this.player.body.velocity.x = -xMove;
	    this.player.animations.play('left');
	    this.background.tilePosition.x += 0.20;
	}
	else
	{
	    this.player.animations.stop();
	    this.player.frame = 0;
	}
    
	//Jumping
	if(this.input.keyboard.isDown(keys.UP) && 
	   this.jumpEnable === true)
	{
	    this.jump.volume = 0.4;
	    this.jump.play();
	    this.player.body.velocity.y = -400;
	    this.jumpEnable = false;
	}

    

 
	this.updateGrudgeBar(this.grudgeVal);
    },

    //Creates enemies
    createEnemy: function() {

	//Spawns 45 enemies
       for (var i=0; i<45; i++) {
	  this.enemy = this.enemies.create(this.world.randomX, this.rnd.integerInRange(100,600), 'enemy');
	   this.physics.arcade.enable(this.enemy);
	   this.enemy.body.gravity.y = 400;
	   this.enemy.body.bounce.y = 0.2;
	   this.enemy.animations.add('left',[0,1], 10, true);
	   this.enemy.animations.add('right',[2,3],10,true);
	   this.enemy.body.collideWorldBounds = true;
       }
    },

    //Adds movements for the enemies
    enemyMove: function() {
	this.enemies.forEach(function(enemy) {

	    var x = Math.round(Math.random());
	    if(x == 1)
	    {
		enemy.animations.play('left');
		enemy.body.velocity.x = -100;

	    }
	    if(x == 0)
	    {
		enemy.animations.play('right');
		enemy.body.velocity.x = 100;
	    }
	}, this);
    },

    //Creates flowers
   createFlower: function() {
	for(var i = 0; i<65; i++) {
	    this.flowers.create(this.rnd.integerInRange(100,5000), this.rnd.integerInRange(300,700), 'flower');

	}
    },


    getSpeed: function(grudgeVal) {
	var grudgeBarVal = 180;
	if(grudgeVal > parseInt(grudgeBarVal*0.5)) {
	    xMove = 80;
	}
	if(grudgeVal <= parseInt(grudgeBarVal*0.5))  {
	    xMove = 145;
	}
	if(grudgeVal <= 0 && this.grudgeBar.visible === false) {

	    xMove = 215;
	}
	return xMove;
    },

    collisionHandler: function(){
	this.flower.kill();
	this.flower.reset(this.rnd.integerInRange(100,5000), this.rnd.integerInRanger(300,650));
    },

    //Collects the flowers
    collectFlower: function(player, flowers) {
	flowers.kill();
	if(this.grudgeVal > 0) 
	{
	    this.grudgeVal -=9; //9 is a factor of 180, so increment it by this much
	}
	if(this.grudgeVal <= 0)
	{
	    this.grudgeBar.visible = false;
	}


	this.getSpeed(this.grudgeVal);
	this.updateGrudgeBar(this.grudgeVal);


    },

    changeWorld: function(grudgeVal, enemies) {
	if(Math.round(this.grudgeVal) <= 0 && this.grudgeBar.visible === false) {
	    this.enemies.destroy(true);
	    this.map.removeTile(91,5); //Remove the block tile that blocks the goal
	    this.background.visible = false;
	    this.newBg.visible = true;

	}
    },

    enemyAttack: function(player, enemies) {
	var grudgeOrigWidth = 180;
	if ( this.grudgeVal < grudgeOrigWidth)
	{

	    this.grudgeVal += 18; //18 is a factor of 180 so increment it by this much
	    this.getSpeed(this.grudgeVal);
	    this.updateGrudgeBar(this.grudgeVal);
	}
	if(this.player.body.touching.left) {
	    this.player.body.velocity.x = 500;
	    this.player.body.bounce.setTo(20,20);
	}
	if (this.player.body.touching.right) {
	    this.player.body.center.x = -100;
	}
	if (this.player.body.touching.down) {
	    this.player.body.velocity.y = -400;
	    this.player.body.velocity.x = -300;
	}

	this.player.body.bounce.setTo(0,0);
	//return grudgeBar.width;

    },

	updateGrudgeBar: function(grudgeVal) {
	this.grudgeBar.width = this.grudgeVal;
	return this.grudgeBar.width;
    },



}
