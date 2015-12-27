/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

var main = new UI.Card({
	title: 'Pebble.js',
	icon: 'images/menu_icon.png',
	subtitle: 'Hello World!',
	body: 'Press any button.'
});

//main.show();

function timeConverter(UNIX_timestamp){
	var a = new Date(UNIX_timestamp*1000);
	//var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	//var year = a.getFullYear();
	//var month = months[a.getMonth()];
	//var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	var time = hour + ':' + min + ':' + sec ;
	return time;
}

var toHHMMSS = function (date) {
	var sec_num = parseInt(date, 10); // don't forget the second param
	var hours   = Math.floor(sec_num / 3600);
	var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	var seconds = sec_num - (hours * 3600) - (minutes * 60);

	if (hours   < 10) {hours   = "0"+hours;}
	if (minutes < 10) {minutes = "0"+minutes;}
	if (seconds < 10) {seconds = "0"+seconds;}
	var time    = hours+':'+minutes+':'+seconds;
	return time;
};

var api_key='API KEY';

ajax(
	{
		url: 'https://wakatime.com/api/v1/users/current/durations?date=today&api_key='+api_key,
		type: 'json'
	}, 

	function(data){
		var items = [];

		console.log("data", data.data, data.data.length);

		if (data.data.length == 0) {
			console.log("No data for Today.");
			items.push({
				title: 'No time logged',
				subtitle: 'Get to work!'
			});
		} else {
			for (var i = 0; i<data.data.length; i++) {
				items.push({ 
					title: data.data[i].project, 
					subtitle: timeConverter(data.data[i].time) + ' for '+toHHMMSS(data.data[i].duration.toString())
				});
			}
		}

		console.log("items", items);

		var dailyProjects = new UI.Menu({
			sections: [{
				title: 'WakaTime',
				items: items
			}]
		});

		dailyProjects.show();
	},
	function(error) {
		// Failure!
		console.log('Failed fetching WakaTime data: ' + error);
	}
);

main.on('click', 'up', function(e) {
	var menu = new UI.Menu({
		sections: [{
			items: [{
				title: 'Pebble.js',
				icon: 'images/menu_icon.png',
				subtitle: 'Can do Menus'
			},{
				title: 'Second Item',
				subtitle: 'Subtitle Text'
			}]
		}]
	});
	menu.on('select', function(e) {
		console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
		console.log('The item is titled "' + e.item.title + '"');
	});
	menu.show();
});

main.on('click', 'select', function(e) {
	var wind = new UI.Window();
	var textfield = new UI.Text({
		position: new Vector2(0, 50),
		size: new Vector2(144, 30),
		font: 'gothic-24-bold',
		text: 'Text Anywhere!',
		textAlign: 'center'
	});
	wind.add(textfield);
	wind.show();
});

main.on('click', 'down', function(e) {
	var card = new UI.Card();
	card.title('A Card');
	card.subtitle('Is a Window');
	card.body('The simplest window type in Pebble.js.');
	card.show();
});
