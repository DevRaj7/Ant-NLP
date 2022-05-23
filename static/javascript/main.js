/*
Controls the home page
*/

// The dataset drop area is the part of the page where the user can drop a json file to upload it (or click on the icon/upload button to upload the file)
const datasetDropArea = document.querySelector('.dataset-drop-area');

const dropAreaHeaderText  = datasetDropArea.querySelector('header');        // controls the header tag in the drop area
const datasetUploadButton = datasetDropArea.querySelector('button');        // controls the upload button
const datasetUploadIcon   = datasetDropArea.querySelector('#upload-icon');  // controls the upload icon
const datasetUploadInput  = datasetDropArea.querySelector('input');         // controls the file input button (which is hidden)

var file;
var data; // object that holds the dataset

// the next 2 onclicks check if the user clicks on the upload button or the upload icon, and then trigger the input tag
datasetUploadButton.onclick = () => {
    datasetUploadInput.click();
}

datasetUploadIcon.onclick = () => {
    datasetUploadInput.click();
}

// if the input tag is triggered, store the uploaded file in the file variable, and log the json data. (later, trigger a function that display the datapoints from the dataset in a list like fashion with cards (like a blog list))
datasetUploadInput.addEventListener("change", (event) => {
    let dt = event.dataTransfer || (event.originalEvent && event.originalEvent.dataTransfer);
    let files = event.target.files || (dt && dt.files);
    file = files[0];

    processDataset();

    // the class 'active' is used to manipulate the drop area's css
    datasetDropArea.classList.add("active");
});

// if the user drags the file over the drop area, prompt the user to release the file 
datasetDropArea.addEventListener('dragover', (event) => {
    event.stopPropagation();
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
    event.stopPropagation();
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
        updateDatasetDisplay();
    }

    fileReader.readAsText(file);
}

// updates the display div with the word problems in the json file. Each card is a word problem that can be clicked on to access the word problem's annotation page
function updateDatasetDisplay() {
    let datasetDisplayDiv = document.querySelector('.dataset-display');
    let size = Object.keys(data).length;

    for(let i = 0; i < size; i++) {
        // one datapoint
        let dp = data[ Object.keys(data)[i] ];
        let wordProblem = dp['word_problem'];
        let answer = dp['answer'];
        
        let datapointCard = document.createElement('div');
        datapointCard.classList.add('datapoint-card');
        datapointCard.setAttribute('id', 'datapoint-card-' + (i+1).toString());
        datapointCard.innerHTML = (i+1).toString() + ') ' + wordProblem;

        // wrap the div around an anchor tag to make it clickable
        // redirect the user to the annotation page of that word problem once clicked
        let anchorTag = document.createElement('a');
        anchorTag.href = 'problem-' + (i+1).toString();
        anchorTag.appendChild(datapointCard);
        datasetDisplayDiv.appendChild(anchorTag);
    }
}
