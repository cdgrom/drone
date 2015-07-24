var Cylon = require('cylon');

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

var bot;
// Fly the bot
function fly(robot) {
    bot = robot;

    // Disable emergency setting if there was any
    bot.drone.disableEmergency();
    // Tell the drone it is lying horizontally
    bot.drone.ftrim();

    // Only retrieve a limited amount of navigation data
    // As recommended by Parrot AR Drone developer's guide
    bot.drone.config('general:navdata_demo', 'TRUE');

    bot.nav.on("navdata", function(data) {
        // console.log(data);
    });

    bot.nav.on("altitudeChange", function(data) {
        console.log("Altitude:", data);
        // Drone is higher than 1.5 meters up
        if (data > 1.5) {
            bot.drone.land();
        }
    });

    bot.nav.on("batteryChange", function(data) {
        console.log("Battery level:", data);
    });

    bot.nav.on("altitudeChange", function(data){
        if (data > 2.5) {
            bot.drone.land();
        }
    });

    bot.drone.takeoff();

    after(5*1000, function() {
        bot.drone.up(0.5);
        bot.drone.front(0.1);
        console.log("up and forward correction")
    });

    after(15*1000, function() {
        bot.drone.up(0);
        bot.drone.hover();
        console.log("hover")
    });

    after(16*1000, function() {
        bot.drone.front(0.5);
        console.log("forward")
    });

    after(21*1000, function() {
        bot.drone.land();
        console.log("land")
    });

    after(22*1000, function() {
        bot.drone.stop();
        console.log("stop")
    });

    /*
    bot.drone.up(0.5);

    var timer = 0
    for (var i = 0; i < timer; i) {
        bot.drone.front(0.5);
        after(1*1000), function() {
            timer = timer +1;
        }
    }
    after(10*1000, function() {
        bot.drone.land();
    });

    after(15*1000, function() {
        bot.drone.stop();
    });

    after(10*1000, function() {
        bot.drone.takeoff();
    });

    while (bot.drone.altitude < 2) {
        bot.drone.up(0.5);
    }

    bot.drone.back(0.5);

    after(10*1000, function() {
        bot.drone.land();
    });

    after(15*1000, function() {
        bot.drone.stop();
    });
    */
}

Cylon.start();