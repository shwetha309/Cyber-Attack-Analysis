package getis;


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
import java.util.*;

/**
* <p> 
* This program extends the AbstractProcessor class of 
* Kafka Streams. It accumulates the input values of the 
* GridMapCartesian Topic input over a period of 1 minute
* and creates a State Store with (key, value) as 
* ("lat##lon",0)
* 
*/

public class GridMapProcess extends AbstractProcessor<String,String> {
	private ProcessorContext context;
	private KeyValueStore<String, GridMap> GridMapStore;
	ArrayList<String> coords_list = new ArrayList<String>();

	public boolean isValid(int lat, int lon)
	{
		if((lat >=4050 && lat <= 4090) && (lon >= -7425 && lon <= -7370))
			return true;
		else
			return false;
	}

	public ArrayList<String> find_neighbors(int lat, int lon) {
		
		ArrayList<String> neighbors = new ArrayList<String>();
		for ( int i = -1;i<=1;i++)
		{
			int lat2 = lat+i;
			for(int j=-1;j<=1;j++)
			{
				int lon2 = lon+i;
				if(isValid(lat,lon))
				{
					neighbors.add(lat2+"##"+lon2);
				}
			}
		}
		ArrayList<String> neighbors_list = new ArrayList<String>();
		neighbors_list.addAll(neighbors);
		return neighbors_list;
	}

	
	public void init(ProcessorContext context) {
		this.context = context;
		this.context.schedule(10000);
		this.GridMapStore = (KeyValueStore<String, GridMap>) context.getStateStore("GridMapStore");
		
	}

	public void process(String key, String value) {
		String coords = value.replace(",","##").replace("(","").replace(")","").replace("\"","");
		if (coords_list.contains(coords) == false) {
			coords_list.add(coords);
		}
		else {
		}
	
	}

	public void punctuate(long timestamp) {
		
		for (int i=0;i<coords_list.size();i++)
		{
			String coords[] = coords_list.get(i).split("##");
			coords[0] = coords[0].replaceAll("\\s","").replace("\"","");
			coords[1] = coords[1].replaceAll("\\s","").replace("\"","");
			ArrayList<String> neighbors = find_neighbors(Integer.parseInt(coords[0]),Integer.parseInt(coords[1]));
			GridMap gmap = new GridMap();
			gmap.neighbors = neighbors;
			this.GridMapStore.put(coords_list.get(i),gmap);

		}			


		
		context.commit();
	}

	public void close() {
	}
};


