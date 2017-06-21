package classes;

import java.util.*;

public class GScore  {
	public String coords;
	public double gscore;

	public GScore (String coord, double g)
	{
		this.coords = coord;
		this.gscore = g;
	}
        
/*	@Override
	public int compareTo (GScore gs1, GScore gs2)
	{
		double g1 = gs1.gscore;
		double g2 = gs2.gscore;

		if (g1 < g2)
			return -1;
		else if (g1 > g2)
			return 1;
		return 0;
	}*/
}
		
