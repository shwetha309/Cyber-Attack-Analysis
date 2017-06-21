import json
import psycopg2
from kafka import KafkaConsumer

def connect_db():
	""" Connect to DB """
	try:
    		conn = psycopg2.connect("dbname='attacksdb' user='postgres' host='XXX' password='XXX'")
    		return conn
	except:
   		 print "I am unable to connect to the database"

def write_table(conn,rows):
	""" Insert values into DB """
	q = """ insert into getis_score values (%s,%s,%s,%s) """
	cur = conn.cursor()
	cur.execute(q, rows)
    	conn.commit()
	print "Committed"
	
	#	print "Failed"
    	#	conn.rollback()

def main():
	""" Reads values from Kafka Topic
	    Splits and Writes to DB """
	
	consumer = KafkaConsumer()
	consumer.subscribe('GScoreOutput')

	rows=[]
	for msg in consumer:
		print msg
		data = msg.value.split("##")
		
		row=[data[0],float(data[1])*0.01, float(data[2])*0.01, float(data[3])]
		conn = connect_db()
		write_table(conn,row)
		

main()
