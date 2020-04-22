import {DayInfo} from "./timeCalculator.js";

/**
 * Funktsioon inputist tuleva kuupäeva sõne muundamiseks Date objektiks.
 * @param str Kuupäev sõnena formaadis "dd/mm/yyyy"
 * @returns Date objekti vastavalt parameetrile.
 */
function convDate(str) {
    var a = str.split("/");
    return new Date(+a[2], a[1] - 1, +a[0]);
}


/**
 * Arvutus nupu klikkimise toimingud.
 */
$("#calcrun").click(function () {
        //Alguses võtame esimese poole hetkel kuvatavast infost. Vajalik mitme keele tõttu.
        let sunrise = $("#sunrise").html().split(":")[0] + ":  ";
        let sunset = $("#sunset").html().split(":")[0] + ":  ";
        let daylength = $("#daylength").html().split(":")[0] + ":  ";

        //Kui sisendid on sobivad, siis teostama vastavad arvutused ja uuendame infot.
        if ($("#inserted_lat").val() !== "" && $("#inserted_long").val() !== "") {
            if ($("#datepicker").val() !== "") {
                let day = new DayInfo($("#inserted_lat").val(), $("#inserted_long").val(), 3, convDate($("#datepicker").val()));
                sunrise += day.getSunriseAsString();
                sunset += day.getSunsetAsString();
                daylength += day.getDayLength();
            }
            if ($('#datepickerend').val() != "" && $('#datepickerstart').val() != "") {
                runGraphCalculations();
            }
        }

        //Seadistame uue info väljadele.
        $("#sunrise").html(sunrise);
        $("#sunset").html(sunset);
        $("#daylength").html(daylength);

        //Juhul kui pole piisaval infot arvutamisteks, siis anname sellest teada.
        let message = "";
        if ($("#inserted_lat").val() === "")
            message += "latitude, ";
        if ($("#inserted_long").val() === "")
            message += "longitude, ";
        if ($("#datepicker").val() === "" && ($("#datepickerstart").val() === ""  || $("#datepickerend").val() === ""))
            message += "date(s), ";
        if (message !== "")
            alert(message.substring(0, message.length - 2) + " not choosed!")
    }
);

/**
 * Datepicker seadistused.
 */
var optSimple = {
    dateFormat: 'dd/mm/yy',
    todayHighlight: true,
    orientation: 'bottom right',
    autoclose: true,
    default: true,
    container: '#sandbox'
};

//Loome kolm datepickerit.
$('#datepicker').datepicker(optSimple);
$('#datepickerstart').datepicker(optSimple);
$('#datepickerend').datepicker(optSimple);


/**
 * Arvutab vajalikud päevapikkused antud vahemikes ja kuvab vastava graafiku.
 */
function runGraphCalculations() {
    //Loome kuupäevadest ja päeva pikkustest kaks massiivi.
    let dates = [];
    let lengths = [];
    let start = convDate($('#datepickerstart').val());
    let end = convDate($('#datepickerend').val());
    let diff = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;
    for (let i = 0; i < diff; i++) {
        dates.push(start.getDate().toString() + "/" + start.getMonth().toString() + "/" + start.getFullYear().toString());
        lengths.push(new DayInfo($("#inserted_lat").val(), $("#inserted_long").val(), 3, start).getDayLengthAsHours());
        start.setTime(start.getTime() + (24 * 60 * 60 * 1000));
    }

    //Hõrendame x telje labelite sagedust, et suure ajavahemiku korral ei tekiks sasipundart.
    //Probleem säilib siiski, kui veebilehitsejat väiksemaks teha.
    if (dates.length > 15) {
        let h = parseInt(dates.length / 15);
        for (let i = 1; i < dates.length + 1; i++) {
            if (i % h !== 0)
                dates[i] = "";
        }
    }

    //Andmed graafiku jaoks.
    var data = {
        labels: dates,
        series: [
            lengths
        ]
    };

    //Seadistused graafikule.
    var options = {
        width: '100%',
        height: 400,
        chartPadding: 50,
        elements: {point: {radius: 0}}
    };

    //Deaktiveerime punktid graafiku joonel.
    var responsiveOptions = [
        ['screen', {
            showPoint: false,
        }]
    ];

    //Teeme graafiku ja selle pealkirja nähtavaks.
    $("#chart").show();
    $("#chartH").show();
    new Chartist.Line('#chart', data, options, responsiveOptions);
}

/**
 * Kästileme olukorda kui kasutaja peaks tahtma seadistada alguskuupäeva hilisemaks kui lõppkuupäeva.
 */
$('#datepickerstart').datepicker().change(function () {
    if ($('#datepickerend').val() != "" && convDate($('#datepickerend').val()) <= convDate($('#datepickerstart').val())) {
        $('#datepickerstart').val("");
        alert("Start date can not be after or equal to end date!");
    }
    //$("#chart").hide();
});

/**
 * Kästileme olukorda kui kasutaja peaks tahtma seadistada lõppkuupäeva varajasemaks kui alguskuupäeva.
 */
$('#datepickerend').datepicker().change(function () {
    if ($('#datepickerstart').val() != "" && convDate($('#datepickerstart').val()) >= convDate($('#datepickerend').val())) {
        $('#datepickerend').val("");
        alert("End date can not be before or equal to start date!");
    }
    //$("#chart").hide();
});