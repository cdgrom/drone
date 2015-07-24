var Cylon = require('cylon');
var ws = require('nodejs-websocket');
var bot;

// Initialise the robot
Cylon.robot()
    .connection("ardrone", {
        adaptor: 'ardrone',
        port: '192.168.1.1'
    })
    .device("drone", {
        driver: "ardrone",
        connection: "ardrone"
    })

    .device("nav", {
        driver: "ardrone-nav",      // Combine with a second device to have more information
        connection: "ardrone"
    })
    .on("ready", fly);

// Fly the bot
function fly(robot) {

    // Only retrieve a limited amount of navigation data
    // As recommended by Parrot AR Drone developer's guide
    bot.drone.config('general:navdata_demo', 'TRUE');

    bot.nav.on("navdata", function(data) {
        console.log(data);
    });

    bot = robot;
    bot.drone.disableEmergency();
    bot.drone.ftrim();
    bot.drone.takeoff();

    while (bot.drone.altitude < 200) {
        bot.drone.up(1);
    }

    for (var i = 0; i < 1; i = i + 0.1) {
        bot.drone.front(i);
    }

    bot.drone.land();

    after(10*1000, function() {
        bot.drone.takeoff();
    });

    while (bot.drone.altitude < 200) {
        bot.drone.up(1);
    }

    for (var i = 0; i < 1; i = i+0.1) {
        bot.drone.back(i);
    }
}

Cylon.start();

fly(drone);