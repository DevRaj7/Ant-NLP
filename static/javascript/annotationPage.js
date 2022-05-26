/*
Controls the annotation page
*/


import { DataSet } from "vis-data/peer";
import { Network } from "vis-network/peer";


/*     Graph Canvas Section     */

const nodes = new DataSet([
    {
        id: 1, label: "Node 1",
        shape: 'star'
    },
    { id: 2, label: "Node 2" },
    { id: 3, label: "Node 3" },
    { id: 4, label: "Node 4" },
    { id: 5, label: "Node 5" }  
]);
console.log('here 1');

// create an array with edges
const edges = new DataSet([
    { from: 1, to: 3 },
    { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 2, to: 5 },
    { from: 3, to: 3 }
]);

// create a network
const container = document.getElementById("mynetwork");
const data2 = {
    nodes: nodes,
    edges: edges
};
const options = {};
const network = new Network(container, data2, options);

/*     Annotation Page logic     */
var data;
let problemNumber = parseInt(document.getElementById('p-problem-number').innerHTML);
let wordProblemDescription = document.getElementById('p-word-problem-display');

function init() {
    // Fetches the dataset from local storage (if it exists)
    var xml = new XMLHttpRequest();
    xml.open("POST", "/fetch-dataset", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xml.onload = function () {
        var dataReply = JSON.parse(this.responseText);

        // if the local database was not empty, then load it at the frontend
        if (dataReply) {
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
