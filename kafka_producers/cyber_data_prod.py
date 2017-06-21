import threading, logging, time,datetime, random
from kafka import KafkaConsumer, KafkaProducer


class Producer(threading.Thread):
    daemon = True

    def run(self):

	""" Random Data generator for cyber attacks
	"""

        producer = KafkaProducer(bootstrap_servers='XXXX')
	flag = 1         
        
        while True:

		lat = 40.00 + random.randint(50,90)*0.01
		
		if flag == 1:
			lon = -73.00 + random.randint(80,100)*0.01
			flag = 0
		else:
			lon = -74.00 + random.randint(0,25)*0.01
			flag = 1
		
		atype = ["C_AND_C","MALWARE","BACKDOOR","DDOS","DB-ISP-DISC","OTHER","RFB","EXPLOIT_KIT"]

		jsondata = "{\"attack_type\": \""+ atype[random.randint(0,7)]+"\" , \"attacker_ip\": \"222.186.10.170\", \"attack_port\": \"\", \"latitude\": "+ str(lat)+" , \"latitude2\": \"\", \"country_target\": \"\", \"longitude2\": \"\", \"longitude\": "+ str(lon)+", \"attacker\": \"\", \"attack_subtype\": \"unknown\", \"city_target\": \"\", \"city_origin\": \"\", \"country_origin\": \"\"}"    
		
		producer.send("cyberwarInput",jsondata)


def main():
	producer = Producer()
   	producer.start()
    	while True:
		time.sleep(10)

if __name__ == "__main__":
    logging.basicConfig(
        format='%(asctime)s.%(msecs)s:%(name)s:%(thread)d:%(levelname)s:%(process)d:%(message)s',
        level=logging.INFO
        )
    main()
