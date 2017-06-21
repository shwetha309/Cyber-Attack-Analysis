package typecount;

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
import java.math.BigInteger;
import org.apache.kafka.streams.processor.*;

public class WindowAggregate extends AbstractProcessor<String, RegionSummary> {
	private ProcessorContext context;
	private KeyValueStore<String, String> hourlyStore;
	
	public void init(ProcessorContext context) {
		this.context = context;
		this.context.schedule(10000);
		this.hourlyStore = (KeyValueStore<String, String>) context.getStateStore("HourlyCount_Store");
	}

	public void process(String key, RegionSummary value) {
		if( value !=null || value.attack_type != null || value.attack_type != "") {
			String count = hourlyStore.get(value.attack_type);
			if(count == null) {
			
				this.hourlyStore.put(value.attack_type,1+"");
			}
			else {
				count = count.replace("\"","");
				BigInteger ct = new BigInteger(count);
				ct = ct.add(BigInteger.ONE);
				this.hourlyStore.put(value.attack_type, ct+"");
			}
		}
	}

	public void punctuate(long timestamp) {
		KeyValueIterator<String, String> iter = this.hourlyStore.all();

		while(iter.hasNext()) {
			KeyValue<String, String> entry = iter.next();
			if( entry.value != null) {
				
				context.forward(entry.key, entry.key+"##"+entry.value);
				this.hourlyStore.put(entry.key,null);
			        System.out.println(entry.key+" "+ entry.value);
				
			}
		}
		iter.close();
		context.commit();
	}

	public void close() {
	}
};

