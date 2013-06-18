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
	planets: [],

	init: function()
	{
		this.generate(12,2);
		ig.input.bind(ig.KEY.ENTER, 'more');
		ig.input.bind(ig.KEY.SPACE, 'showHideSuns');
		ig.input.bind(ig.KEY.TAB, 'togglePlanetaryAttraction');
		this.font.alpha = 0.4;
	},
	
	update: function()
	{
		if (ig.input.pressed('more'))
			this.generate(8, 1);

		if (ig.input.pressed('showHideSuns'))
			this.toggleSuns();

		if (ig.input.pressed('togglePlanetaryAttraction'))
			this.togglePlanetaryAttraction();

		this.parent();
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

			// Ensure planets are not drawn to each other & only drawn to the suns
			planet.type = ig.Entity.TYPE.B;
			planet.localGravity.drawnBy = ig.Entity.TYPE.A;

			// For ident
			planet.name = "planet";
			
			// Store for toggling
			this.planets.push(planet);
		}

		// Suns
		for (var i=0; i<numSuns; i++)
		{
			sun = this.spawnEntity('EntityBall', 0, 0);
			radius = Math.random().map(0, 1, 20, 50).round();
			sun.size = {x:radius, y:radius};
			x = Math.random().map(0, 1, 0, w-radius*2).round();
			y = Math.random().map(0, 1, 0, h-radius*2).round();
			sun.pos = {x:x, y:y};
			
			// Ensure that suns don't overlap
			sun.type = ig.Entity.TYPE.A;
			sun.collides = ig.Entity.COLLIDES.ACTIVE;
		
			// Local gravity settings
			sun.localGravity.mass = 100000;
			// Prevent influence by others, i.e., remain stationary
			sun.localGravity.factor = 0;

			// For ident
			sun.name = "sun";

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
	
	planetsAttractEachOther: function()
	{
		return this.planets[0].localGravity.drawnBy == ig.Entity.TYPE.BOTH;
	},

	togglePlanetaryAttraction: function()
	{
		var newval = this.planetsAttractEachOther() ? ig.Entity.TYPE.A : ig.Entity.TYPE.BOTH ;
		_.each(this.planets, function(p){ p.localGravity.drawnBy = newval; });
	},
	
	draw: function()
	{
		this.parent();

		this.font.draw(
			'ENTER: add bodies\nSPACE: show/hide suns\n  TAB: ' + (this.planetsAttractEachOther() ? 'planets do not attract each other' : 'planets attract each other'),
			4, 4,
			ig.Font.ALIGN.LEFT);
	}
});

ig.main('#canvas', MyGame, 30, 270, 270, 1);

});
