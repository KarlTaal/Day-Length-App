//Veebilehe keele vahetamine.

$("#lang").click(function (e) {
    let isEnglish = $("#siteHeading").html() === "Sun calculator";

    //Fraasid inglise keeles.
    let englishPhrases = [
        "Sun calculator",
        "Map's center point is in use by default for the calculations.",
        "Latitude",
        "Longitude",
        "Date for single day calculations",
        "Start date for the graph",
        "End date for the graph",
        "Run calculations!",
        "Calculation results",
        "Sunrise time (UTC+3):",
        "Sunset time (UTC+3):",
        "Day length:",
        "Day lengths in hours",
        "Author Karl Taal University of Tartu",
        "E-mail: karltaal@gmail.com"
    ];

    //Fraasid eesti keeles.
    let estonianPhrases = [
        "Päikese kalkulaator",
        "Kaardi keskpunk on vaikimisi alati kasutusel arvutuste läbiviimisel.",
        "Laiuskraad",
        "Pikkuskraad",
        "Kuupäev ühe päeva arvutusteks",
        "Algus kuupäev graafiku jaoks",
        "Lõpp kuupäev graafiku jaoks",
        "Arvuta tulemused!",
        "Arvutuste tulemused",
        "Päikesetõusu aeg (UTC+3):",
        "Päikeseloojangu aeg (UTC+3):",
        "Päeva pikkus:",
        "Päeva pikkused tundides",
        "Autor Karl Taal Tartu Ülikool",
        "E-post: karltaal@gmail.com"
    ];

    //HTML taggide id'd, et saaksime uut teksti seadistada.
    let IDs = [
        "#siteHeading",
        "#mapPS",
        "#inserted_latlabel",
        "#inserted_longlabel",
        "#datepickerlabel1",
        "#datepickerlabel2",
        "#datepickerlabel3",
        "#calcrun",
        "#resultH",
        "#sunrise",
        "#sunset",
        "#daylength",
        "#chartH",
        "#author",
        "#email"
    ];

    //Kui hetkene keel on inglise keel, siis seadistame uueks keeleks eesti keele.
    if (!isEnglish) {
        $("#lang").attr("src", '../../static/dayapp/images/est.png');
        for (let i = 0; i < IDs.length; i++) {
            if (i === 9 || i === 10 || i === 11) {
                let tmp = $(IDs[i]).html();
                $(IDs[i]).html(englishPhrases[i] + tmp.slice(tmp.indexOf(':')+1));
            } else
                $(IDs[i]).html(englishPhrases[i]);
        }
    } else { //vastasel juhul seadistame keeleks inglise keele.
        $("#lang").attr("src", '../../static/dayapp/images/eng.png');
        for (let i = 0; i < IDs.length; i++) {
            if (i === 9 || i === 10 || i === 11){
                let tmp = $(IDs[i]).html();
                $(IDs[i]).html(estonianPhrases[i] + tmp.slice(tmp.indexOf(':')+1));
            }
            else
                $(IDs[i]).html(estonianPhrases[i]);
        }
    }
});