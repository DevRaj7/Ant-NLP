/*
Controls the home page
*/
// feedback section start

const ratings = document.querySelectorAll('.rating')
const ratingsContainer = document.querySelector('.ratings-container')
const sendBtn = document.querySelector('#send')
const panel = document.querySelector('#panel')
let selectedRating = 'Satisfied'

ratingsContainer.addEventListener('click', (e) => {
    if (e.target.parentNode.classList.contains('rating')) {
        removeActive()
        e.target.parentNode.classList.add('active')
        selectedRating = e.target.nextElementSibling.innerHTML
    }
    if (e.target.classList.contains('rating')) {
        removeActive()
        e.target.classList.add('active')
        selectedRating = e.target.nextElementSibling.innerHTML
    }

})

sendBtn.addEventListener('click', (e) => {
    panel.innerHTML = `
        
        Thank You!
        
        Feedback : ${selectedRating}
        We'll use your feedback to improve our customer support
    `
})

function removeActive() {
    for (let i = 0; i < ratings.length; i++) {
        ratings[i].classList.remove('active')
    }
}

//feedback section end

/*
The init function first sends an ajax request to the backend to fetch the dataset
If the dataset is found, then it is loaded in the dataset-display div. The user cannot upload their file if this happens, until the previous dataset is deleted.
If it is not found, it waits for the user to upload a file, and then loads it.
*/
var file;
var data = {}; // object that holds the dataset
var groupNumber = 1; // group 1 = Word problems from 1 to 30. Group 2 = Word problems from 31 to 60
var totalSize = 0; // total dataset length
var numberOfPages = Math.ceil(totalSize / 30); // number of pages/groups

function init() {
    fetchDB();
}

init();

// The dataset drop area is the part of the page where the user can drop a json file to upload it (or click on the icon/upload button to upload the file)
const datasetDropArea = document.querySelector('.dataset-drop-area');

const dropAreaHeaderText = datasetDropArea.querySelector('header'); // controls the header tag in the drop area
const datasetUploadButton = datasetDropArea.querySelector('button'); // controls the upload button
const datasetUploadIcon = datasetDropArea.querySelector('#upload-icon'); // controls the upload icon
const datasetUploadInput = datasetDropArea.querySelector('input'); // controls the file input button (which is hidden)

const datasetDeleteButton = document.querySelector('.div-delete-dataset button');

const nextPageButton = document.querySelector('.btn-next-page');
const previousPageButton = document.querySelector('.btn-previous-page');

// the next 2 onclicks check if the user clicks on the upload button or the upload icon, and then trigger the input tag
datasetUploadButton.onclick = () => {
    // Allow the user to upload a json file only if the existing data object is empty
    if (Object.keys(data).length === 0) {
        datasetUploadInput.click();
    }
}

datasetUploadIcon.onclick = () => {
    if (Object.keys(data).length === 0) {
        datasetUploadInput.click();
    }
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
    if (!file) {
        file = event.dataTransfer.files[0];
        processDataset();
    }
});

datasetDeleteButton.onclick = () => {
    deleteDB();
    file = null;
    data = {};
}

nextPageButton.onclick = () => {
    if (groupNumber < numberOfPages) {
        groupNumber += 1;
        fetchDB();
    }
}

previousPageButton.onclick = () => {
    if (groupNumber > 1) {
        groupNumber -= 1;
        fetchDB();
    }
}

// Fetches the dataset from local storage (if it exists)
function fetchDB() {
    var xml = new XMLHttpRequest();
    xml.open("POST", "/fetch-dataset", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xml.onload = function() {
        var dataReply = JSON.parse(this.responseText);

        // if the local database was not empty, then load it at the frontend
        if (dataReply) {
            data = JSON.parse(JSON.stringify(dataReply['dataset'])); // deep copy of the dataset
            totalSize = dataReply['totalSize'];
            console.log(totalSize);
            numberOfPages = Math.ceil(totalSize / 30);
            document.querySelector('.page-number-display').innerHTML = String(groupNumber) + '/' + String(numberOfPages);
            updateDatasetDisplay();
        }
    };
    xml.send(JSON.stringify({ 'groupNumber': groupNumber }));
}

// delete the database at the backend
function deleteDB() {
    var xml = new XMLHttpRequest();
    xml.open("POST", "/delete-dataset", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xml.onload = function() {
        var dataReply = JSON.parse(this.responseText);
        data = {}
        updateDatasetDisplay();
    };
    xml.send(JSON.stringify({}));
}

// sends the current databse to the backend. Will overwrite the current database at the backend
function sendDB() {
    var xml = new XMLHttpRequest();
    xml.open("POST", "/send-dataset", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xml.onload = function() {
        var dataReply = JSON.parse(this.responseText);
        if (dataReply['status'] !== 'success') {
            console.log("Error at sendDB");
        }
    };

    xml.send(JSON.stringify(data));
}

function processDataset() {
    let fileType = file.type;

    if (fileType !== "application/json") {
        alert("Please upload a JSON file!");
    }

    let fileReader = new FileReader();
    fileReader.onload = () => {
        if (Object.keys(data).length === 0) {
            data = fileReader.result;
            data = JSON.parse(data);
            // console.log(data);
            // console.log(typeof (data));
            updateDatasetDisplay();
            sendDB();
        }
    }

    fileReader.readAsText(file);
}

// updates the display div with the word problems in the json file. Each card is a word problem that can be clicked on to access the word problem's annotation page
function updateDatasetDisplay() {
    let datasetDisplayDiv = document.querySelector('.dataset-display');

    // remove all child nodes of the dataset-display div
    datasetDisplayDiv.textContent = '';

    let size = Object.keys(data).length;

    for (let i = 0; i < size; i++) {
        // one datapoint
        let dp = data[Object.keys(data)[i]];
        let wordProblem = dp['word_problem'];
        let answer = dp['answer'];

        let datapointCard = document.createElement('div');
        datapointCard.classList.add('datapoint-card');
        datapointCard.setAttribute('id', 'datapoint-card-' + (i + 1).toString());
        datapointCard.innerHTML = (i + 1).toString() + ') ' + wordProblem;

        datapointCard.setAttribute('id', 'datapoint-card-' + (i + 1).toString());
        datapointCard.innerHTML = ((groupNumber - 1) * 30 + i + 1).toString() + ') ' + wordProblem;

        datapointCard.onclick = () => {
            var xml = new XMLHttpRequest();
            xml.open("POST", "/redirect-to-annotation-page", true);
            xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            xml.onload = function() {
                var dataReply = JSON.parse(this.responseText);
                if (dataReply['status'] !== 'success') {
                    console.log("Error at datapointCard.onclick");
                }
                window.open('/annotation-page', '_self');
            };

            console.log({ 'problemNumber': i + 1 });
            let TMP = { 'problemNumber': i + 1 };

            // send the problem number to the backend
            xml.send(JSON.stringify(TMP));

        }
        datasetDisplayDiv.appendChild(datapointCard);
    }
}