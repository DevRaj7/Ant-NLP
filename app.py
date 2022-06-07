from flask import Flask, render_template, request
import json

app = Flask(__name__)
problemNumber = 0  # global var that keeps track of the current word problem id/ word problem number

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/fetch-dataset', methods=['GET', 'POST'])
def fetchDataset():
    dataGet = request.get_json(force=True)
    groupNumber = dataGet['groupNumber']
    dataset = {}
    totalSize = 0

    # If local storage contains a non empty json file, then send that to the frontend
    # Otherwise, send an empty dictionary
    with open('db.json', 'r') as jsonFile:
        dbData = jsonFile.read()
        dbData = json.loads(dbData)

        if dbData:
            dataset = dict(zip(list(dbData.keys())[(groupNumber-1)*30:(groupNumber-1) * 30 + 30], list(dbData.values())[(groupNumber-1):(groupNumber) * 30]))
            totalSize = len(dbData)
        else:
            print("Empty Dataset")

    data = {'dataset': dataset, 'totalSize': totalSize}
    dataReply = json.dumps(data)
    print("fetched the dataset")
    return dataReply

@app.route('/delete-dataset', methods=['GET', 'POST'])
def deleteDatabase():
    dataGet = request.get_json(force=True)
    data = {}

    with open('db.json', 'w') as jsonFile:
        json.dump(data, jsonFile)

    dataReply = json.dumps({})
    print("deleted the dataset")
    return dataReply

@app.route('/send-dataset', methods=['GET', 'POST'])
def sendDatabase():
    dataGet = request.get_json(force=True)
    data = json.dumps(dataGet)
    with open('db.json', 'w') as jsonFile:
        jsonFile.write(data)

    dataReply = {'status': 'success'}
    dataReply = json.dumps(dataReply)
    print("sent the dataset")
    return dataReply

"""
How the redirect process works -
The user clicks on the word problem's div (card)
Then the frontend sends an ajax request to the backend, and sends the problem number.
Then the backend receives this problem number, and saves it in a global variable. Meanwhile, the frontend loads the /annotation-page,
which then calls annotationPage() from app.py and passes the stored problem number to it, which can then be received by the annotation-page's frontend,
and the appropriate word problem can be loaded.
TODO: Fix the way this is done (avoid global var)
"""

@app.route('/annotation-page', methods=['GET', 'POST'])
def annotationPage():
    return render_template('annotationPage.html', problemNumber=problemNumber)

@app.route('/redirect-to-annotation-page', methods=['GET', 'POST'])
def redirectToAnnotationPage():
    global problemNumber

    # Obtaining the word problem number from the frontend
    dataGet = request.get_json(force=True)
    problemNumber = dataGet['problemNumber']
    return json.dumps({'status': 'success'})


if __name__ == "__main__":
    app.run(debug=True)

