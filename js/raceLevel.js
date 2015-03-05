var keys = Phaser.Keyboard;

state.raceLevel =  function (game) {


};

state.raceLevel.prototype = {

    preload: function(){
	this.load.image('road','assets/road.png');
	this.load.spritesheet('car','assets/car.png',23,69,1);
//	this.load.image('sky','assets/sky.png');
    },

    create:function(){

	//Creating bg
	this.world.setBounds(0,0,6200,600);

	this.background = this.add.tileSprite(0,0, this.world.width,this.cache.getImage('sky').height,'sky');

	this.roadImg = this.add.tileSprite(0,this.world.height - 32,1200, 32,'road');
	
	//Making the road
	this.roads = this.add.group();
	this.roads.enableBody = true;

	//Invis road
	this.road = this.roads.create(0,this.world.height - 30);
	this.road.body.immovable = true;
	this.road.scale.setTo(6200,5);

	this.player = this.add.sprite(32, this.world.height - 50,'car');
	this.physics.arcade.enable(this.player);
	this.player.body.bounce.y = 0.1;
	this.player.body.gravity.y = 500;
	this.player.body.collideWorldBounds = true;
	
	//Resetting game world
	
	//Have camera follow player as they race
	this.camera.follow(this.player);
	
    },

    update: function(){

	this.physics.arcade.collide(this.player, this.roads);
	
	this.player.body.velocity.x = 0;

	if(this.input.keyboard.isDown(keys.RIGHT)){
	    //this.player.body.velocity.x = 600;
	    //this.player.frame = 0;
	    
	    //Scroll background
	    this.background.tilePosition.x -= 10;
	    this.roadImg.tilePosition.x -= 10;
	}
	else if (this.input.keyboard.isDown(keys.LEFT)){
	   // this.player.body.velocity.x = -600;
	    this.background.tilePosition.x += 10;
	    this.roadImg.tilePosition.x += 10;
	    //this.player.frame = 0;
	}

    }

}
