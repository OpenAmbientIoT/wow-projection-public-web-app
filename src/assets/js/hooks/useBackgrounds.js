import {ref} from 'vue'



export default function useBackgrounds() {
    const backgroundImageEnabled = ref(false)
    const backgroundImage = ref()
    const backgroundVideoEnabled = ref(false)
    const backgroundVideo = ref()

    const uploadBackgroundImage = function (event) {
        let input = event.target;
        if (!input.files.length) return
        backgroundImage.value = URL.createObjectURL(input.files[0]);
    }
    const uploadBackgroundVideo = function (event) {
        let input = event.target;
        if (!input.files.length) return
        backgroundVideo.value = URL.createObjectURL(input.files[0]);
    }

    return {backgroundImageEnabled, backgroundImage, uploadBackgroundImage, backgroundVideoEnabled, backgroundVideo, uploadBackgroundVideo}
}

