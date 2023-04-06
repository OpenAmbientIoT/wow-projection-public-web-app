<template v-if="brandOverlay.enabled">
  <div class="c-overlay"
       :style="`${brandOverlay.position};`"
       ref="draggableContainer" @mousedown="dragMouseDown">
    <div class="c-overlay__box" :style="brandOverlay.remoteOverlayStyle()">
      <template v-if="!brandOverlay.remoteOverlayStyle()">
        <div class="c-overlay__title">{{ brandOverlay.title }}</div>
        <div class="c-overlay__subtitle">{{ brandOverlay.subtitle }}</div>
      </template>
    </div>
  </div>
</template>

<script setup>
import {defineProps, reactive, ref} from "vue"
import {BrandOverlay} from "@/assets/js/hooks/useBrandOverlay"

const props = defineProps({
  brandOverlay: BrandOverlay,
  appSettings: Object,
})

const brandOverlayRef = reactive(props.brandOverlay) // todo how to improve?
const appSettings = reactive(props.appSettings)

const draggableContainer = ref()

const positions = {
  clientX: undefined,
  clientY: undefined,
  movementX: 0,
  movementY: 0
}

const dragMouseDown = function (event) {
  event.preventDefault()
  // Get the mouse cursor position at startup
  positions.clientX = event.clientX
  positions.clientY = event.clientY
  document.onmousemove = elementDrag
  document.onmouseup = closeDragElement
}

const overlayWidth = BrandOverlay.sizeWidth
const overlayHeight = BrandOverlay.sizeHeight

const elementDrag = function (event) {
  event.preventDefault()
  positions.movementX = positions.clientX - event.clientX
  positions.movementY = positions.clientY - event.clientY
  positions.clientX = event.clientX
  positions.clientY = event.clientY

  // Calculate element's new position:
  let top = (draggableContainer.value.offsetTop - positions.movementY)
  let left = (draggableContainer.value.offsetLeft - positions.movementX)

  // Prevent moving out of window
  if (top < 0) top = 0
  if (left < 0) left = 0
  if (top > window.innerHeight - overlayHeight) top = window.innerHeight - overlayHeight
  if (left > window.innerWidth - overlayWidth) left = window.innerWidth - overlayWidth

  draggableContainer.value.style.top = top + 'px'
  draggableContainer.value.style.left = left + 'px'
  brandOverlayRef.position = `left: ${left + 'px'}; top: ${top + 'px'};`

  // Update position in appSettings
  appSettings.brandOverlay.position = brandOverlayRef.position
  //appSettingsMethods.save()
}

const closeDragElement = function () {
  document.onmouseup = null
  document.onmousemove = null
}
</script>

<style scoped lang="sass">
.c-overlay
  z-index: 9990
  position: absolute
  width: 200px
  cursor: grab
  background-color: rgba(0, 0, 0, .7)
  border-radius: 6px
  border: 1px solid rgba(255, 255, 255, .1)

  &__box
    padding: 8px 20px
    height: 80px
    background-size: cover
    background-position: center
    background-repeat: no-repeat

  &__title
    color: white
    font-size: .8em
    font-weight: bold
    text-align: left
    position: relative
    top: 14px

  &__subtitle
    color: rgba(255, 255, 255, .9)
    font-size: .8em
    text-align: left
    background-image: url(@/assets/img/wiliot-logo-white.png)
    background-repeat: no-repeat
    background-size: 72px
    background-position: 86px 0
    padding-top: 12px
</style>