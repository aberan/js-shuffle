Javascript class that allows you to move elements around the DOM depending on the media query breakpoint.


### Initialization
```javascript
var sizes = [
	{
		key: 'sm',
		val: 0,
	},
	{
		key: 'presentation',
		val: 1200
	},
	{
		key: 'md',
		val: 600
	},
	{
		key: 'lg',
		val: 960
	},

	{
		key: 'max',
		val: 1760
	}
];

var $unit = $('.sh-unit');
var $dest = $('.sh-dest');

var shuffle = new nxnw.Shuffle( $unit, $dest, sizes);
```

**sizes** expected to be array

### Arguments
Argument | Explanation
----------- | -----------
$unit       | jquery DOM object for all the elements that might need to be shuffled
$dest       | jquery DOM object for all the elements that are possible shuffle destinations
sizes       | array of media query breakpoints for shuffle to initialize with enquire.js. val property is px value.

### Options
data-[size] - [size] should correspond to one of the keys in the sizes array. The value can be *append*, *prepend*, *after*, *before*. These values correspond to the same named jquery methods.

data-[name] - [name] identifier for the shuffle unit.

data-dest - value needs to be object with the property name corresponding to one of the keys in the sizes array. The property value is a comma separated list of [name] identifiers.

### Usage for unit element
```html
<h3 class="sh-unit" data-sm="append" data-lg="prepend" data-unit="ph">Heading</h3>
```

### Usage for dest element
```html
<div class="channel-sidebar sh-dest" data-dest='{"lg": "ph"}'></div>
```
