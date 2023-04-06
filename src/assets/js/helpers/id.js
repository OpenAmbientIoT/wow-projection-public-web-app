const ids = new Map()
export function generate(alreadyGenerated = null) {
    let generated = false
    while (!generated) {
        const uid = ("0000" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36)).slice(-4)
        if (!alreadyGenerated) {
            alreadyGenerated = ids
        }

        if (!alreadyGenerated.get(uid)) {
            generated = true
            alreadyGenerated.set(uid, true)
            return uid
        }
    }
}
