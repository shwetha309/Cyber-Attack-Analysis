
// Displays 
function displayGraph(lat, lon) 
{

  if(lat =="" && lon =="") {
    lat = 33.76
    lon = -116.76
  }
  $.ajax(
  {
      type: 'POST',
      url: '/dash_query3',
      data: { "latitude": lat, "longitude":lon, "timestamp":(new Date()).getTime()-(4*60*60*100), "first": "1" } ,
      contentType: 'application/json; charset=utf-8',
      success: function(data) {
      console.log("displat data"+data.length);
      if (data.length == 0) {
          console.log("NUll")
          document.getElementById("cont").innerHTML = "<h1> No attacks in this area!!! </h1>";
      }
      else
      {
        renderGraph(data,lat,lon);
      }
    },
      error: function(textStatus, errorThrown) {
        console.log(textStatus)
      }

  })
}

function initialize() 
{

        var center = new google.maps.LatLng(40.71, -73.99);

        var mapOptions = {
            center: center,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        var map = new google.maps.Map(document.getElementById("map"),
                        mapOptions);

        google.maps.event.addDomListener(map, 'idle', function(){});

        

        google.maps.event.addListener(map, "click", function (event) {
                var latitude = event.latLng.lat();
                var longitude = event.latLng.lng();
                console.log( latitude + ', ' + longitude );

                center = new google.maps.LatLng(latitude, longitude);
                var mapOptions = {
                    center: center,
                    zoom: 10,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
        
                var map = new google.maps.Map(document.getElementById("map"),
                        mapOptions);


                

                var marker = new google.maps.Marker({
                      position: center,
                      map: map,
                      title: 'Hello World!'
                });

                circle = new google.maps.Circle({
                    center: center,
                    radius: 16093, //10 miles in meters
                    strokeColor: "#E16D65",
                    strokeOpacity: 1,
                    strokeWeight: 2,
                    fillColor: "#E16D65",
                    fillOpacity: 0.35
                });
                circle.setMap(map);
                circle.setRadius(16093);
                displayGraph(latitude,longitude);
        });
}
  
