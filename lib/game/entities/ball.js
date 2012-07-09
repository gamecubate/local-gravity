ig.module(
	'game.entities.ball'
)
.requires(
	'impact.entity',
	'plugins.gamecubate.local-gravity'
)
.defines(function(){


EntityBall = ig.Entity.extend({

	size: {x:32, y:32},
	maxVel: {x:400, y:400},
	fillColor: 'rgba(64, 64, 64, 0.4)',
	// friction: {x:10, y:10},

	init: function( x, y, settings)
	{
		this.parent( x, y, settings);
	},
	
	draw: function()
	{
		this.parent();
		
		var radius = this.size.x/2;
		var x = ig.system.getDrawPos(this.pos.x + radius - ig.game.screen.x);
		var y = ig.system.getDrawPos(this.pos.y + radius - ig.game.screen.y);

		this.fillCircle(x, y, radius*ig.system.scale, this.fillColor);
	},
	
	// Helpers
	fillCircle: function(centerX, centerY, radius, color)
	{
		var ctx = ig.system.context;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 *Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
	},
});
});