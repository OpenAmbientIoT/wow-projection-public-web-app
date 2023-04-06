import {ref} from "vue";

export default function useRSSI() {
    const averageRssi = ref(70)
    let lastRssiCalculation = 0
    const rssiAppliedTagsList = ref(new Map())


    return {averageRssi, lastRssiCalculation, rssiAppliedTagsList}
}