<template>
  <div class="wavelet-gr wavelet-gr_eternal" :style="('left:' + (map.x - size/2) + 'px; top:' + (map.y - size/2) + 'px;')
        + ('width: ' + size + 'px;' + 'height: ' + size + 'px;')">
    <div class="wavelet-gr__value" :style="`font-size: ${size/10 < 6 ? 6 : size/10}px;`">{{ map.tag.slice(-4) }}</div>
  </div>
</template>

<script setup>
import {defineProps} from "vue"

// eslint-disable-next-line
const props = defineProps({
  size: Number,
  map: Object,
})
</script>

<style scoped lang="sass">

.wavelet-gr
  position: absolute
  border: 1px solid rgba(255,255,255,.3)
  border-radius: 100%

  &_eternal
    opacity: .5
    // Vertical cross line
    &:before
      content: ''
      display: block
      width: 1px
      height: calc(100% + 6px)
      background-color: #fff
      left: 50%
      position: absolute
      transform: translateY(-3px)
    // Horizontal cross line
    &:after
      content: ''
      display: block
      width: calc(100% + 6px)
      height: 1px
      background-color: #fff
      top: 50%
      position: absolute
      transform: translateX(-3px)


  &__value
    color: rgba(255, 255, 255, 1)
    background-color: black
    display: inline-block
    position: absolute
    left: 50%
    transform: translateX(-50%)
    top: 10%
    font-weight: 500
    padding: 0 4px
    text-align: center
    border-radius: 6px
    z-index: 110

</style>
