export const LOG_EVENTS = 'LOG_EVENTS'
export const LOG_RENDERING_INFO = 'LOG_RENDERING_INFO'
export const LOG_LIFETIME_INFO = 'LOG_LIFETIME_INFO'
export const LOG_FADING_INFO = 'LOG_FADING_INFO'

export const consoleLogs = [
    {
        type: LOG_EVENTS,
        name: 'Events',
        enabled: false,
    },
    {
        type: LOG_RENDERING_INFO,
        name: 'Rendering',
        enabled: false,
    },
    {
        type: LOG_LIFETIME_INFO,
        name: 'Lifetime',
        enabled: false,
    },
    {
        type: LOG_FADING_INFO,
        name: 'Fading',
        enabled: false,
    },
]


function isLogEnabled(logType, appSettings) {
    return appSettings.consoleLogs.find(consoleLog => (consoleLog.type === logType && consoleLog.enabled === true))
}

export function updateAppSettingsLogs(appSettings) {
    appSettings.consoleEvents = isLogEnabled(LOG_EVENTS, appSettings)
    appSettings.consoleRenderingInfo = isLogEnabled(LOG_RENDERING_INFO, appSettings)
    appSettings.consoleLifetimeInfo = isLogEnabled(LOG_LIFETIME_INFO, appSettings)
    appSettings.consoleFadingInfo = isLogEnabled(LOG_FADING_INFO, appSettings)
}