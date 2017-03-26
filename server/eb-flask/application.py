import sys
import math
from flask import Flask, request, json
from flaskext.mysql import MySQL
from pymysql.cursors import DictCursor
application = Flask(__name__)

db = MySQL()
application.config['MYSQL_DATABASE_USER'] = 'remote'
application.config['MYSQL_DATABASE_PASSWORD'] = 'CrimsonHacks2017'
application.config['MYSQL_DATABASE_DB'] = 'chack2017'
application.config['MYSQL_DATABASE_HOST'] = 'localhost'
application.config['MYSQL_DATABASE_PORT'] = 3306
db.init_app(application)

conn = db.connect()
cursor = conn.cursor(DictCursor)

mild_words = {}
curse_words = {}
race_words = {}

cursor.execute("SELECT * FROM mild")
data = cursor.fetchall()
for item in data:
	#print(item)
	mild_words[item['word']] =item['weight']

cursor.execute("SELECT * FROM race")
data = cursor.fetchall()
for item in data:
	race_words[item['word']] =item['weight']


#(100/#of words on page) * log(weight)
cursor.execute("SELECT * FROM curse")
data = cursor.fetchall()
for item in data:
	curse_words[item['word']] =item['weight']

#print(data)
cursor.close()
conn.close()

@application.route('/')
def hello_world():
	return "Hello world!<br> Here is a list of bad words you should never say<br> " + str(bad_words)

@application.route('/parse', methods=['POST'])
def parse_text():
	bad_word_count = 0
	content = request.get_json()
	print(content)
	#matches

	url = content["url"]
	print(url);
	page_text = content["text"].split(" ") #for now assume that im getting a list of words with spaces between them

	number_of_words = len(page_text)
	print(number_of_words)
	#print(page_text, file=sys.stderr)
	for word in page_text:
		if word.strip(" ") in mild_words:
			print("true")
			bad_word_count += mild_words[word]

		if word.strip(" ") in race_words:
			print("true")
			bad_word_count += race_words[word]

		if word.strip(" ") in curse_words:
			print("true")
			bad_word_count += curse_words[word]


	if bad_word_count == 0:
		weight = 0;
	else:
		weight = ((100/number_of_words) * math.log10(bad_word_count)) * 100
		weight = round(weight, 1)
	print(weight)

	conn = db.connect()
	cursor = conn.cursor()
	sql = "INSERT INTO pagerate (page, weight) VALUES (%s, %s) ON DUPLICATE KEY UPDATE weight=%s"
	cursor.execute(sql, (url, float(weight), float(weight)))
	conn.commit()
	conn.close()
	return json.jsonify(bad_word_count)

if __name__ == '__main__':
	application.debug = True
	application.run(ssl_context='adhoc')