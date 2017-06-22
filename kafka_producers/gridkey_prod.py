import threading, logging, time,datetime
from kafka import KafkaConsumer, KafkaProducer


class Producer(threading.Thread):
    daemon = True

    def run(self):
	""" Cartesian Coordinates of Grid Map given as input 
	    Write to Kafka Topic
	"""

        producer = KafkaProducer(bootstrap_servers='XXXX')
        
      
        while True:
	    with open("merge.txt") as f:
	    	for line in f:
            		producer.send('GridMapCartesian', (line.strip().replace("\"","")))
            		
           	time.sleep(1)

def main():
	""" Creates Producer Thread
	"""
	producer = Producer()
   	producer.start()
    	while True:
		time.sleep(10)

if __name__ == "__main__":
	
    """ Main function with logging
    """
    logging.basicConfig(
        format='%(asctime)s.%(msecs)s:%(name)s:%(thread)d:%(levelname)s:%(process)d:%(message)s',
        level=logging.INFO
        )
    main()
