import {DayInfo} from "./timeCalculator.js";

function convDate(str) {
    var a = str.split("/");
    return new Date(+a[2], a[1] - 1, +a[0]);
}

$("#calcrun").click(function () {
        let sunrise = "";
        let sunset = "";
        let daylength = "";
        if ($("#inserted_lat").val() !== "" && $("#inserted_long").val() !== "") {
            if ($("#datepicker").val() !== "") {
                let day = new DayInfo($("#inserted_lat").val(), $("#inserted_long").val(), 3, convDate($("#datepicker").val()));
                alert(day.calcSunSet());
                sunrise = "Sunrise time (UTC+3):  " + day.getSunriseAsString();
                sunset = "Sunset time (UTC+3):   " + day.getSunsetAsString();
                daylength = "Day length:            " + day.getDayLength();
            }
            if ($('#datepickerend').val() != "" && $('#datepickerstart').val() != "") {
                runGraphCalculations();
            }
        }
        document.getElementById("info").innerHTML =
            sunrise + "\n" +
            sunset + "\n" +
            daylength;

        let message = "";
        if ($("#inserted_lat").val() === "")
            message += "latitude, ";
        if ($("#inserted_long").val() === "")
            message += "longitude, ";
        if (message !== "")
            alert(message.substring(0, message.length - 2) + " not choosed!")
    }
);

var optSimple = {
    dateFormat: 'dd/mm/yy',
    todayHighlight: true,
    orientation: 'bottom right',
    autoclose: true,
    default: true,
    container: '#sandbox'
};


$('#datepicker').datepicker(optSimple);
$('#datepickerstart').datepicker(optSimple);
$('#datepickerend').datepicker(optSimple);


function runGraphCalculations() {
    let dates = [];
    let lengths = [];
    let start = convDate($('#datepickerstart').val());
    let end = convDate($('#datepickerend').val());
    let diff = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;
    for (let i = 0; i < diff; i++) {
        dates.push(start.getDate().toString() + "/" + start.getMonth().toString() + "/" + start.getFullYear().toString());
        lengths.push(new DayInfo($("#inserted_lat").val(), $("#inserted_long").val(), 3, start).getDayLengthAsMinutes());
        start.setTime(start.getTime() + (24 * 60 * 60 * 1000));
    }
    if (dates.length > 15) {
        let h = parseInt(dates.length / 15 );
        for (let i = 1; i < dates.length + 1; i++) {
            if (i % h !== 0)
                dates[i] = "";
        }
    }

    var data = {
        labels: dates,
        series: [
            lengths
        ]
    };
    var options = {
        width: '100%',
        height: 400,
        chartPadding: 50,
    };
    $("#chart").show();
    new Chartist.Line('#chart', data, options);

}


$('#datepickerstart').datepicker().change(function () {
    if ($('#datepickerend').val() != "" && convDate($('#datepickerend').val()) <= convDate($('#datepickerstart').val())) {
        $('#datepickerstart').val("");
        alert("Start date can not be after or equal to end date!");
    }
    $("#chart").hide();
});

$('#datepickerend').datepicker().change(function () {
    if ($('#datepickerstart').val() != "" && convDate($('#datepickerstart').val()) >= convDate($('#datepickerend').val())) {
        $('#datepickerend').val("");
        alert("End date can not be before or equal to start date!");
    }
    $("#chart").hide();
});