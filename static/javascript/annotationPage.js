/*
Controls the annotation page
*/

var data;
let problemNumber = parseInt(document.getElementById('p-problem-number').innerHTML);
let wordProblemDescription = document.getElementById('p-word-problem-display');


function init() {
    // Fetches the dataset from local storage (if it exists)
    var xml = new XMLHttpRequest();
    xml.open("POST", "/fetch-dataset", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xml.onload = function() {
        var dataReply = JSON.parse(this.responseText);

        // if the local database was not empty, then load it at the frontend
        if(dataReply) {
            data = JSON.parse(JSON.stringify(dataReply));  // deep copy of the dataset

            // format this better using span/header/another p tag
            wordProblemDescription.innerHTML = problemNumber + ') ';
            wordProblemDescription.innerHTML += data[problemNumber]['word_problem'];
            wordProblemDescription.innerHTML += ' Answer: ' + data[problemNumber]['answer'];
        }
    };
    xml.send(JSON.stringify({}));
}

init();

const homeRedirectButton = document.querySelector('.div-home-redirect button');

homeRedirectButton.onclick = () => {
    window.open('/', '_self');
}




