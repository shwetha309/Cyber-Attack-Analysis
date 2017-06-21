package typecount;
import classes.*;
import Serializer.*;
import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.apache.kafka.common.serialization.*;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.processor.TopologyBuilder;
import org.apache.kafka.streams.processor.WallclockTimestampExtractor;
import org.apache.kafka.streams.state.Stores;

import java.util.*;

public class CountStatefulDriver {

    public static void main(String[] args) {

        StreamsConfig streamingConfig = new StreamsConfig(getProperties());

        TopologyBuilder builder = new TopologyBuilder();

        StringSerializer stringSerializer = new StringSerializer();
        StringDeserializer stringDeserializer = new StringDeserializer();
  
        final Serde<String> stringSerde = Serdes.String();
        final Serde<Long> longSerde = Serdes.Long();
        
	Map < String, Object > serdeProps = new HashMap < > ();
        final Serializer < RegionSummary > rsummarySerializer = new JsonPOJOSerializer < > ();
        serdeProps.put("JsonPOJOClass", RegionSummary.class);
        rsummarySerializer.configure(serdeProps, false);
 
        final Deserializer < RegionSummary > rsummaryDeserializer = new JsonPOJODeserializer < > ();
        serdeProps.put("JsonPOJOClass", RegionSummary.class);
        rsummaryDeserializer.configure(serdeProps, false);
	final Serde < RegionSummary > rsummarySerde = Serdes.serdeFrom(rsummarySerializer, rsummaryDeserializer); 

        builder.addSource("InputSource", stringDeserializer, rsummaryDeserializer,"AttackRecordsStream")
                       .addProcessor("agg-process", WindowAggregate::new, "InputSource")
                       .addStateStore(Stores.create("HourlyCount_Store").withStringKeys()
                               .withValues(stringSerde).inMemory().maxEntries(100).build(),"agg-process")
                       .addSink("sink-2", "AttackTypeCountStream", stringSerializer, stringSerializer, "agg-process");


        System.out.println("Starting Activity Within Hourly Count Processor");
        KafkaStreams streaming = new KafkaStreams(builder, streamingConfig);
        streaming.start();
        

    }

    private static Properties getProperties() {
        Properties props = new Properties();
        props.put(StreamsConfig.CLIENT_ID_CONFIG, "Attack Type Count Processor");
        props.put("attack-count", "attack-type-count-driver");
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, "attack-type-count-driver");
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(StreamsConfig.ZOOKEEPER_CONNECT_CONFIG, "localhost:2181");
        props.put(StreamsConfig.REPLICATION_FACTOR_CONFIG, 2);
        props.put(StreamsConfig.TIMESTAMP_EXTRACTOR_CLASS_CONFIG, WallclockTimestampExtractor.class);
        return props;
    }
}


