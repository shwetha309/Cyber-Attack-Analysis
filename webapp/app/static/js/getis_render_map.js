var lastZoom = 11;
var circle;
var rMin = 180, rMax = 360,
    step = 10;
var intID;
var circles = new Array();


var marker, i, map;
var geocoder = new google.maps.Geocoder;
var infowindow = new google.maps.InfoWindow;


function displayDetails(i,data)
{
    document.getElementById("table").style.opacity="1"
    document.getElementById("table").className="table table-hover"

    document.getElementById("thead").style.opacity="1"
    document.getElementById("theader").className="thead-inverse"
    document.getElementById("trow").className="table-active"
    
    var center2 = new google.maps.LatLng(parseFloat(data[i]['Latitude']), parseFloat(data[i]['Longitude']));
    document.getElementById("1.1").innerHTML=data[i]['Latitude'];
    document.getElementById("1.2").innerHTML=data[i]['Longitude'];

  var geocoder  = new google.maps.Geocoder(); 
  geocoder.geocode({'latLng': center2}, function (results, status) 
  {
        if(status == google.maps.GeocoderStatus.OK) 
        {           
            var add = String(results[0].formatted_address).trim();         
         
            console.log(add);
            document.getElementById("1.3").innerHTML=add;

        }
  });
}

    function initialize() {

        $.ajax({
            type: 'POST',
            url: '/getis_map',
            data: { "field1": "load"} ,
            contentType: 'application/json; charset=utf-8',
            success: function(data) 
            {
                        console.log(data);

                        var bound = new google.maps.LatLngBounds();

                        for (i = 0; i < 5; i++) 
                        {
                            bound.extend( new google.maps.LatLng(data[i]['Latitude'], data[i]['Longitude']) );
                        }
                        var titles = [];
                        
                        
                        var mapOptions = {
                            center: bound.getCenter(),
                            zoom: lastZoom,
                            mapTypeId: google.maps.MapTypeId.SATELLITE
                        };
                        
                        map = new google.maps.Map(document.getElementById("map"),
                                        mapOptions);
                        
                        for (i = 0;i < data.length; i++)
                        {
                           
                            var center2 = new google.maps.LatLng(parseFloat(data[i]['Latitude']), parseFloat(data[i]['Longitude']));
                            circles[i] = new google.maps.Circle({
                            center:center2,
                            radius: rMax,
                            strokeColor: "#E16D65",
                            strokeOpacity: 1,
                            strokeWeight: 4,
                            fillColor: "#E16D65",
                            fillOpacity: 3
                            
                            });
                            circles[i].setMap(map);
                            
                        
                            setAnimation(i);
                                                
                            

                          
                            
                            marker = new google.maps.Marker({
                                position: center2,
                                map: map,
                                flat: true,
                                title: titles[i],
                                draggable: false
                            });

                            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                                return function() {
                                  //infowindow.setContent("hello");
                                  //infowindow.open(map, marker);
                                  displayDetails(i,data);
                                }
                              })(marker, i));
                            
                            
                       
                        }        
                        
                        google.maps.event.addListener(map, 'zoom_changed', function() {
                            console.log('zoom changed');
                            clearInterval(intID);
                            
                            var zoom = map.getZoom();

                            if (zoom > lastZoom) {
                                rMax /= 2;
                                rMin /= 2;
                                step /= 2;
                            } else {
                                rMax *= 2;
                                rMin *= 2;
                                step *= 2;
                            }
                            lastZoom = zoom;

                            for (i=0;i<5;i++) {
                                circles[i].setRadius(rMax);
                                setAnimation(i);
                            }
                        });
                       

            
            },
            error: function(textStatus, errorThrown) {
                console.log(textStatus)
            }

        })
        
    
        google.maps.event.addDomListener(map, 'idle', function(){});
        
  }      
    

function setAnimation(i) {

    var direction = 1;
    intID = setInterval(function() {
        var radius = circles[i].getRadius();
        if ((radius > rMax) || (radius < rMin)) {
            direction *= -1;
        }
        circles[i].setRadius(radius + direction * step);
    }, 50);        
}