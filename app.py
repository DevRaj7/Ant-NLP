from flask import Flask, render_template, request
import json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/fetch-dataset', methods=['GET', 'POST'])
def fetchDataset():

    dataGet = request.get_json(force=True)
    data = {}

    # If local storage contains a non empty json file, then send that to the frontend
    # Otherwise, send an empty dictionary
    with open('db.json', 'r') as jsonFile:
        dbData = jsonFile.read()
        dbData = json.loads(dbData)

        if dbData:
            data = dbData

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
        # json.dumps(dataGet, jsonFile, indent=4)

    dataReply = {'status': 'success'}
    dataReply = json.dumps(dataReply)
    print("sent the dataset")
    return dataReply


if __name__ == "__main__":
    app.run(debug=True)

