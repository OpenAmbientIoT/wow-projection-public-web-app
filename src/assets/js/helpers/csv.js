
// Event – file input changed event; into – reactive (ref) map id list
// Todo Currently is not using
export function loadFile(event, into) {
    let input = event.target;
    const reader = new FileReader();
    reader.onload = function () {
        console.log('Loaded file:');
        console.log(reader.result.substring(0, 200));
        into.value = parse(reader.result)
    };

    reader.readAsText(input.files[0]);
}


export function parse(list) {
    const coordinates = new Map()

    if (!list) {
        return coordinates
    }

    const rows = list.replace(/\r\n/g, '\n').split('\n')

    rows.forEach((line) => {
        const splited = line.split(',')
        if (splited[0] != 'ID') { // Skip first line 'ID,1080X,1080Y,SIZE,,,,,,,,'
            const tag = splited[0].replace('tagId=', '')
            const x = parseInt(splited[1])
            const y = parseInt(splited[2])
            const settings = {x: x, y: y}
            settings.tag = tag
            // If wavelet size specified in csv
            const size = parseFloat(splited[3])
            if (size) {
                settings.size = size
            }
            coordinates.set(tag, settings)
        }
    })

    return coordinates;
}