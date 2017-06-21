import json
import psycopg2
from kafka import KafkaConsumer

def connect_db():
	""" Connect to DB
	"""
	try:
    		conn = psycopg2.connect("dbname='attacksdb' user='postgres' host='XXX' password='XXX'")
    		return conn
	except:
   		 print "I am unable to connect to the database"

def write_table(conn,row):
	""" Write Records to Table 
	"""

	q = """ insert into attack_records values (%s,%s,%s,%s,%s,%s,%s) """
	cur = conn.cursor()
	cur.execute(q, row)
    	conn.commit()
	print "Committed"


def main():
	""" Read from Kafka Topic
	    Split and write to DB
	"""
	
	consumer = KafkaConsumer(value_deserializer=lambda m: json.loads(m.decode('ascii').decode('utf-8')))
	consumer.subscribe('AttackActivityStream')

	
	for msg in consumer:
		print msg		
		row=[long(msg.value['timestamp']),str(msg.value['attack_type']),str(msg.value['attack_subtype']),float(msg.value['latitude']),float(msg.value['longitude']),str(msg.value['city']),str(msg.value['country'])]
		conn = connect_db()
		write_table(conn,row)
	

main()
