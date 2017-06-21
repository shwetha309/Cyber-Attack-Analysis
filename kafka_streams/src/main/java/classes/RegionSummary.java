package classes;

public class RegionSummary {
	public String attack_type;
	public String attack_subtype;
	public String timestamp;
	public double latitude;
	public double longitude;
	public Object country;
	public String city;

	public RegionSummary(String type, String subtype, String ts, double lat, double lon, Object ctry, String cty) {
		attack_type = type;
		attack_subtype = subtype;
		timestamp = ts;
		latitude = lat;
		longitude = lon;
		country = ctry;
		city = cty;
	}
	public RegionSummary() {
	}
}
		
