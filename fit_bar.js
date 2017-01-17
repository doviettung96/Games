/**
 * Created by tung on 16/01/2017.
 */
$(document).ready(function () {
    var bar = $(".bar");
    var meter = $(".meter");
    var box2 = $("#box2");
    var num_click = 0;
    var txt = "";
    var def_height = Math.random() * 1000;
    var speed;
    var button = $("button");

    txt += "<br> Goal: " + def_height + "<br>";

    button.mousedown(function () {
        num_click = 0;
        def_height = Math.random() * 1000;
        speed = 0;
        bar.animate(
            {
                height: '100px'
            }
        );
        meter.animate({
            marginLeft: 0
        });

    });
    button.mouseup(function () {
        txt = "";
        $("#result").html(txt);
    });

    box2.mousedown(function (event) {
        // var left = event.pageX
        speed = event.pageX;
        meter.animate({
            marginLeft: event.pageX - 50
        });

    });

    box2.mouseup(function () {
        box2.stop();
        meter.stop();
    });

    bar.mousedown(function () {
        bar.animate(
            {
                height: '+=500px'

            }, speed);

    });

    bar.mouseup(function () {
        bar.stop();
        num_click += 1;
        txt = "Height of the bar:  " + bar.height() + "<br>";
        txt += "<br> Goal: " + def_height + "<br>";

        var height_difference = bar.height() - def_height;
        var square_difference = height_difference * height_difference;
        if (square_difference < 2500 && num_click <= 2) {
            txt += "<br>" + "<b>YOU WIN</b> <br>";
        }
        else if (height_difference > 50 || num_click > 2) {
            txt += "<br>" + "<b>YOU LOSE</b> <br>";
        }

        $("#result").html(txt);
    });


});