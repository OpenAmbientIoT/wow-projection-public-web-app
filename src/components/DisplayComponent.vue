<template>
  <div :class="'display' + (backgroundImageEnabled ? ' display_bg' : '')"
       v-on:mousemove="updateCoordinates"
       :style="(appSettings.gridMode && appSettings.crosshairCursor ? 'cursor: crosshair;' : '') +
       (appSettings.gridMode ? 'box-shadow: inset 0 0 0 2px wheat;' : '') +
       (backgroundImageEnabled && backgroundImage ? 'background-image: url(' + backgroundImage + ')' : '')">

    <!-- Video background container -->
    <video v-if="backgroundVideoEnabled && backgroundVideo" autoplay muted loop id="video">
      <source :src="backgroundVideo" type="video/mp4">
    </video>

    <BrandOverlayComponent :brandOverlay="brandOverlay"></BrandOverlayComponent>

    <!-- Wavelets to display -->
    <!-- SVG -->
    <template v-for="[key, wavelet] in wavelets" :key="key">
      <SvgWaveletComponent :wavelet="wavelet"/>
    </template>


    <!-- Grid mode enabled -->
    <template v-if="appSettings.gridMode">
      <template v-for="[key, map] in appSettings.idsMap" :key="key">
        <GridWaveletComponent :size="appSettings.basicSize" :map="map"/>
      </template>

      <!-- Coordinates tooltip -->
      <div class="mouse-coordinates-tooltip"
           :style="'top: ' + mouseTooltip.position.y + 'px; left: ' + mouseTooltip.position.x + 'px;'">
        <span class="me-3"><span class="fw-lighter opacity-75">X:</span> {{ mouse_x }}</span>
        <span><span class="fw-lighter opacity-75">Y:</span> {{ mouse_y }}</span>
      </div>
    </template>

    <div class="ui-wrapper mb-3" :style="uiConfiguration.positions[uiPosition].style">
      <div class="ui-container-toggle" :style="(appSettings.idsMap.size === 0 ? 'display: block !important; ' : '')">

        <!--CSV upload-->
        <div class="mb-3">
          <label for="map-file-upload" class="form-label small"><span class="text-white-50">Upload map CSV</span>
            (<span
                :style="appSettings.idsMap.size === 0 ? 'color: red' : 'color: green'"> {{ appSettings.idsMap.size }} ids loaded</span>)</label>
          <input class="form-control form-control-sm" id="map-file-upload" type="file" @change="openFile" accept=".csv">
        </div>
        <hr>

        <!-- Controls-->
        <div class="accordion mb-1">
          <!-- MQTT-->
          <div class="accordion-item">
            <div class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                      data-bs-target="#accordion-item-mqtt">
                MQTT
                <!-- Connection status -->
                <span class="connection-status ms-1" :class="connectionStatus"
                      :style="'background-color:' + connectionStatus + '; opacity: ' + (connectionState ? 1 : .4) + ';'"></span>

              </button>
            </div>
            <div id="accordion-item-mqtt" class="accordion-collapse collapse">
              <div class="accordion-body">
                <div class="text-white-50 mb-3">
                  <div class="small text-muted">Events total: {{ eventsCounter }}</div>
                  <div class="small text-muted">Events per second: {{ eventsPerSecond }}</div>

                  <hr>

                  <div class="text-white-50 me-3 mb-1">WebSocket Connection</div>
                  <div class="small mb-4">
                    <span class="opacity-75 fw-lighter">Topic:</span> <input class="form-control form-control-sm mb-1"
                                                                             placeholder="Topic"
                                                                             @change="updateMqttSettings(appSettings)"
                                                                             v-model="appSettings.mqttTopic">
                  </div>
                  <div class="btn-group btn-group-sm w-100" role="group">
                    <button type="button" class="btn btn-primary w-100"
                            v-on:click="disconnect()">Disconnect
                    </button>
                    <button type="button" class="btn btn-primary w-100"
                            v-on:click="connect()">Connect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Example-->
          <div class="accordion-item d-none">
            <div class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                      data-bs-target="#accordion-item-example">
                Example
              </button>
            </div>
            <div id="accordion-item-example" class="accordion-collapse collapse">
              <div class="accordion-body">
              </div>
            </div>
          </div>

          <!-- Simulate wavelets switch -->
          <div class="accordion-item">
            <div class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                      data-bs-target="#accordion-item-simulation">
                Simulation
              </button>
            </div>
            <div id="accordion-item-simulation" class="accordion-collapse collapse">
              <div class="accordion-body">
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" v-model="appSettings.simulationMode" id="sim-checkbox"
                         @change="simulationSwitched">
                  <label class="form-check-label" for="sim-checkbox" style="color: white">
                    Enable
                  </label>
                </div>
                <div>
                  <div class="text-white-50 me-3 mb-2 small">Events per second</div>
                  <input class="form-control form-control-sm mb-2" type="number" placeholder="Set amount"
                         style="max-width: 110px" v-model="appSettings.simulationEventsPerSecond">
                </div>
              </div>
            </div>
          </div>

          <!-- Grid view switch -->
          <div class="accordion-item">
            <div class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                      data-bs-target="#accordion-item-grid">
                Grid
              </button>
            </div>
            <div id="accordion-item-grid" class="accordion-collapse collapse">
              <div class="accordion-body">
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" v-model="appSettings.gridMode" id="grid-checkbox">
                  <label class="form-check-label" for="grid-checkbox" style="color: white">
                    Enable
                  </label>
                </div>
                <!-- Crosshair cursor switch        -->
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" v-model="appSettings.crosshairCursor"
                         id="crosshair-checkbox">
                  <label class="form-check-label" for="crosshair-checkbox" style="color: white">
                    Crosshair cursor
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Rendering -->
          <div class="accordion-item">
            <div class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                      data-bs-target="#accordion-item-rendering">
                Rendering
              </button>
            </div>
            <div id="accordion-item-rendering" class="accordion-collapse collapse">
              <div class="accordion-body">

                <!-- Basic wavelet size -->
                <div>
                  <div class="text-white-50 me-3 mb-2">Basic wavelet size ↔</div>
                  <input class="form-control form-control-sm mb-2" type="number" placeholder="Size in pixels"
                         style="max-width: 80px" v-model="appSettings.basicSize">
                  <button type="button" class="btn btn-outline-secondary btn-sm me-2"
                          v-on:click="appSettings.basicSize = 32">32
                  </button>
                  <button type="button" class="btn btn-outline-secondary btn-sm me-2"
                          v-on:click="appSettings.basicSize = 64">64
                  </button>
                  <button type="button" class="btn btn-outline-secondary btn-sm me-2"
                          v-on:click="appSettings.basicSize = 128">128
                  </button>
                  <button type="button" class="btn btn-outline-secondary btn-sm me-2"
                          v-on:click="appSettings.basicSize = 196">196
                  </button>
                  <button type="button" class="btn btn-outline-secondary btn-sm me-2"
                          v-on:click="appSettings.basicSize = 256">256
                  </button>
                </div>
                <hr>

                <!-- Disk size -->
                <div>
                  <div class="text-white-50 me-3 mb-2">Disk size ↔</div>
                  <input class="form-control form-control-sm mb-2" type="number" placeholder="Size in pixels"
                         style="max-width: 80px" v-model="appSettings.diskSize">
                  <button type="button" class="btn btn-outline-secondary btn-sm me-2"
                          v-on:click="appSettings.diskSize = 32">32
                  </button>
                  <button type="button" class="btn btn-outline-secondary btn-sm me-2"
                          v-on:click="appSettings.diskSize = 64">64
                  </button>
                  <button type="button" class="btn btn-outline-secondary btn-sm me-2"
                          v-on:click="appSettings.diskSize = 128">128
                  </button>
                  <button type="button" class="btn btn-outline-secondary btn-sm me-2"
                          v-on:click="appSettings.diskSize = 196">196
                  </button>
                  <button type="button" class="btn btn-outline-secondary btn-sm me-2"
                          v-on:click="appSettings.diskSize = 256">256
                  </button>
                </div>
                <hr>

                <!-- Color disk timeout -->
                <div>
                  <div class="text-white-50 me-3 mb-2">Color disk timeout, s</div>
                  <input class="form-control form-control-sm mb-2" type="number" placeholder="Amount in seconds"
                         style="max-width: 80px" v-model="appSettings.temperatureDiskTimeout">
                </div>
                <hr>

                <!-- Min Max Temp settings -->
                <div class="row">
                  <div class="col">
                    <div class="text-white-50 me-3 mb-2">Min t</div>
                    <input class="form-control form-control-sm mb-2" type="number" placeholder="Min t"
                           v-model="appSettings.minCelsius">
                  </div>
                  <div class="col">
                    <div class="text-white-50 me-3 mb-2">Max t</div>
                    <input class="form-control form-control-sm mb-2" type="number" placeholder="Max t"
                           v-model="appSettings.maxCelsius">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- RSSI-->
          <div class="accordion-item">
            <div class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                      data-bs-target="#accordion-item-rssi">
                RSSI
              </button>
            </div>
            <div id="accordion-item-rssi" class="accordion-collapse collapse">
              <div class="accordion-body">
                <!-- Rssi scale factor -->
                <div>
                  <div class="text-white-50 me-3 mb-2">RSSI scale factor</div>
                  <input class="form-control form-control-sm mb-2 d-inline-block" type="number"
                         placeholder="Size in pixels"
                         style="max-width: 80px" v-model="appSettings.rssiScaleFactor"> <span
                    class="text-muted small ms-3"> Average RSSI {{ averageRssi }}</span>
                  <div class="text-muted mt-1 font-monospace" style="font-size: 9px">ui size * (scale/10) * (average
                    rssi/rssi)
                  </div>
                </div>
                <hr>
                <!-- RSSI size for events -->
                <div>
                  <span class="text-white-50 me-1">RSSI-based size</span>
                  <div class="form-check form-switch mb-1" v-for="rssiResizeEvent in appSettings.rssiResizeEvents"
                       :key="rssiResizeEvent.event">
                    <input class="form-check-input" type="checkbox" v-model="rssiResizeEvent.enabled"
                           :id="`rssi-event-size-checkbox-${rssiResizeEvent.event}`">
                    <label class="form-check-label" :for="`rssi-event-size-checkbox-${rssiResizeEvent.event}`"
                           style="color: white">
                      {{ rssiResizeEvent.event }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Background -->
          <div class="accordion-item">
            <div class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                      data-bs-target="#accordion-item-background">
                Background
              </button>
            </div>
            <div id="accordion-item-background" class="accordion-collapse collapse">
              <div class="accordion-body"><!-- Background image -->
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" v-model="backgroundImageEnabled"
                         id="background-image-enable-checkbox">
                  <label class="form-check-label" for="background-image-enable-checkbox" style="color: white">
                    Image
                  </label>
                </div>
                <!-- Upload image -->
                <div v-if="backgroundImageEnabled" class="mb-3">
                  <label for="background-image-upload" class="form-label small"><span
                      class="text-white-50">Upload image</span></label>
                  <input class="form-control form-control-sm" id="background-image-upload" type="file"
                         @change="uploadBackgroundImage" accept=".png, .jpg, .gif">
                </div>
                <!-- Background video -->
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" v-model="backgroundVideoEnabled"
                         id="background-video-enable-checkbox">
                  <label class="form-check-label" for="background-video-enable-checkbox" style="color: white">
                    Video
                  </label>
                </div>
                <!-- Upload video -->
                <div v-if="backgroundVideoEnabled" class="mb-3">
                  <label for="background-video-upload" class="form-label small"><span
                      class="text-white-50">Upload video</span></label>
                  <input class="form-control form-control-sm" id="background-video-upload" type="file"
                         @change="uploadBackgroundVideo" accept=".mp4, .avi, .mov">
                </div>
              </div>
            </div>
          </div>

          <!--Play sound-->
          <div class="accordion-item">
            <div class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                      data-bs-target="#accordion-item-sound"
              >
                Sound
              </button>
            </div>
            <div id="accordion-item-sound" class="accordion-collapse collapse">
              <div class="accordion-body">
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" v-model="appSettings.isSoundOn"
                         id="sound-on-checkbox">
                  <label class="form-check-label" for="sound-on-checkbox" style="color: white">
                    Enable 🔉
                  </label>
                </div>
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" v-model="appSettings.isSoundSimultaneous"
                         id="sound-simultaneous-checkbox">
                  <label class="form-check-label" for="sound-simultaneous-checkbox" style="color: white">
                    Play simultaneous
                  </label>
                </div>
                <!-- specify mp3 -->
                <div class="text-white-50 small mb-2">Select mp3</div>
                <select class="form-select form-select-sm mb-1" aria-label="" v-model="appSettings.soundFileName"
                        @change="soundFileChanged">
                  <option v-for="file in soundLibrary.files" :value="file" :key="file">{{ file }}</option>
                </select>
                <!-- upload mp3 -->
                <div class="mb-3">
                  <label for="mp3-upload" class="form-label small"><span
                      class="text-white-50">Or upload mp3</span></label>
                  <input class="form-control form-control-sm" id="mp3-upload" type="file" @change="uploadMp3"
                         accept=".mp3">
                </div>
              </div>
            </div>
          </div>

          <!-- Events -->
          <div class="accordion-item">
            <div class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                      data-bs-target="#accordion-item-events">
                Events
              </button>
            </div>
            <div id="accordion-item-events" class="accordion-collapse collapse">
              <div class="accordion-body">

                <!-- Handle events -->
                <div>
                  <span class="text-white-50 me-1">Handle events</span>
                  <div class="form-check form-switch mb-1" v-for="eventType in appSettings.eventsTypes"
                       :key="eventType.name">
                    <input class="form-check-input" type="checkbox" v-model="eventType.enabled"
                           :id="`handle-wavelets-checkbox-${eventType.name}`">
                    <label class="form-check-label" :for="`handle-wavelets-checkbox-${eventType.name}`"
                           style="color: white">
                      {{ eventType.name }}
                    </label>
                  </div>
                </div>
                <hr>
              </div>
            </div>
          </div>

          <!-- Debug -->
          <div class="accordion-item">
            <div class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                      data-bs-target="#accordion-item-debug">
                Debug
              </button>
            </div>
            <div id="accordion-item-debug" class="accordion-collapse collapse">
              <div class="accordion-body">

                <div class="form-check form-switch mb-1">
                  <input class="form-check-input" type="checkbox" v-model="appSettings.debugMode"
                         id="debug-wavelets-checkbox">
                  <label class="form-check-label" for="debug-wavelets-checkbox" style="color: rosybrown">
                    Debug mode
                  </label>
                </div>
                <hr>
                <!-- Console log -->
                <div>
                  <span class="text-white-50 me-1">Console log</span>
                  <div class="form-check form-switch mb-1" v-for="consoleLog in appSettings.consoleLogs"
                       :key="consoleLog.name">
                    <input class="form-check-input" type="checkbox" v-model="consoleLog.enabled"
                           :id="`console-log-checkbox-${consoleLog.name}`">
                    <label class="form-check-label" :for="`console-log-checkbox-${consoleLog.name}`"
                           style="color: white">
                      {{ consoleLog.name }}
                    </label>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>  <!-- end of accordion -->

        <div class="accordion accordion-mb">
          <!-- Configuration -->
          <div class="accordion-item">
            <div class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                      data-bs-target="#accordion-item-configuration">
                Configuration
              </button>
            </div>
            <div id="accordion-item-configuration" class="accordion-collapse collapse">
              <div class="accordion-body">
                <div class="text-white-50 mb-3">
                  <!--JSON config download-->
                  <div class="small text-white-50 me-3 mb-2">Download JSON</div>
                  <div class="d-grid gap-1 mb-3">
                    <button class="btn btn-sm btn-primary" @click="appSettingsMethods.download">Download</button>
                  </div>
                  <!--JSON config upload-->
                  <div class="mb-4">
                    <label for="configuration-upload" class="form-label small"><span
                        class="text-white-50">Upload JSON</span></label>
                    <input class="form-control form-control-sm" id="configuration-upload" type="file"
                           @change="appSettingsMethods.upload" accept=".json">
                  </div>
                  <!--JSON config download-->
                  <div class="mb-1">
                    <div class="small text-white-50 me-3 mb-2">Default Configuration</div>
                    <div class="d-grid gap-1 mb-3">
                      <button class="btn btn-sm btn-dark" @click="appSettingsMethods.reset">Use Default</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--UI Position-->
        <div class="ui-position-toggle">
          <span class="text-white-50 mt-4 mb-2 me-2">UI position</span>
          <div class="btn-group btn-group-sm" role="group">
            <button type="button" class="btn btn-outline-light"
                    v-on:click="uiPosition = 0">Left
            </button>
            <button type="button" class="btn btn-outline-light"
                    v-on:click="uiPosition = 1">Right
            </button>
          </div>
          <div class="app-version mt-3">Version {{ require('../../package.json').version }}</div>

        </div>


      </div>

    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, reactive, watch, onBeforeMount} from 'vue'
