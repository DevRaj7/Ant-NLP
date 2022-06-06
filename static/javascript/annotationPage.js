/*
Controls the annotation page
*/


import { DataSet } from "vis-data/peer";
import { Network } from "vis-network/peer";

/*     Graph Canvas Section     */

/*
const nodes = new DataSet([
    {
        id: 1, 
        label: 'Node 1',
        shape: 'box'
    },
    {
        id: 2, 
        label: 'Node 2',
        shape: 'box'
    },
    {
        id: 3, 
        label: 'Node 3',
        shape: 'box'
    },
    {
        id: 4, label: 'Node 4'
    },
    {
        id: 5, label: 'Node 5'
    }
]);

const edges = new DataSet([
    // { from: 1, to: 3 },
    // { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 2, to: 5 },
    { from: 3, to: 3 }
]);


const container = document.getElementById("mynetwork");
const data2 = {
    nodes: nodes,
    edges: edges
};
*/


/* initialize the graph */
var nodes = new DataSet([]);
var edges = new DataSet([]);
const nodeMargin = 10;
const container = document.getElementById("mynetwork");

var graphData = {
    nodes: nodes,
    edges: edges,
};

var options = {
    manipulation: {
        editNode: (data, callback) => {
            console.log("Front thi func");
            editNode(data, cancelNodeEdit, callback);
        }
    },
    physics: {
        enabled: false,
        // barnesHut: {
        //     // theta: 0.5,
        //     gravitationalConstant: -500,
        //     centralGravity: 0.3,
        //     springLength: 95,
        //     springConstant: 0.04,
        //     damping: 0.20,
        //     avoidOverlap: 0
        // },
        // hierarchicalRepulsion: {
        //     centralGravity: 0.0,
        //     springLength: 100,
        //     springConstant: 0.01,
        //     nodeDistance: 120,
        //     damping: 0.09,
        //     avoidOverlap: 0
        // },
    }
};

var numberOfNodes = 0;
const network = new Network(container, graphData, options);

/* Local Graph Instance  */
// This is basically a copy of the current word problem's graph. Any change made is first applied to the local graph instance, and then reflected on the vis-network (visual) graph


/*     Annotation Page logic     */
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
        if (dataReply) {
            data = JSON.parse(JSON.stringify(dataReply)); // deep copy of the dataset

            // format this better using span/header/another p tag
            wordProblemDescription.innerHTML = problemNumber + ') ';
            wordProblemDescription.innerHTML += data[problemNumber]['word_problem'];
            wordProblemDescription.innerHTML += ' Answer: ' + data[problemNumber]['answer'];
        }
    };
    xml.send(JSON.stringify({}));
}

function graphAddNode() {
    numberOfNodes++;
    var labelTemplate = `State: S${numberOfNodes}\nEntity: 'walnut tree'\nNumber: 4\nUnit: ''\nAttribute: ''\nReference: null`;

    nodes.add({
        id: numberOfNodes,
        // label: 'Node ' + numberOfNodes.toString(),
        label: labelTemplate,
        shape: 'box',
        margin: nodeMargin,
        x: -500 + ((numberOfNodes - 1) * nodeMargin),
        y: -120
    });
}

function editNode(data, cancelAction, callback) {
    // document.getElementById("node-label-statename").value = data.label;
    document.getElementById("node-saveButton").onclick = saveNodeData.bind(
        this,
        data,
        callback
    );
    document.getElementById("node-cancelButton").onclick =
        cancelAction.bind(this, callback);
    document.getElementById("node-popUp").style.display = "block";
}

function cancelNodeEdit(callback) {
    clearNodePopUp();
    callback(null);
}

function clearNodePopUp() {
    document.getElementById("node-saveButton").onclick = null;
    document.getElementById("node-cancelButton").onclick = null;
    document.getElementById("node-popUp").style.display = "none";
}

function saveNodeData(data, callback) {
    // data.label = document.getElementById("node-label").value;
    const statename = document.getElementById("node-label-statename").value;
    const entity = document.getElementById("node-label-entity").value;
    const number = document.getElementById("node-label-number").value;
    const unit = document.getElementById("node-label-unit").value;
    const attribute = document.getElementById("node-label-attribute").value;
    const reference = document.getElementById("node-label-reference").value;

    data.label = `State: ${statename}\nEntity: '${entity}'\nNumber: ${number}\nUnit: '${unit}'\nAttribute: '${attribute}'\nReference: ${reference}`;

    clearNodePopUp();
    callback(data);
}

network.on("doubleClick", () => {
    console.log("Double Clicked");
    network.editNode();
});


init();

const homeRedirectButton = document.querySelector('.div-home-redirect button');

homeRedirectButton.onclick = () => {
    window.open('/', '_self');
}

const addNodeButton = document.querySelector('.div-add-node button');

addNodeButton.onclick = () => {
    graphAddNode();
}

// Previous and Next buttons
const prevButton = document.querySelector('.div-prev-problem').addEventListener('click', loadPrevProblem);
const nextButton = document.querySelector('.div-next-problem').addEventListener('click', loadNextProblem);

function loadPrevProblem() {
    // Fetches the dataset from local storage (if it exists)
    var xml = new XMLHttpRequest();
    xml.open("POST", "/fetch-dataset", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xml.onload = function() {
        var dataReply = JSON.parse(this.responseText);

        // if the local database was not empty, then load it at the frontend
        if (dataReply) {
            data = JSON.parse(JSON.stringify(dataReply)); // deep copy of the dataset

            // format this better using span/header/another p tag
            if (problemNumber > 1) {
                problemNumber = problemNumber - 1;
                wordProblemDescription.innerHTML = problemNumber + ') ';
                wordProblemDescription.innerHTML += data[problemNumber]['word_problem'];
                wordProblemDescription.innerHTML += ' Answer: ' + data[problemNumber]['answer'];
            } else {
                problemNumber = problemNumber;
                wordProblemDescription.innerHTML = problemNumber + ') ';
                wordProblemDescription.innerHTML += data[problemNumber]['word_problem'];
                wordProblemDescription.innerHTML += ' Answer: ' + data[problemNumber]['answer'];
            }

        }
    };
    xml.send(JSON.stringify({}));
}

function loadNextProblem() {
    // Fetches the dataset from local storage (if it exists)
    var xml = new XMLHttpRequest();
    xml.open("POST", "/fetch-dataset", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xml.onload = function() {
        var dataReply = JSON.parse(this.responseText);

        // if the local database was not empty, then load it at the frontend
        if (dataReply) {
            data = JSON.parse(JSON.stringify(dataReply)); // deep copy of the dataset

            // format this better using span/header/another p tag
            if (problemNumber < 5) {
                problemNumber = problemNumber + 1;
                wordProblemDescription.innerHTML = problemNumber + ') ';
                wordProblemDescription.innerHTML += data[problemNumber]['word_problem'];
                wordProblemDescription.innerHTML += ' Answer: ' + data[problemNumber]['answer'];
            } else {
                problemNumber = problemNumber;
                wordProblemDescription.innerHTML = problemNumber + ') ';
                wordProblemDescription.innerHTML += data[problemNumber]['word_problem'];
                wordProblemDescription.innerHTML += ' Answer: ' + data[problemNumber]['answer'];
            }

        }
    };
    xml.send(JSON.stringify({}));
}