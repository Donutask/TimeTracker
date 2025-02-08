var mainData: TimeTrackerData;

function SaveData() {
    localStorage.setItem(dataStorageKey, mainData.Serialize());
}
function LoadData() {
    let stringData = localStorage.getItem(dataStorageKey);
    if (stringData != null)
        Load(stringData);
}

function Load(stringData: string) {
    if (stringData != null) {
        let parsedJSON = JSON.parse(stringData);

        //deserialise timestamps
        let timestamps: Timespan[] = [];
        for (let i = 0; i < parsedJSON.timestamps.length; i++) {
            let element = parsedJSON.timestamps[i];
            element = JSON.stringify(element);
            timestamps.push(Timespan.FromJSON(element));
        }

        mainData = new TimeTrackerData(parsedJSON.title, timestamps);
    }
}

//Credit: https://stackoverflow.com/a/21016088
function Export() {
    const text = mainData.Serialize();

    let fileURL = null;
    let data = new Blob([text], { type: 'text/plain' });

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (fileURL !== null) {
        window.URL.revokeObjectURL(fileURL);
    }

    fileURL = window.URL.createObjectURL(data);

    let link = document.createElement('a');
    link.setAttribute('download', 'time-tracker-export.txt');
    link.href = fileURL;
    document.body.appendChild(link);

    // wait for the link to be added to the document
    window.requestAnimationFrame(function () {
        let event = new MouseEvent('click');
        link.dispatchEvent(event);
        document.body.removeChild(link);
    });
}

function Import() {
    let text = prompt("Paste Exported Data");

    if (text != null && text.length > 0) {
        Load(text);
        ShowCorrectUI();
        RenderCurrentCalendar();
        SaveData();
        alert("Success!");
    }
}