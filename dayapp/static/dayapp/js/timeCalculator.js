// Valem pärineb vastavalt veebilehelt: https://www.esrl.noaa.gov/gmd/grad/solcalc/

/**
 * Klass, ühe päeva info hoidmiseks.
 *
 * Objekti loomisel tuleb anda ette laiuskraad, pikkuskraad, ajatsooni number (nt UTC+3 puhul 3) ja kuupäev.
 * Objektilt on võimalik küsida erinevaid näitajaid selle päeva kohta, sealhulgas ka päikesetõusu,
 * päikeseloojangu ja päeva pikkuse aega.
 */
export class DayInfo {

    /**
     *  DayInfo objekti konstruktor.
     *
     * @param latitude Laiuskraadid.
     * @param longitude Pikkuskraadid.
     * @param timezone Ajavööndi number, näiteks UTC+3 korral tuleks anda parameetriks 3.
     * @param date Date tüüpi objekt.
     */
    constructor(latitude, longitude, timezone, date) {
        this.longitude = longitude;
        this.latitude = latitude;
        this.timezone = timezone;
        this.date = date;
    }


    /**
     * Kraadide teisendamine radiaanideks.
     * @param degrees kraadid.
     * @returns radiaanind.
     */
    toRadians(degrees) {
        let pi = Math.PI;
        return degrees * (pi / 180);
    }


    /**
     * Radiaanide teisendamine kraadideks.
     * @param degrees kraadid.
     * @returns kraadid.
     */
    toDegrees(radians) {
        let pi = Math.PI;
        return radians * (180 / pi);
    }

    /**
     * Var y arvutamine.
     * @returns var y.
     */
    varY() {
        return Math.tan(this.toRadians(this.obliqCorrDeg() / 2)) * Math.tan(this.toRadians(this.obliqCorrDeg() / 2))
    }


    /**
     * Maa orbiidi arvutamine.
     * @returns {number}
     */
    eccentEarthOrbit() {
        return 0.016708634 - this.julianCentury() * (0.000042037 + 0.0000001267 * this.julianCentury())
    }


    /**
     * Ajavõrrand.
     * @returns minutes
     */
    eqOfTime() {
        return 4 * this.toDegrees(this.varY() * Math.sin(2 * this.toRadians(this.geomMeanLongSunDeg())) - 2 * this.eccentEarthOrbit() * Math.sin(this.toRadians(this.geomMeanAnomSunDeg())) + 4 * this.eccentEarthOrbit() * this.varY() * Math.sin(this.toRadians(this.geomMeanAnomSunDeg())) * Math.cos(2 * this.toRadians(this.geomMeanLongSunDeg())) - 0.5 * this.varY() * this.varY() * Math.sin(4 * this.toRadians(this.geomMeanLongSunDeg())) - 1.25 * this.eccentEarthOrbit() * this.eccentEarthOrbit() * Math.sin(2 * this.toRadians(this.geomMeanAnomSunDeg())));
    }


    /**
     * Päikese keskpäeva arvutamine
     * @returns päikese keskpäev (LST)
     */
    solarNoon() {
        return (720 - 4 * this.longitude - this.eqOfTime() + this.timezone * 60) / 1440;
    }

    /**
     * Julian päeva arvutamine.
     * @returns julian päev.
     */
    julianDay() {
        return Math.floor((this.date.getTime() / 86400000) - (this.date.getTimezoneOffset() / 1440) + 2440587.5);
    }


    /**
     * Julian sajandi arvutamine.
     * @returns julian sajand.
     */
    julianCentury() {
        return (this.julianDay() - 2451545) / 36525;
    }

    /**
     * Mean oblig ecliptic arvutamine.
     * @returns {number}
     */
    meanObliqEcliptic() {
        return 23 + (26 + ((21.448 - this.julianCentury() * (46.815 + this.julianCentury() * (0.00059 - this.julianCentury() * 0.001813)))) / 60) / 60;
    }


    /**
     * Keskmine päikese pikkuskraad.
     * @returns kraadid.
     */
    geomMeanLongSunDeg() {
        return 280.46646 + this.julianCentury() * (36000.76983 + this.julianCentury() * 0.0003032) % 360
    }


    /**
     * Keskmise päikese anomaalia kraadide arvutaine.
     * @returns kraadid.
     */
    geomMeanAnomSunDeg() {
        return 357.52911 + this.julianCentury() * (35999.05029 - 0.0001537 * this.julianCentury())
    }