import useAppSettings from "@/assets/js/hooks/useAppSettings";
import WaveletElement from "@/assets/js/classes/WaveletElement";

const {appSettings, appSettingsMethods} = useAppSettings()

const wavelets = ref(new Map())

import BrandOverlayComponent from "@/components/BrandOverlayComponent"
import useBrandOverlay from "@/assets/js/hooks/useBrandOverlay";

const {brandOverlay} = useBrandOverlay()

import useBackgrounds from "@/assets/js/hooks/useBackgrounds";
// eslint-disable-next-line
const {
  backgroundImageEnabled,
  backgroundImage,
  uploadBackgroundImage,
  backgroundVideoEnabled,
  backgroundVideo,
  uploadBackgroundVideo
} = useBackgrounds()


import useMqtt from "@/assets/js/hooks/useMqtt";


const {mqttClient, updateMqttSettings} = useMqtt()


function connect() {
  updateMqttSettings(appSettings)
  mqttClient.createConnection(processMessage, renderConnectionStatus)
  mqttClient.doSubscribe()
}

function disconnect() {
  mqttClient.doUnSubscribe()
  mqttClient.destroyConnection()
  connectionStatus.value = 'red'
}


import {RSSI, TEMP_C} from "@/assets/js/classes/events/EventsConfig";

