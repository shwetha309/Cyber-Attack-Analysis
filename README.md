# Cyber-Attack-Analysis
This project provides Real Time Analytics on Cyber Attack Hotspots and Trends across the globe

UI is available at <a href="http://shwetha.site"> CyberAttackAnalysis </a>
The presentation is available on <a href= "#" > SlideShare </a>

I have implemented an end to end pipeline using
<ul>
<li> Apache Kafka </li>
<li> Apache Kafka Streams </li>
<li> PostgreSQL </li>
<li> Flask with Highcharts.js </li>
</ul>

Data Pipeline
<img href = "#" />

Real Time Analytics and Trend Features:
<ul> 
<li> Hotspot Analysis - <a href = "http://resources.esri.com/help/9.3/arcgisengine/java/gp_toolref/spatial_statistics_tools/how_hot_spot_analysis_colon_getis_ord_gi_star_spatial_statistics_works.htm" > Getis-Ord Gi* (Spatial Statistic) calculation </a>
    <p> This score is used to identify spatially significant hotspots for every feature provided. A statistically significant hotspot is a spatial cell with high attack count and is surrounded by cells with large attack count values.</p>
<img href = "Giscore.png">
<li> Interactive query - Finding Real Time Cyber Attack Trends in a region 
<p> A user can select any region on the map and the trends for a radius of 10 Kms around that point is shown. This involved calculating the <a href = "https://en.wikipedia.org/wiki/Minimum_bounding_box" > Bounding Box </a>.</li>
