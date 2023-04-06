import {trim} from "@/assets/js/helpers/trim"
import {ACTIVE, ACTV, GEOLOC, LOCATION, TEMP_C, TEMPERATURE} from "@/assets/js/classes/events/EventsConfig";

export default class EventsBuilder {
    constructor() {
    }


    static parse(string, eventsTypes) {
        //events,tagId=(01)00850027865010(21)00oeT4035,eventName=TEMP_C,eventValue=15.53504436835706,timestamp=1655924635
        const message_pieces = trim(string, '"').split(',')

        // Get only events
        if (message_pieces[0] && message_pieces[0] == 'events') {

            // Iterate over events and check if message belongs to an enabled
            let isEventEnabled = false
            let messageHasEvent = false
            eventsTypes.forEach((eventType) => {
                if (!messageHasEvent && !isEventEnabled) {
                    const match = (piece) => piece.toLowerCase().includes(('eventName=' + eventType.name).toLowerCase())
                    messageHasEvent = message_pieces.some(match)
                    if (eventType.enabled && messageHasEvent) {
                        isEventEnabled = true
                    }
                }
            })


            if (isEventEnabled) {
                const event = {
                    created: Date.now()
                }
                message_pieces.forEach(msg_piece => {
                    if (msg_piece.includes('tagId')) {
                        event.tag = msg_piece.replace('tagId=', '')
                    }
                    // TEMP_C, DBUG, ACTV, ...
                    if (msg_piece.includes('eventName')) {
                        event.name = msg_piece.replace('eventName=', '')
                        if (event.name === TEMPERATURE) {
                            event.name = TEMP_C
                        }
                        if (event.name === LOCATION) {
                            event.name = GEOLOC
                        }
                        if (event.name.toLowerCase() === ACTIVE) {
                            event.name = ACTV
                        }
                    }
                    if (msg_piece.includes('eventValue')) {
                        // Typical event with single value
                        event.value = Number.parseFloat(msg_piece.replace('eventValue=', '')).toFixed(1)
                        event.raw = msg_piece.replace('eventValue=', '')
                    }
                    if (msg_piece.includes('timestamp')) {
                        event.timestamp = parseInt(msg_piece.replace('timestamp=', ''))
                    }
                })
                // Skip ACTV with 0 values
                if (event.name === ACTV && (parseInt(event.value) === 0)) {
                    return  null
                }
                return event
            }
        }
        return null
    }
}
