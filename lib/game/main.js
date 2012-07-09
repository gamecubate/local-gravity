ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'game.entities.ball',
	'plugins.gamecubate.local-gravity'
)
.defines(function(){


MyGame = ig.Game.extend({

	clearColor: 'rgba(255,255,255,1)',
	gravity: 0,
	font: new ig.Font( 'media/04b03-black.font.png' ),
	suns: [],
	showSuns: true,

	init: function()
	{
		this.generate(12,2);
		ig.input.bind(ig.KEY.ENTER, 'more');
		ig.input.bind(ig.KEY.SPACE, 'showHideSuns');
		this.font.alpha = 0.2;
	},
	
	generate: function(numPlanets, numSuns)
	{
		// Create planets and a sun
		var w = ig.system.width;
		var h = ig.system.height;
		var x, y, radius;
		var planet, sun;

		// Planets
		for (var i=0; i<numPlanets; i++)
		{
			planet = this.spawnEntity('EntityBall', 0, 0);
			radius = Math.random().map(0, 1, 5, 15).round();
			planet.size = {x:radius, y:radius};
			x = Math.random().map(0, 1, planet.size.x, w-planet.size.x).round();
			y = Math.random().map(0, 1, planet.size.y, h-planet.size.y).round();
			planet.pos = {x:x, y:y};
			
			// Local gravity settings
			planet.localGravity.mass = Math.random().map(0, 1, 1, 1000).round();
		}

		// Sun
		for (var i=0; i<numSuns; i++)
		{
			sun = this.spawnEntity('EntityBall', 0, 0);
			radius = Math.random().map(0, 1, 20, 50).round();
			sun.size = {x:radius, y:radius};
			x = Math.random().map(0, 1, 0, w-radius*2).round();
			y = Math.random().map(0, 1, 0, h-radius*2).round();
			sun.pos = {x:x, y:y};
			
			// Ensure that suns don't overlap
			sun.type = ig.Entity.TYPE.B;
			sun.collides = ig.Entity.COLLIDES.ACTIVE;
		
			// Local gravity settings
			sun.localGravity.mass = 100000;
			sun.localGravity.factor = 0;

			// Visuals
			if (this.showSuns)
				sun.fillColor = 'rgba(204,77,34,0.8)';
			else
				sun.fillColor = 'rgba(204,77,34,0)';
			sun.zIndex = -1;
			this.sortEntitiesDeferred();
		
			// Store for toggling
			this.suns.push(sun);
		}
	},
	
	update: function()
	{
		if (ig.input.pressed('more'))
			this.generate(8, 1);

		if (ig.input.pressed('showHideSuns'))
			this.toggleSuns();
		
		this.parent();
	},
	
	toggleSuns: function()
	{
		this.showSuns = ! this.showSuns;

		for (var i=0; i<this.suns.length; i++)
		{
			var sun = this.suns[i];
			if (this.showSuns)
				sun.fillColor = 'rgba(204,77,34,0.8)';
			else
				sun.fillColor = 'rgba(204,77,34,0)';
		}
	},
	
	draw: function()
	{
		this.parent();

		this.font.draw(
			'ENTER: add more bodies      SPACE: show/hide suns',
			ig.system.width/2, 4,
			ig.Font.ALIGN.CENTER);
	}
});

ig.main('#canvas', MyGame, 30, 270, 270, 1);

});
