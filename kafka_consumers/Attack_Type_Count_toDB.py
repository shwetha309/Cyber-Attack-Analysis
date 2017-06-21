import json
import psycopg2
from kafka import KafkaConsumer

def connect_db():
	""" Connect to DB
	"""

	try:
    		conn = psycopg2.connect("dbname='attacksdb' user='postgres' host='ip-10-0-0-6' password='insight'")
    		return conn
	except:
   		 print "I am unable to connect to the database"

def write_table(atype,ct):
	""" Update DB with new values
	"""

	conn = connect_db()
	q = """ update attack_type_count set count = %s where attack_type = %s; """
	cur = conn.cursor()
	cur.execute(q,(ct,atype))
    	conn.commit()
	print "Committed"

def main():
	""" Read values from Kafka Topic
	    Write to database
	"""	

	conn=connect_db()
	consumer = KafkaConsumer()
	consumer.subscribe('AttackTypeCountStream')

	rows=[]
	for msg in consumer:
		print msg.value		
		key,value = msg.value.split("##")
		write_table(key,value)

main()
