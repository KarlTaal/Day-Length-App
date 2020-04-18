import {DayInfo} from "./timeCalculator.js";





$("#calcrun").click(function () {
        let sunrise = "";
        let sunset = "";
        let daylength = "";
        if ($("#datepicker").val() != "" && $("#inserted_lat").val() != "" && $("#inserted_long").val() != "") {
            let day = new DayInfo($("#inserted_lat").val(), $("#inserted_long").val(), 3, new Date($("#datepicker").val()))
            sunrise = day.getSunriseAsString();
            sunset = day.getSunsetAsString();
            daylength = day.getDayLength();
        }
        document.getElementById("info").innerHTML =
            "Sunrise time (UTC+3):  " + sunrise + "\n" +
            "Sunset time (UTC+3):   " + sunset + "\n" +
            "Day length:            " + daylength
    }
);