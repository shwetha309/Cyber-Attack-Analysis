To execute the programs under kafka_streams folder follow the steps below:
- Use the pom.xml file and execute the mvn commands
- Create input topic "cyberwarInput"
- Start writing input to the topic "cyberwarInput" (Use the cyber_data_prod.py under kafka_producer)
- Create the output topic "AttackRecordsStream"
- Execute the ReadandTransform file under transform folder using the following command.
``` mvn exec:java -D exec.mainClass="transform.ReadandTransform" ```
- The output would contain the stream of attack records
###### Getis Score calculation
- Create input topic "GridMapCartesian"
- Write input to topic using gridkey_prod.py file in kafka_producer folder
- Create the output topic "GScoreOutput"
- Execute the GridMapCreateDriver program under getis
`mvn exec:java -D exec.mainClass="getis.GridMapCreateDriver"`
- Note this program takes input from both "GridMapCartesian" and "AttackRecordsStream"
###### Finding Trends
- Create the output topic "AttackTypeCountStream"
- Execute the CountStatefulDriver program in typecount
`mvn exec:java -D exec.mainClass="typecount.CountStatefulDriver"`
- Create output topic "AttacksActivityStream"
- Execute the ActivityWithinRegionDriver program in cyberrecords
`mvn exec:java -D exec.mainClass="cyberrecords.ActivityWithinRegionDriver"`
