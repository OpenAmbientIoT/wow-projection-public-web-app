export function hueColor(temperature, minCelsius, maxCelsius) {

    // HSL wheel counterclockwise from 0
    // to go clockwise, make maxHsl and minHsl negative
    let maxHsl = 370 // maxHsl maps to max temp (here: 10deg to 360)
    let minHsl = 250 //  minhsl maps to min temp
    let rngHsl = maxHsl - minHsl

    let rngTemp = maxCelsius - minCelsius
    let degCnt = maxCelsius - temperature
    let hslsDeg = rngHsl / rngTemp
    return (360 - ((degCnt * hslsDeg) - (maxHsl - 360)))
}

export function rgbColor(temperature, minCelsius, maxCelsius) {
    if (!temperature) {
        return null
    }

    const h = hueColor(temperature, minCelsius, maxCelsius)
    let s = 100
    let l = 50
    //285 - 305 / Make purple darker correction
    if (h > 280 && h <325) {
        l = 50
        s = 30
    }
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [255 * f(0), 255 * f(8), 255 * f(4)];
}
