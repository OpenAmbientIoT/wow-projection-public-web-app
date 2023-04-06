import {reactive} from 'vue'
import axios from 'axios';

export class BrandOverlay {
    'use strict'
    static sizeWidth = 200
    static sizeHeight = 80

    constructor(overlayEnabled, overlayScale, overlayTitle, overlaySubtitle) {
        this.enabled = overlayEnabled
        this.scale = overlayScale
        this.title = overlayTitle
        this.subtitle = overlaySubtitle
        this.remote = {configuration: null}
    }

    /**
     * Get branding configuration from remote server
     */
    remoteConfigurationRequest() {
        const overlayContext = this
        const host = 'backend.wow.equipment'
        const url = 'https://' + host + '/api/branding/configuration'
        axios
            .get(url)
            .then(response => {
                //console.log('API: Getting remote overlay configuration — OK');
                //console.log(response.data)
                if (response.data.success) {
                    if (!overlayContext.remote || !overlayContext.remote.configuration || overlayContext.remote.configuration.background !== response.data.background) {
                        overlayContext.remote = {configuration: response.data}
                    }
                }
            })
            .catch(error => {
                console.log(error);
                const info = {
                    error: true,
                    errorMessage: '⚠︎ API: Remote overlay configuration — Fetching error',
                }
                console.log(info.errorMessage)
            })
            .finally(() => {
                console.log('API: Remote overlay configuration — Finished');
            })
    }

    runRemoteConfigurationChecker() {
        const overlayContext = this
        overlayContext.remote.interval = setInterval(function () {
            overlayContext.remoteConfigurationRequest()
        }, 10000);
    }

    useRemoteOverlay() {
        const overlayContext = this
        return !!(overlayContext.remote.configuration && overlayContext.remote.configuration.background)
    }

    remoteOverlayStyle() {
        const overlayContext = this
        return overlayContext.useRemoteOverlay() ? 'background-image: url("' + overlayContext.remote.configuration.background + '")' : ''
    }
}

export default function useBrandOverlay() {
    const overlayEnabled = true
    const overlayScale = 1
    const overlayTitle = 'Ambient IoT'
    const overlaySubtitle = 'Powered by '

    const brandOverlay = reactive(new BrandOverlay(
        overlayEnabled,
        overlayScale,
        overlayTitle,
        overlaySubtitle,
    ))

    return {brandOverlay}
}