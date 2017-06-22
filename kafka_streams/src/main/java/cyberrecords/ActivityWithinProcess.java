package cyberrecords;

import classes.*;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.state.KeyValueIterator;
import org.apache.kafka.streams.state.KeyValueStore;
import org.apache.kafka.streams.*;
import java.util.Objects;
import java.text.SimpleDateFormat;
import java.text.Format;
import java.util.Date;
import org.apache.kafka.streams.processor.*;

/**
* This class extends the Processor class of Kafka Streams. 
* The purpose of this class is to filter and accumulate the unique cyber
* activity records within a period of 1 minute from the Kafka Topic 
* AttackRecordsStream. The Activty State Store is used for accumulating the 
* values. The output of which is written to the AttacksActivityStream as specified
* in the driver function
*
*/

public class ActivityWithinProcess extends AbstractProcessor<String, RegionSummary> {
	private ProcessorContext context;
	private KeyValueStore<String, RegionSummary> regionStore;
	long records;
	
	// 
	public void init(ProcessorContext context) {
		this.context = context;
		this.context.schedule(10000);
		this.regionStore = (KeyValueStore<String, RegionSummary>) context.getStateStore("ActivityStore");
		this.records = 0L;
	}

	public void process(String key, RegionSummary value) {
		RegionSummary rs = regionStore.get(key);
		if(rs == null) {
			this.records += 1;
			RegionSummary rs_obj = value;
			this.regionStore.put(Double.toString(value.latitude)+"_"+Double.toString(value.longitude), value);
		}
	}

	public void punctuate(long timestamp) {
		KeyValueIterator<String, RegionSummary> iter = this.regionStore.all();

		while(iter.hasNext()) {
			KeyValue<String, RegionSummary> entry = iter.next();
			if( entry.value != null) {
				entry.value.timestamp=Long.toString(timestamp);
				context.forward(Long.toString(timestamp), entry.value);
				
			}
		}
		System.out.println("Counts "+records);
		this.records=0L;
		iter.close();
		context.commit();
	}

	public void close() {
	}
};