import useEventsCounter from "@/assets/js/hooks/useEventsCounter"

const {eventsCounter, eventsPerSecond, eventsStartedAtMs, averageEventsPerSecond} = useEventsCounter()


import {rgbColor} from "@/assets/js/helpers/temperaturecolor"
import {humanReadableTime} from "@/assets/js/helpers/time"
import SvgWaveletComponent from "@/components/SvgWaveletComponent"
import GridWaveletComponent from "@/components/GridWaveletComponent"
import EventsBuilder from "@/assets/js/classes/EventsBuilder"


import useRSSI from "@/assets/js/hooks/useRSSI";

const {averageRssi, rssiAppliedTagsList} = useRSSI()

import {toSize, isRssiSizeForEventEnabled} from "@/assets/js/helpers/rssi";

import {isObject} from "@/assets/js/helpers/check"

// Parse event message, create wavelet element, inject necessary data into wavelet
function processMessage(message) {
  if (appSettings.gridMode === true) {
    return false
  }

  if (appSettings.consoleEvents) console.log(message)

  if (typeof message !== 'string') {
    return false
  }

  // Get event data
  const event = EventsBuilder.parse(message, appSettings.eventsTypes)
  if (!event) {
    if (appSettings.consoleEvents) console.log('Skip message ' + message + ' (ignored, disabled or can\'t parse)')
    return false
  }
  if (appSettings.consoleEvents) console.log(event)

  // Get element tagCsvData (csv data)
  const tagCsvData = appSettings.idsMap.get(event.tag)
  if (!tagCsvData) {
    if (appSettings.consoleRenderingInfo) console.log('Tag ' + event.tag + ' (' + event.timestamp + ' / ' + humanReadableTime(event.timestamp) + ') is not in map!')
    return false
  }
  // Create new wavelet element
  const wavelet = new WaveletElement();
  wavelet.event = event
  wavelet.id = event.tag

  // When non TEMP_C event check if we have already TEMP_C wavelet (to continue render of color disc)
  // EXISTING wavelets
  if (event.name !== TEMP_C && wavelets.value.has(event.tag)) {
    const existing = wavelets.value.get(event.tag) // existing is 100% not null here
    if (existing.event.name === TEMP_C) {
      // Skip the all other events if TEMP_C wavelet already exists and renders
      // (before lifetime of 10s is not passed)
      if (existing.options.ringsFadeout !== true) {
        return false;
      }
      wavelet.predecessor = existing
    } else if (existing.predecessor && existing.predecessor.event.name === TEMP_C) {
      wavelet.predecessor = existing.predecessor
    }
  }

  if (!wavelet.color) {
    const temp = isObject(wavelet.event.value) ? wavelet.event.value.TEMP : wavelet.event.value
    if (temp && temp !== "null") {
      const color = rgbColor(temp, appSettings.minCelsius, appSettings.maxCelsius)
      wavelet.color = color ? `rgb(${color[0]},${color[1]},${color[2]})` : null
    }
  }

  // Calculate size
  let size = appSettings.basicSize
  // Add RSSI value
  if (event.name === RSSI) {
    rssiAppliedTagsList.value.set(event.tag, event.raw)
    // Prevent from average being calculated too often
    //const secondsPassed = Math.floor((new Date() - lastRssiCalculation)/1000)
    //if (lastRssiCalculation === 0 || secondsPassed > 60) {
    //  averageRssi.value = calculateAverageRssi(rssiAppliedTagsList.value)
    //  lastRssiCalculation = new Date()
    //}
  }

  if (rssiAppliedTagsList.value.has(event.tag) && isRssiSizeForEventEnabled(appSettings.rssiResizeEvents, event.name)) {
    // Use RSSI-sizing
    size = toSize(averageRssi.value, rssiAppliedTagsList.value.get(event.tag), appSettings)
  } else if (tagCsvData.size) {
    // If available use CSV-sizing
    size = tagCsvData.size
  }

  const values = {
    size,
    basicSize: appSettings.basicSize,
    diskSize: appSettings.diskSize,
    debug: appSettings.debugMode,
  }
  Object.assign(wavelet, values)
  wavelet.inject(tagCsvData)

  // RENDER wavelet (add to list)
  wavelets.value.set(event.tag, wavelet)

  // Events counter (currently counting only parsed and added events)
  eventsCounter.value++
  if (eventsStartedAtMs.value === null) {
    eventsStartedAtMs.value = new Date().getTime()
  }
  averageEventsPerSecond() // update count

  // Console
  if (appSettings.consoleRenderingInfo) console.log('Tag ' + event.tag + ' (' + event.timestamp + ' / ' + humanReadableTime(event.timestamp) + ') is in map. Render.')

  // Sound
  if (appSettings.isSoundOn) {
    if (appSettings.isSoundSimultaneous) {
      sound = new Audio(soundFilePath)
    }
    sound.play()
  }


}

