function toRadians(degrees) {
    let pi = Math.PI;
    return degrees * (pi / 180);
}

function toDegrees(radians) {
    let pi = Math.PI;
    return radians * (180 / pi);
}

function varY(date){
    return Math.tan(toRadians(obliqCorrDeg(date)/2))*Math.tan(toRadians(obliqCorrDeg(date)/2))
}

function eccentEarthOrbit(date){
    return 0.016708634-julianCentury(date)*(0.000042037+0.0000001267*julianCentury(date))
}
function eqOfTime(date){
    return 4*toDegrees(varY(date)*Math.sin(2*toRadians(geomMeanLongSunDeg(date)))-2*eccentEarthOrbit(date)*Math.sin(toRadians(geomMeanAnomSunDeg(date)))+4*eccentEarthOrbit(date)*varY(date)*Math.sin(toRadians(geomMeanAnomSunDeg(date)))*Math.cos(2*toRadians(geomMeanLongSunDeg(date)))-0.5*varY(date)*varY(date)*Math.sin(4*toRadians(geomMeanLongSunDeg(date)))-1.25*eccentEarthOrbit(date)*eccentEarthOrbit(date)*Math.sin(2*toRadians(geomMeanAnomSunDeg(date))));
}

function solarNoon(long, zone, date) {
    return (720 - 4 * long - eqOfTime(date) + zone * 60) / 1440;
}


function julianDay(date){
    return Math.floor((date.getTime() / 86400000) - (date.getTimezoneOffset()/1440) + 2440587.5);
}
function julianCentury(date){
    return (julianDay(date)-2451545)/36525;
}


function meanObliqEcliptic(date) {
    return 23+(26+((21.448-julianCentury(date)*(46.815+julianCentury(date)*(0.00059-julianCentury(date)*0.001813))))/60)/60;
}

function geomMeanLongSunDeg(date) {
    return 280.46646+julianCentury(date)*(36000.76983 + julianCentury(date)*0.0003032) % 360
}
function geomMeanAnomSunDeg(date){
    return 357.52911+julianCentury(date)*(35999.05029 - 0.0001537*julianCentury(date))
}
function sunEqOfCtr(date){
    return Math.sin(toRadians(geomMeanAnomSunDeg(date)))*(1.914602-julianCentury(date)*(0.004817+0.000014*julianCentury(date)))+Math.sin(toRadians(2*geomMeanAnomSunDeg(date)))*(0.019993-0.000101*julianCentury(date))+Math.sin(toRadians(3*geomMeanAnomSunDeg(date)))*0.000289
}

function sunTrueLong(date){
    return geomMeanLongSunDeg(date)+sunEqOfCtr(date);
}
function sunAppLong(date){
    return sunTrueLong(date)-0.00569-0.00478*Math.sin(toRadians(125.04-1934.136*julianCentury(date)));
}


function obliqCorrDeg(date){
    return meanObliqEcliptic(date)+0.00256*Math.cos(toRadians(125.04-1934.136*julianCentury(date)));
}

function sunDeclineDeg(date){
    return toDegrees(Math.asin(Math.sin(toRadians(obliqCorrDeg(date)))*Math.sin(toRadians(sunAppLong(date)))));
}

function HAsunriseDeg(lat, date) {
    return toDegrees(Math.acos(Math.cos(toRadians(90.833))/Math.cos(toRadians(lat))*Math.cos(toRadians(sunDeclineDeg(date)))-Math.tan(toRadians(lat))*Math.tan(toRadians(sunDeclineDeg(date)))));
}

function convertToTimeString(value){
    let c1 = Math.floor(value * 24);
    let hours = c1.toString();
    let minutes = Math.floor((value * 24 - c1)*60).toString();
    return (hours.length == 2 ? hours : "0"+hours) + ":" + (minutes.length == 2 ? minutes : "0"+minutes);
}

function calcSunRise(longitude,latitude, timezone, date) {
    return solarNoon(longitude, timezone, date) - HAsunriseDeg(latitude, date) * 4 / 1440;
}

export function getSunriseAsString(longitude,latitude, timezone, date){
    return convertToTimeString(calcSunRise(longitude,latitude, timezone, date));
}