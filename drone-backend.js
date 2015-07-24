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

    //bot.nav.on("altitudeChange", function(data) {
    //    console.log("Altitude:", data);
    //    // Drone is higher than 1.5 meters up
    //    if (data > 1.5) {
    //        bot.drone.land();
    //    }
    //});

    //bot.nav.on("batteryChange", function(data) {
    //    console.log("Battery level:", data);
    //});

    bot.nav.on("altitudeChange", function(data){
        if (data > 2.5) {
            bot.drone.land();
        }
    });

    bot.drone.takeoff();
    console.log("takeoff");
    var fidur = 5;
    var secdur = 1.5;
    var thidur = 1.5;
    var foudur = 1;
    var firsttak = fidur + secdur+thidur+foudur;
    var turn = 0.2;
    var forward = 0.25;

    after((fidur)*1000, function() {
        bot.drone.right(turn);
        bot.drone.front(forward);
        console.log("right and forward correction")
    });

    after((fidur+secdur)*1000, function() {
        bot.drone.left(turn);
        bot.drone.front(forward);
        console.log("left and forward correction")
    });

    after((fidur+secdur+thidur)*1000, function() {
        bot.drone.land();
        console.log("land")
    });

    after((fidur+secdur+thidur+foudur)*1000, function() {
        bot.drone.stop();
        console.log("stop")
    });

    after((firsttak+fidur)*1000, function() {
        bot.drone.takeoff();
        console.log("takeoff2")
    });

    after((firsttak+fidur+secdur)*1000, function() {
        bot.drone.left(turn);
        bot.drone.back(forward);
        console.log("left and backwards correction")
    });

    after((firsttak+fidur+secdur+thidur)*1000, function() {
        bot.drone.right(turn);
        bot.drone.back(forward);
        console.log("right and backwards correction")
    });

    after((firsttak+fidur+secdur+thidur+foudur)*1001, function() {
        bot.drone.land();
        console.log("land")
    });

    after((firsttak+firsttak)*1000, function() {
        bot.drone.stop();
        console.log("stop")
    });


    //after((5)*1000, function() {
    //    bot.drone.up(0.5);
    //    bot.drone.front(0.1);
    //    console.log("up and forward correction")
    //});
    //
    //after((5+10)*1000, function() {
    //    bot.drone.land();
    //    console.log("land")
    //});
    //
    //after((5+11)*1000, function() {
    //    bot.drone.stop();
    //    console.log("stop")
    //});
    //
    //after((5+11+3)*1000, function() {
    //    bot.drone.takeoff();
    //    console.log("takeoff2")
    //});
    //
    //after((5+11+3+5)*1000, function() {
    //    bot.drone.up(0.5);
    //    bot.drone.back(0.1);
    //    console.log("up and backwards correction")
    //});
    //
    //after((5+11+3+5+10)*1000, function() {
    //    bot.drone.land();
    //    console.log("land")
    //});
    //
    //after((5+11+3+5+11)*1000, function() {
    //    bot.drone.stop();
    //    console.log("stop")
    //});
}

Cylon.start();