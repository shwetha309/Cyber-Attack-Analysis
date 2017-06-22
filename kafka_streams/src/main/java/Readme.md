To execute the programs under kafka_streams folder follow the steps below:
- Use the pom.xml file and execute the mvn commands
- Start writing input to the topic "cyberwarInput"
- Create the output topic "AttackRecordsStream"
- Execute the ReadandTransform file under transform folder using the following command.
``` mvn exec:java -D exec.mainClass="LiveDataAggregate.readandTransform" ```