    /**
     * Sun Eq of Ctr arvutamine.
     * @returns {number}
     */
    sunEqOfCtr() {
        return Math.sin(this.toRadians(this.geomMeanAnomSunDeg())) * (1.914602 - this.julianCentury() * (0.004817 + 0.000014 * this.julianCentury())) + Math.sin(this.toRadians(2 * this.geomMeanAnomSunDeg())) * (0.019993 - 0.000101 * this.julianCentury()) + Math.sin(this.toRadians(3 * this.geomMeanAnomSunDeg())) * 0.000289
    }

    /**
     * Päikese reaalne pikkuskraad.
     * @returns pikkuskraad.
     */
    sunTrueLong() {
        return this.geomMeanLongSunDeg() + this.sunEqOfCtr();
    }

    /**
     * Sun App Long.
     * @returns {number}
     */
    sunAppLong() {
        return this.sunTrueLong() - 0.00569 - 0.00478 * Math.sin(this.toRadians(125.04 - 1934.136 * this.julianCentury()));
    }

    /**
     * Obliq Corr (degrees)
     * @returns kraadid.
     */
    obliqCorrDeg() {
        return this.meanObliqEcliptic() + 0.00256 * Math.cos(this.toRadians(125.04 - 1934.136 * this.julianCentury()));
    }

    /**
     * Päikese languse kraadid.
     * @returns kraadid.
     */
    sunDeclineDeg() {
        return this.toDegrees(Math.asin(Math.sin(this.toRadians(this.obliqCorrDeg())) * Math.sin(this.toRadians(this.sunAppLong()))));
    }

    /**
     * HA Sunrise (degrees)
     * @returns kraadid
     */
    HAsunriseDeg() {
        return this.toDegrees(Math.acos(Math.cos(this.toRadians(90.833)) / Math.cos(this.toRadians(this.latitude)) * Math.cos(this.toRadians(this.sunDeclineDeg())) - Math.tan(this.toRadians(this.latitude)) * Math.tan(this.toRadians(this.sunDeclineDeg()))));
    }

    /**
     * Lõpparvutuse tulemuse teisendamine inimesele loetavale kujule.
     * @param value Kellaaeg kümndendsüsteemis.
     * @param isLenght Tõeväärtus, kas teisendame hetkel päevapikkust.
     * @returns Sõne kellaajast.
     */
    convertToTimeString(value, isLenght) {
        let c1 = Math.floor(value * 24);
        let tmp = c1;
        if (c1 >24){
            while (tmp > 24){
                tmp -= 24;
            }
        }
        if (tmp == 24)
            tmp = 0;
        let hours = tmp.toString();
        let minutes = Math.floor((value * 24 - c1) * 60).toString();
        if (isLenght)
            return hours + "h " + minutes + "min";
        return (hours.length === 2 ? hours : "0" + hours) + ":" + (minutes.length === 2 ? minutes : "0" + minutes);
    }

    /**
     * Arvutab päikesetõusu.
     * @returns Päikesetõusu aeg.
     */
    calcSunRise() {
        return this.solarNoon() - this.HAsunriseDeg() * 4 / 1440;
    }


    /**
     * Arvutab päikeseloojangu.
     * @returns Päikeseloojandu aeg.
     */
    calcSunSet() {
        return this.solarNoon() + this.HAsunriseDeg() * 4 / 1440;
    }

    /**
     * Tagastab päikesetõusu aja sõnena ja tüüpilises kella formaadis.
     * @returns Kellaaeg.
     */
    getSunriseAsString() {
        return this.convertToTimeString(this.calcSunRise(), false);
    }


    /**
     * Tagastab päikeseloojangu aja sõnena ja tüüpilises kella formaadis.
     * @returns Kellaaeg.
     */
    getSunsetAsString() {
        return this.convertToTimeString(this.calcSunSet(), false);
    }

    /**
     * Tagastab päeva pikkuse aja sõnena.
     * @returns sõne tundide ja minutite kogusest.
     */
    getDayLength() {
        return this.convertToTimeString(this.calcSunSet() - this.calcSunRise(), true);
    }

    /**
     * Tagastab päeva pikkuse tundides.
     * @returns tunnid.
     */
    getDayLengthAsHours() {
        return (this.calcSunSet() - this.calcSunRise())*24;
    }
}






