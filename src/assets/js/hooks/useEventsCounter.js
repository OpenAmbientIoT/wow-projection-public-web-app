import {ref} from 'vue'

export default function useEventsCounter() {
    const eventsCounter = ref(0)
    const eventsStartedAtMs = ref(null)
    const eventsPerSecond = ref(0)

    function averageEventsPerSecond() {
        if (eventsStartedAtMs.value === null) {
            eventsPerSecond.value = 0
            return false
        }
        const now = new Date()
        const nowMs = now.getTime()
        const passedMs = nowMs - eventsStartedAtMs.value
        const passedS = passedMs / 1000
        eventsPerSecond.value = Math.round(eventsCounter.value/passedS)
        return eventsPerSecond.value
    }

    return { eventsCounter, eventsStartedAtMs, eventsPerSecond, averageEventsPerSecond }
}

