from flask import Flask, request, json
application = Flask(__name__)

@application.route('/')
def hello_world():
	return "Hello world!\n I updated the file"

@application.route('/parse', methods=['POST'])
def parse_text():
	content = request.get_json()
	return content["text"]

if __name__ == '__main__':
	application.debug = True
	application.run()