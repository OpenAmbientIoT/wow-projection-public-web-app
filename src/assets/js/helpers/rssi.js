/**
 * last, can you change the scaling factor equation to this:
 * size = (Disk Size)*(Scale Factor / 10) *(average RSSI / RSSI)
 *
 * where:
 * size = rendered RSSI event size
 * disk size = user input disk size
 * scale factor = user input scale factor
 * RSSI = RSSI event data
 * average RSSI = 65
 *
 * Convert RSSI value to wavelet size
 * @param {number} avgRssi  Average RSSI value
 * @param {number} rssi  RSSI value (higher value = lower signal) (suggested: e.g 80 meaning -80db, 60 — -60db, etc.)
 * scale – Multiplier for final size,
 * size – UI disk size
 */
export function toSize(avgRssi, rssi, appSettings) {
    const scale = appSettings.rssiScaleFactor
    const size = appSettings.basicSize
    return Math.abs((size * (scale/10) * (avgRssi/rssi))).toFixed(1)
}

/**
 *
 * @param {Map} rssis List of RSSI values for tags
 * @returns {number} Average RSSI value
 */
export function calculateAverageRssi(rssis) {
    let sum = 0
    rssis.forEach((value) => {
        sum += Number.parseFloat(value)
    })
    return (sum / rssis.size).toFixed(1)
}

import {RSSI, TEMP_C, DBUG, ACTV, LOCH, GEOLOC, TEMPERATURE, LOCATION, CONNECTIVITY} from "@/assets/js/classes/events/EventsConfig"

/**
 * RSSI config
 * resizeEvents – events list for which will be applied calculated RSSI size if enabled
 * @type {{resizeEvents: [{event: string, enabled: boolean},{event: string, enabled: boolean},{event: string, enabled: boolean},{event: string, enabled: boolean},{event: string, enabled: boolean},null]}}
 */
export const rssiConfig = {
    resizeEvents: [
        {
            event: RSSI,
            enabled: true,
        },
        {
            event: TEMP_C,
            enabled: true,
        },
        {
            event: DBUG,
            enabled: true,
        },
        {
            event: ACTV,
            enabled: true,
        },
        {
            event: LOCH,
            enabled: true,
        },
        {
            event: GEOLOC,
            enabled: true,
        },
        {
            event: TEMPERATURE,
            enabled: true,
        },
        {
            event: LOCATION,
            enabled: true,
        },
        {
            event: CONNECTIVITY,
            enabled: true,
        },
    ]
}

// rssi
export function isRssiSizeForEventEnabled(resizeEvents, event) {
    return resizeEvents.find(eventConf => (eventConf.event === event && eventConf.enabled === true))
}

export function isRssiSizeForEventEnabledI(event) {
    let eventEnabled = false
    rssiConfig.resizeEvents.forEach((eventConf) => {
        if (eventConf.event == event && eventConf.enabled === true) {
            eventEnabled = true
        }
    })
    return eventEnabled
}

export function isRssiSizeForEventEnabledA(event) {
    const enabled = rssiConfig.resizeEvents.map((eventConf) => {
        if (eventConf.event == event && eventConf.enabled === true) {
            return true
        }
        return false
    })

    return enabled
}