import {parse} from "@/assets/js/helpers/csv"

function openFile(event) {
  let input = event.target;
  const reader = new FileReader();
  reader.onload = function () {
    appSettings.idsMap = parse(reader.result)
    console.log('Uploaded CSV:');
    console.log(reader.result.substring(0, 200));
  };

  reader.readAsText(input.files[0]);
}


function simulationSwitched() {
  if (appSettings.simulationMode === true) {
    disconnect()
    connectionStatus.value = 'green'
    runSimulation()
  } else {
    connectionStatus.value = 'red'
    connect()
  }
}

import useSimulation from "@/assets/js/hooks/useSimulation";

const {generateMessage} = useSimulation()

function runSimulation() {
  if (appSettings.simulationMode === false) {
    return false
  }
  connectionState.value = !connectionState.value
  const message = generateMessage(appSettings.eventsTypes, appSettings.idsMap)
  processMessage(message)
  const divider = appSettings.simulationEventsPerSecond > 0 ? appSettings.simulationEventsPerSecond : 10
  setTimeout(runSimulation, 1000 / divider)
}

const connectionState = ref(true)
const connectionStatus = ref('red')

function renderConnectionStatus(status) {
  connectionState.value = !connectionState.value
  connectionStatus.value = status
}


function inspectWavelets() {
  const now = Date.now()
  wavelets.value.forEach((wavelet) => {
    let lifetime = 5 // seconds
    let ringsFadeoutTime = 1
    let waveletFadeoutTime = 1
    let ringsLifetime = lifetime

    // Extend temperature wavelets lifetime (based on specified color disc time)

    if (wavelet.event.name === TEMP_C || (wavelet.predecessor && wavelet.predecessor.event.name === TEMP_C)) {
      const temperatureWaveletLifetime = appSettings.temperatureDiskTimeout
      lifetime = lifetime < temperatureWaveletLifetime ? temperatureWaveletLifetime : lifetime
    }

    const milliseconds = now - wavelet.created
    const passedSeconds = Math.floor(milliseconds / 1000)

    // Fadein
    if (!wavelet.options.fadein) {
      if (appSettings.consoleFadingInfo) console.log('Time to fadein for #' + wavelet.event.tag)
      wavelet.options.fadein = true
      if (wavelet.predecessor) {
        wavelet.predecessor.options.fadein = true
      }
    }

    // Start fadeout for wavelet rings for temperature events earlier than fadeout whole wavelet
    if (wavelet.event.name === TEMP_C || (wavelet.predecessor && wavelet.predecessor.event.name === TEMP_C)) {
      if (passedSeconds >= ringsLifetime - ringsFadeoutTime && !wavelet.options.ringsFadeout) {
        // Fadeout rings
        if (appSettings.consoleFadingInfo) console.log('Time to fadeout rings for #' + wavelet.event.tag)
        wavelet.options.ringsFadeout = true
      }
    }

    // Start fadeout for whole wavelet
    if (passedSeconds >= lifetime - waveletFadeoutTime && !wavelet.options.fadeout) {
      if (appSettings.consoleFadingInfo) console.log('Time to fadeout for #' + wavelet.event.tag)
      wavelet.options.fadeout = true
    }

    // Time to remove whole wavelet
    if (passedSeconds >= lifetime) {
      if (appSettings.consoleLifetimeInfo) console.log('Lifetime exceeded ' + lifetime + 's for #' + wavelet.event.tag + ' – removing')
      wavelets.value.delete(wavelet.event.tag)
    }

    // Remove predecessor predecessor
    if (wavelet.predecessor && wavelet.predecessor.predecessor) {
      delete wavelet.predecessor.predecessor
    }
  })

  setTimeout(inspectWavelets, 20)
}


