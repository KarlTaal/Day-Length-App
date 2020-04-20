export class DayInfo {
    constructor(latitude, longitude, timezone, date) {
        this.longitude = longitude;
        this.latitude = latitude;
        this.timezone = timezone;
        this.date = date;
    }


    toRadians(degrees) {
        let pi = Math.PI;
        return degrees * (pi / 180);
    }


    toDegrees(radians) {
        let pi = Math.PI;
        return radians * (180 / pi);
    }


    varY() {
        return Math.tan(this.toRadians(this.obliqCorrDeg() / 2)) * Math.tan(this.toRadians(this.obliqCorrDeg() / 2))
    }


    eccentEarthOrbit() {
        return 0.016708634 - this.julianCentury() * (0.000042037 + 0.0000001267 * this.julianCentury())
    }


    eqOfTime() {
        return 4 * this.toDegrees(this.varY() * Math.sin(2 * this.toRadians(this.geomMeanLongSunDeg())) - 2 * this.eccentEarthOrbit() * Math.sin(this.toRadians(this.geomMeanAnomSunDeg())) + 4 * this.eccentEarthOrbit() * this.varY() * Math.sin(this.toRadians(this.geomMeanAnomSunDeg())) * Math.cos(2 * this.toRadians(this.geomMeanLongSunDeg())) - 0.5 * this.varY() * this.varY() * Math.sin(4 * this.toRadians(this.geomMeanLongSunDeg())) - 1.25 * this.eccentEarthOrbit() * this.eccentEarthOrbit() * Math.sin(2 * this.toRadians(this.geomMeanAnomSunDeg())));
    }


    solarNoon() {
        return (720 - 4 * this.longitude - this.eqOfTime() + this.timezone * 60) / 1440;
    }


    julianDay() {
        return Math.floor((this.date.getTime() / 86400000) - (this.date.getTimezoneOffset() / 1440) + 2440587.5);
    }


    julianCentury() {
        return (this.julianDay() - 2451545) / 36525;
    }


    meanObliqEcliptic() {
        return 23 + (26 + ((21.448 - this.julianCentury() * (46.815 + this.julianCentury() * (0.00059 - this.julianCentury() * 0.001813)))) / 60) / 60;
    }


    geomMeanLongSunDeg() {
        return 280.46646 + this.julianCentury() * (36000.76983 + this.julianCentury() * 0.0003032) % 360
    }


    geomMeanAnomSunDeg() {
        return 357.52911 + this.julianCentury() * (35999.05029 - 0.0001537 * this.julianCentury())
    }


    sunEqOfCtr() {
        return Math.sin(this.toRadians(this.geomMeanAnomSunDeg())) * (1.914602 - this.julianCentury() * (0.004817 + 0.000014 * this.julianCentury())) + Math.sin(this.toRadians(2 * this.geomMeanAnomSunDeg())) * (0.019993 - 0.000101 * this.julianCentury()) + Math.sin(this.toRadians(3 * this.geomMeanAnomSunDeg())) * 0.000289
    }


    sunTrueLong() {
        return this.geomMeanLongSunDeg() + this.sunEqOfCtr();
    }


    sunAppLong() {
        return this.sunTrueLong() - 0.00569 - 0.00478 * Math.sin(this.toRadians(125.04 - 1934.136 * this.julianCentury()));
    }


    obliqCorrDeg() {
        return this.meanObliqEcliptic() + 0.00256 * Math.cos(this.toRadians(125.04 - 1934.136 * this.julianCentury()));
    }


    sunDeclineDeg() {
        return this.toDegrees(Math.asin(Math.sin(this.toRadians(this.obliqCorrDeg())) * Math.sin(this.toRadians(this.sunAppLong()))));
    }


    HAsunriseDeg() {
        return this.toDegrees(Math.acos(Math.cos(this.toRadians(90.833)) / Math.cos(this.toRadians(this.latitude)) * Math.cos(this.toRadians(this.sunDeclineDeg())) - Math.tan(this.toRadians(this.latitude)) * Math.tan(this.toRadians(this.sunDeclineDeg()))));
    }


    convertToTimeString(value, isLenght) {
        let c1 = Math.floor(value * 24);
        let hours = c1.toString();
        let minutes = Math.floor((value * 24 - c1) * 60).toString();
        if (isLenght)
            return hours + "h " + minutes + "min";
        return (hours.length == 2 ? hours : "0" + hours) + ":" + (minutes.length == 2 ? minutes : "0" + minutes);
    }


    calcSunRise() {
        return this.solarNoon() - this.HAsunriseDeg() * 4 / 1440;
    }


    calcSunSet() {
        return this.solarNoon() + this.HAsunriseDeg() * 4 / 1440;
    }

    getSunriseAsString() {
        return this.convertToTimeString(this.calcSunRise());
    }


    getSunsetAsString() {
        return this.convertToTimeString(this.calcSunSet(), false);
    }

    getDayLength() {
        return this.convertToTimeString(this.calcSunSet() - this.calcSunRise(), true);
    }

    getDayLengthAsMinutes() {
        return (this.calcSunSet() - this.calcSunRise())*24;
    }
}






