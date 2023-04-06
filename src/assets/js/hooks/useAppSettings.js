import {reactive} from 'vue'
import {rssiConfig} from "@/assets/js/helpers/rssi";
import {eventsConfig} from "@/assets/js/classes/events/EventsConfig";
import {consoleLogs, updateAppSettingsLogs} from "@/assets/js/hooks/useConsoleLog";
import {BrandOverlay} from "@/assets/js/hooks/useBrandOverlay";

const currentVersion = 3 // version of app settings structure
export default function useAppSettings() {
    const appSettings = reactive({
        version: currentVersion,

        simulationMode: false,
        simulationEventsPerSecond: 10,

        basicSize: 35,
        diskSize: 85,
        temperatureDiskTimeout: 300,
        minCelsius: 20,
        maxCelsius: 30,

        idsMap: new Map(),

        gridMode: false,
        crosshairCursor: false,

        isSoundOn: false,
        isSoundSimultaneous: false,
        soundFileName: 'bell-high.mp3',

        eventsTypes: [],

        rssiScaleFactor: 20,
        rssiResizeEvents: [],

        debugMode: false,
        consoleEvents: false,
        consoleRenderingInfo: false,
        consoleLifetimeInfo: false,
        consoleFadingInfo: false,
        consoleLogs: [],

        mqttHost: null,
        mqttPort: null,
        mqttTopic: null,
        mqttUsername: null,
        mqttPassword: null,
        mqttMessage: '',
        
        brandOverlay: {
            position: 'left: calc(100vw - ' + BrandOverlay.sizeWidth + 'px - 5px); top: calc(100vh - ' + BrandOverlay.sizeHeight + 'px - 5px);'
        }
    })

    function appSettingsInit() {
        // Get saved app settings
        if (localStorage.getItem('appSettings')) {
            const localAppSettings = JSON.parse(localStorage.getItem('appSettings'))
            if (localAppSettings.version === currentVersion) {
                Object.assign(appSettings, localAppSettings)
            } else {
                // To make it compatible with initial version (v 1) remove
                console.log('Remove previous version appSettings')
                localStorage.removeItem('appSettings')
                appSettingsInit()
                return false
            }
        } else {
            localStorage.setItem('appSettings', JSON.stringify(appSettingsMethods.forStorage()))
        }

        idsArrayToMap()

        // TODO Check / use local storage saved vals?
        // Events to be resized by RSSI
        if (appSettings.rssiResizeEvents.length !== rssiConfig.resizeEvents.length) {
            appSettings.rssiResizeEvents = rssiConfig.resizeEvents
        }
        // Event types
        if (appSettings.eventsTypes.length !== eventsConfig.eventsTypes.length) {
            appSettings.eventsTypes = eventsConfig.eventsTypes
        }
        // Console logs
        if (appSettings.consoleLogs.length !== consoleLogs.length) {
            appSettings.consoleLogs = consoleLogs
        }
        updateAppSettingsLogs(appSettings)
    }

    // Make and assign Map if idsMap was store in local storage as Array
    function idsArrayToMap() {
        // Make and assing Map if idsMap was store in local storage as Array
        if (Array.isArray(appSettings.idsMap)) {
            const idsMapInitial = new Map()
            if (appSettings.idsMap && appSettings.idsMap.length) {
                appSettings.idsMap.forEach((savedTagData) => {
                    idsMapInitial.set(savedTagData.tag, savedTagData)
                })
            }
            appSettings.idsMap = idsMapInitial
        }
    }

    function appSettingsForStorage() {
        // Prepare for save
        const forStorage = {...appSettings}
        let uploadedMap = []
        if (forStorage.idsMap.size) {
            uploadedMap = [...forStorage.idsMap.values()]
        }
        forStorage.idsMap = uploadedMap
        return forStorage
    }

    function appSettingsDownload() {
        console.log('Downloading configuration JSON...')
        let text = JSON.stringify(appSettingsForStorage());
        let filename = 'configuration-' + new Date().toISOString().slice(0, 10) + '.json';
        let element = document.createElement('a');
        element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        console.log('Downloading configuration JSON... OK')
    }

    function appSettingsUpload(event) {
        console.log('Uploading configuration JSON...')
        let input = event.target;
        const reader = new FileReader();
        reader.onload = function () {
            Object.assign(appSettings, JSON.parse(reader.result))
            idsArrayToMap()
            updateAppSettingsLogs(appSettings)
            console.log('Uploading configuration JSON... OK')
            console.log(appSettings)
            window.location.reload()
        };

        reader.readAsText(input.files[0]);
    }

    function reset() {
        localStorage.removeItem('appSettings')
        window.location.reload()
    }

    const appSettingsMethods = {
        init: appSettingsInit,
        download: appSettingsDownload,
        upload: appSettingsUpload,
        forStorage: appSettingsForStorage,
        reset: reset,
    }

    return {
        appSettings,
        appSettingsMethods
    }
}
