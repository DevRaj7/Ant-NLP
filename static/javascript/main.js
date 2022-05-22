// The dataset drop area is the part of the page where the user can drop a json file to upload it (or click on the icon/upload button to upload the file)
const datasetDropArea = document.querySelector('.dataset-drop-area');

const dropAreaHeaderText  = datasetDropArea.querySelector('header');        // controls the header tag in the drop area
const datasetUploadButton = datasetDropArea.querySelector('button');        // controls the upload button
const datasetUploadIcon   = datasetDropArea.querySelector('#upload-icon');  // controls the upload icon
const datasetUploadInput  = datasetDropArea.querySelector('input');         // controls the file input button (which is hidden)

var file;

// the next 2 onclicks check if the user clicks on the upload button or the upload icon, and then trigger the input tag
datasetUploadButton.onclick = () => {
    datasetUploadInput.click();
}

datasetUploadIcon.onclick = () => {
    datasetUploadInput.click();
}

// if the input tag is triggered, store the uploaded file in the file variable, and log the json data. (later, trigger a function that display the datapoints from the dataset in a list like fashion with cards (like a blog list))
datasetUploadInput.addEventListener("change", () => {
    file = this.files[0];
    processDataset();

    // the class 'active' is used to manipulate the drop area's css
    datasetDropArea.classList.add("active");
});

// if the user drags the file over the drop area, prompt the user to release the file 
datasetDropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    datasetDropArea.classList.add("active");
    dropAreaHeaderText.textContent = "Release to Upload File";
});

// if user leaves the dragged file from drop area
datasetDropArea.addEventListener('dragleave', () => {
    datasetDropArea.classList.remove("active");
    dropAreaHeaderText.textContent = "Drag & Drop to upload json file";
});

// if the user drops the file in the drop area
datasetDropArea.addEventListener('drop', (event) => {
    // the default behaviour is to open the dropped image in a new tab
    event.preventDefault();
    console.log("File has been dropped in da");

    // fetching the first file dropped
    file = event.dataTransfer.files[0];
    processDataset();
});

function processDataset() {
    let fileType = file.type;
    console.log(fileType);

    if (fileType !== "application/json") {
        alert("Please upload a JSON file!");
    }

    let fileReader = new FileReader();
    fileReader.onload = () => {
        data = fileReader.result;
        data = JSON.parse(data);
        console.log(data);
        console.log(typeof (data));
    }

    fileReader.readAsText(file);
}
