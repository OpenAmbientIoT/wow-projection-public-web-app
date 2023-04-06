<template>
  <WaveletComponent :wavelet="wavelet"></WaveletComponent>
</template>

<script setup>
import {defineProps} from "vue"
import WaveletElement from "@/assets/js/classes/WaveletElement"
import WaveletComponent from "@/components/WaveletComponent"

defineProps({
  wavelet: WaveletElement,
})
</script>

<style scoped>

</style>