const mouse_x = ref(0)
const mouse_y = ref(0)
const mouseTooltip = reactive({
  position: {
    x: 0,
    y: 0,
  }
})

function updateCoordinates(e) {
  if (appSettings.gridMode) {
    mouse_x.value = e.clientX
    mouse_y.value = e.clientY
    // Update mouse tooltip positioning
    mouseTooltip.position.x = e.clientX
    mouseTooltip.position.y = e.clientY
  }
}

const uiPosition = ref(0)
const uiConfiguration = reactive({
  positions: [
    {
      style: 'left: 0; top: 0;'
    },
    {
      style: 'right: 0; top: 0;'
    },
  ]
})

// Watch event types list changed to clear RSSI from values
watch(appSettings.eventsTypes, () => {
  appSettings.eventsTypes.forEach((eventType) => {
    if (eventType.name === RSSI && !eventType.enabled) {
      rssiAppliedTagsList.value.clear()
      averageRssi.value = 70
    }
  })
})

onBeforeMount(() => {
  //Init settings
  appSettingsMethods.init()
})


//
onMounted(() => {
  // Simulation / connect
  if (appSettings.simulationMode === true) {
    connectionStatus.value = 'green'
    runSimulation()
  } else {
    connectionStatus.value = 'red'
    connect()
  }
  // Remove expired wavelets
  inspectWavelets()

  brandOverlay.runRemoteConfigurationChecker();

  window.addEventListener("beforeunload", leaving);
})

