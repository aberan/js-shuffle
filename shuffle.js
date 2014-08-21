var nxnw = nxnw || {};

define(function(require){
	var jQuery = require('jquery');
	require('throttle-debounce');
	require('enquire.min');

	function Shuffle($unit, $dest, sizes, cb) {
		this.dest = {};
		this.$unit = $unit;
		this.$dest = $dest;
		this.last = null;
		this.curr = null;
		this.walker = null;
		this.cb = typeof cb !== 'undefined' && typeof cb === 'function' ? cb : false;

		//sort queries by size ascending
		var queries = sizes;
		queries.sort( function(a,b) {
			var A = +a.val,
				B = +b.val;

			return A < B ? -1 : A > B ? 1 : 0;
		});

		//create basic singly linked list to walk through
		var prev_node = null;
		for( var i = 0, z = queries.length; i < z; i++ ) {
			var node = {
				prev: prev_node,
				mq: queries[i].key
			};

			//init linked list references;
			this.last = prev_node = node;

		}

		//create dest obj with keys using sizes array
		for(var i=0,z=sizes.length; i<z; i++) {
			this.dest[sizes[i].key] = {};
		}

		//create obj with arrays of all destinations for each size
		var that = this;
		this.$dest.each(function(i) {
			var obj = $(this).data('dest');
			for (var key in obj) {
				var keys = obj[key].split(',');
				for( var j=0,z=keys.length; j<z; j++ ) {
					that.dest[key][keys[j]] = i;
				}
			}
		});

		//create enquire EH
		for(var i=0,z=sizes.length; i<z; i++) {
			var mq = typeof sizes[i + 1] !== 'undefined' ? "screen and (min-width:"+(sizes[i].val / 16)+"em) and (max-width:"+( (sizes[i + 1].val - 1) / 16)+"em)" : "screen and (min-width:"+(sizes[i].val / 16)+"em)";
			this.init(mq, sizes[i].key);
		}
	};

	Shuffle.prototype = (function() {
		var mq = null;

		var initEnquire = function(query, curr, that) {
			//function stuff here
			enquire.register(query, {
				match: function() {
					mq = curr;
					//reset curr
					that.curr = that.last;
					that.shuffle( mq );
				},
				deferSetup : true
			});
		};

		var returnCurr = function() {
			return mq;
		};

		return {

			init: function(query, key) {
				initEnquire(query, key, this);
			},

			getState: function() {
				return returnCurr();
			},

			shuffle: function(mq) {
				var that = this;
				//get linked list node that matched current media query
				while (that.curr.prev !== null && that.curr.mq !== mq ) {
					that.curr = that.curr.prev;
				}
				// do  {
				// 	that.curr = that.curr === null ? that.last : that.curr.prev;
				// } while ( that.curr.prev !== null && that.curr.mq !== mq);

				this.$unit.each(function() {
					var $this = $(this);
					that.walker = that.curr;

					//do do any operation if element doesn't have one defined for the current state
					var valid_mq = null;

					//walk through linked list until we find a valid node. Following min-width principles.
					while ( typeof $this.data(that.walker.mq) === 'undefined' && that.walker.prev !== null ) {
						that.walker = that.walker.prev;
					}

					valid_mq = that.walker.mq;

					//test to see if the element has a destination for this breakpoint
					var unit = $this.data('unit');

					if ( that.dest[valid_mq].hasOwnProperty(unit) ) {
						var $el = $(that.$dest[that.dest[valid_mq][unit]]);
						var op = $this.data(valid_mq);

						//perform jQuery op
						switch(op) {
							case 'before':
								$el.before($this);
								break;
							case 'after':
								$el.after($this);
								break;
							case 'append':
								$el.append($this);
								break;
							case 'prepend':
								$el.prepend($this);
								break;
						}
						
						//execute callback if defined
						if( that.cb ) {
							that.cb( $this, unit, valid_mq );
						}
					}
				});
			}
		};
	})();

	nxnw.Shuffle = Shuffle;
	return nxnw.Shuffle;

});
