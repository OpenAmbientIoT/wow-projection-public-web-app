export const DBUG = 'DBUG'
export const ACTV = 'ACTV'
export const LOCH = 'LOCH'
export const RSSI = 'RSSI'
export const GEOLOC = 'GEOLOC'
export const TEMP_C = 'TEMP_C'

export const CONNECTIVITY = 'connectivity'
export const LOCATION = 'location'
export const TEMPERATURE = 'temperature'
export const ACTIVE = 'active'

export const eventsConfig = {
    eventsTypes: [
        {
            name: TEMP_C,
            enabled: true,
        },
        {
            name: DBUG,
            enabled: true,
        },
        {
            name: ACTV,
            enabled: true,
        },
        {
            name: LOCH,
            enabled: true,
        },
        {
            name: GEOLOC,
            enabled: true,
        },
        {
            name: RSSI,
            enabled: true,
        },
        {
            name: TEMPERATURE,
            enabled: true,
        },
        {
            name: ACTIVE,
            enabled: true,
        },
        {
            name: LOCATION,
            enabled: true,
        },
        {
            name: CONNECTIVITY,
            enabled: true,
        },
    ],
}