function leaving() {
  console.log('Disconnect on leaving')
  disconnect()
}


// Sound
import {soundLibrary} from "@/assets/js/helpers/sound";
import {updateAppSettingsLogs} from "@/assets/js/hooks/useConsoleLog";

let soundFilePath = soundLibrary.folder + appSettings.soundFileName
let sound = new Audio(soundFilePath)

// Update sound file if changed
function soundFileChanged() {
  soundFilePath = soundLibrary.folder + appSettings.soundFileName
  sound = new Audio(soundFilePath)
}

function uploadMp3(event) {
  let input = event.target;
  if (!input.files.length) return
  soundFilePath = URL.createObjectURL(input.files[0]);
  sound = new Audio(soundFilePath)
}

// Saving settings

watch([
      appSettings,
    ],
    (
        //[appSettingsNew,]
    ) => {
      console.log('Settings watcher triggered')

      if (!appSettings) {
        console.log('No appSettings yet')
        return false
      }

      updateAppSettingsLogs(appSettings)

      console.log('Saving setting to local storage...')
      localStorage.setItem('appSettings', JSON.stringify(appSettingsMethods.forSave()))
      console.log('Saved.')
    })
</script>

<style scoped lang="sass">
body
  background-color: #000

.display
  position: absolute
  left: 0
  top: 0
  right: 0
  bottom: 0
  background-color: #000
  overflow: hidden

  &_bg
    background-size: cover
    background-position: center
    background-color: transparent

