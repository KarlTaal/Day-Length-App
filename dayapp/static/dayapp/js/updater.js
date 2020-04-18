import {DayInfo} from "./timeCalculator.js";

$("#calcrun").click(function () {
        let sunrise = "";
        let sunset = "";
        let daylength = "";
        if ($("#datepicker").val() !== "" && $("#inserted_lat").val() !== "" && $("#inserted_long").val() !== "") {
            let day = new DayInfo($("#inserted_lat").val(), $("#inserted_long").val(), 3, new Date($("#datepicker").val()))
            sunrise = "Sunrise time (UTC+3):  " + day.getSunriseAsString();
            sunset = "Sunset time (UTC+3):   " + day.getSunsetAsString();
            daylength = "Day length:            " + day.getDayLength();
        }
        document.getElementById("info").innerHTML =
            sunrise + "\n" +
            sunset + "\n" +
            daylength

        let message = "";
        if ($("#datepicker").val() === "")
            message += "date, ";
        if ($("#inserted_lat").val() === "")
            message += "latitude, ";
        if ($("#inserted_long").val() === "")
            message += "longitude, ";
        if (message !== "")
            alert(message.substring(0, message.length-2) + " not choosed!")
    }
);