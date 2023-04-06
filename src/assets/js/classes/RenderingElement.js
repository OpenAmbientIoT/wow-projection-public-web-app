export default class RenderingElement {
    constructor() {
        this.id = null
        this.x = 0
        this.y = 0
        this.created = Date.now()

        this.size = 128
        this.basicSize = 128
        this.diskSize = 128
        this.colored = false
        this.debug = false

        this.event = {
            tag: '',
            name: '',
            value: '',
            raw: '',
            timestamp: '',
        }

        this.predecessor = null

        this.rendering = {

        }
    }

    inject(data) {
        if (data) {
            this.x = data.x ? data.x : 0
            this.y = data.y ? data.y : 0
        }
    }
}