// Accordion
.accordion.accordion-mb
  margin-bottom: 70px

.accordion-item
  background: transparent
  border: 1px solid #e7f1ff

.accordion-body
  background-color: rgba(0, 0, 0, .2)

.ui-wrapper
  position: absolute
  width: 300px
  min-height: 100vh
  opacity: 1
  z-index: 9999
  overflow-x: hidden
  overflow-y: auto
  scrollbar-width: none

  & > div
    display: none
    background-color: rgba(33, 33, 33, .95)
    padding: 10px

  &:hover > div
    display: block

  &::-webkit-scrollbar
    display: none


.ui-container-toggle
  position: absolute
  min-height: 100vh
  padding-bottom: 40px

.ui-position-toggle
  position: absolute
  bottom: 10px

.connection-status
  border-radius: 5px
  width: 10px
  height: 10px


.mouse-coordinates-tooltip
  color: wheat
  position: absolute
  font-size: 14px
  font-weight: bold
  left: 0
  top: 0
  transform: translate(0, calc(-100% - 16px))
  padding: 0 4px
  background-color: rgba(0, 0, 0, .5)
  border-radius: 4px
  z-index: 999

hr
  box-shadow: 0 1px 0 0 wheat

#video
  position: absolute
  width: 100vw
  height: 100vh
  object-fit: cover

.app-version
  display: block
  font-size: 10px
  color: #fff
  opacity: .5

</style>
