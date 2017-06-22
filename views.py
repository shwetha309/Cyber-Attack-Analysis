from flask import jsonify
import psycopg2
from app import app
from flask import render_template
from flask import request
import json
import numpy as np
import time


@app.route('/')
@app.route('/getis_map' ,methods= ['GET', 'POST'])
def maps():
	""" Get Hotspots and render on screen
	"""

	req_data = (request.get_data())
	if req_data == "":
		return render_template("getis_map.html")
	else:
		conn = connect_db()
		cur = conn.cursor()
		cur.execute("select * from getis_score order by timestamp desc limit 5;")
		res = cur.fetchall()
		json_data = [{"Latitude": x[1], "Longitude": x[2], "GScore": x[3]} for x in res]
		return jsonify(json_data)


@app.route('/dash_query3',methods=['GET', 'POST'])
def dash_query():
	
	conn = connect_db()
	cur = conn.cursor()

	resp = (request.get_data())


	if resp == "":
		return render_template("dash_query3.html")

	else:
		req_params = resp.split("&")
		lat = req_params[0].split("=")
		lon = req_params[1].split("=")
		ts = req_params[2].split("=")
		first = req_params[3].split("=")
		

		#### Convert to radians
		lat_rad = float(lat[1]) * 3.14 / 180.0
		lon_rad = float(lon[1]) * 3.14 / 180.0

		### Setting arc radian r for 1000 Kms
		r = 0.1570

		### Finding Lat min and max
		lat_min = (lat_rad - r) * 180/3.14
		lat_max = (lat_rad + r) * 180/3.14

		### Finding Lon min and max
		#latT = arcsin(sin(lat)/cos(r)) = 1.4942 rad
		latT = np.arcsin(np.sin(lat_rad)/np.cos(r))
		# arcsin(sin(r)/cos(lat)) = 1.1202 rad
		lon_delta = np.arcsin(np.sin(r)/np.cos(lat_rad))
		# lonmin = lonT1 = lon - dellon = -1.8184 rad (6)
		#lonmax = lonT2 = lon + dellon = 0.4221 rad 
		lon_min = ( lon_rad - lon_delta ) * 180/3.14
		lon_max = ( lon_rad + lon_delta ) * 180/3.14

		
		
		if first[1] == "1":
			rem = 60000
			rows = []
			for i in range (0,10):
				time_period = int(ts[1]) - rem
				jdata = get_data(time_period,time_period+5000,lat_rad,lat_rad,lon_rad,1)
				rows.append(jdata)
				rem = rem - 10000
				#time.sleep(1)
			return jsonify(rows)

		else:
			jdata = get_data(int(ts[1])-50000,int(ts[1]),lat_rad,lat_rad,lon_rad,0)
			return jdata
				
def connect_db():
	""" Connect to Database
	"""
	try:
		conn = psycopg2.connect("dbname='attacksdb' user='postgres' host='XXXX' password='XXX'")
		return conn
	except:
		print "Not connected"

def get_data(t1,t2,lat_rad,lat_rad2,lon_rad,flag):
	""" Get data for boundary box calculation
		Find points within the boundary
		Group by count abd count the types
	"""
	conn = connect_db()
	cur = conn.cursor()
	
	cur.execute("SELECT attack_type,count(attack_type) FROM attack_records WHERE Timestamp >= %s and TimeStamp <= %s and acos(sin(%s) * sin(Latitude*3.14/180) + cos(%s) * cos(Latitude*3.14/180) * cos((Longitude*3.14/180) - (-%s))) * 6371 <= 100 group by attack_type;",((t1),(t2),lat_rad,lat_rad2,lon_rad))

	res = cur.fetchall()
	json_data = []

	if len(res) == 0:
		cur2 = conn.cursor()
		cur2.execute("select * from attack_type_count;")
		res2 = cur2.fetchall()
		for data in res2:
			json_data.append({"Attack_type":data[0] , "Count" : data[1] })


		if flag == 0:
			return jsonify(json_data)
		else:
			return json_data

	else:

		for data in res:
			json_data.append({"Attack_type":data[0] , "Count" : data[1] })

	if flag == 0:
		return jsonify(json_data)
	return json_data
	
