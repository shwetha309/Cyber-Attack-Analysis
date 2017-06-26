



function renderGraph(json_data,lat,lon) 
{
    

    $(function () 
    {
        $(document).ready(function() 
        {
            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });
     
            var chart;
            $('#container').highcharts(
            {
                chart: {
                    type: 'column',
                    animation: Highcharts.svg, // don't animate in old IE
                    marginRight: 10,
                    events: {
                        load: function() {
     
                            // set up the updating of the chart each second
                            var series = this.series[0];
                            var series2 = this.series[1];
                            var series3 = this.series[2];
                            setInterval(function() {
                                var x = (new Date()).getTime()-(4*60*60*1000) // current time

                                $.ajax({
                                    type: 'POST',
                                    url: '/dash_query3',
                                    data: { "latitude": lat, "longitude":lon, "timestamp":(new Date()).getTime(), "first" : "0"} ,
                                    contentType: 'application/json; charset=utf-8',
                                    
                                    success: function(data) {
                                        console.log("hey data ")
                                        console.log(data);
                                        y1 = data[0]['Count']
                                        y2 = data[1]['Count']
                                        y3 = data[2]['Count']
                                        series.addPoint([x, y1], false, true);
                                        series2.addPoint([x, y2], true, true);
                                        series3.addPoint([x, y3], true, true);
                                },
                                error: function(textStatus, errorThrown) {
                                    console.log(textStatus)
                                }

                        });
                                    
                            }, 5000);
                        }
                    }
                },
                title: {
                    text: 'Current Trends in the Given Region'
                },
                xAxis: {
                    type: 'datetime',
                    tickPixelInterval: 150
                },
                yAxis: [{
                    title: {
                        text: 'Malware'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                {
                    title: {
                        text: 'DDOS'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                {
                    title: {
                        text: 'Backdoor'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#708080'
                    }]
                }],
                tooltip: {
                    formatter: function() {
                            return '<b>'+ this.series.name +'</b><br/>'+
                            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                            Highcharts.numberFormat(this.y, 2);
                    }
                },
                legend: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                series: [{
                    name: 'MALWARE',
                    data: (function() {
                        // generate an array of random data
                        var index = 0;
                        var tname = String('MALWARE');
                        
                        var data = [],
                            time = (new Date()).getTime()-60000;
                            //i;
     
                        for (i = 0; i < json_data.length; i++) 
                        {
                            for (i1=0; i1<json_data[i].length; i1++)
                            {
                                type_name = String(json_data[i][i1]['Attack_type']).trim();
                                //console.log(type_name+"kil")
                                if (type_name.valueOf() == tname.valueOf())
                                {
                                    index = i1;
                                    //console.log("Index"+i)
                                }
                            }
                            console.log(json_data[i][index]['Count'])
                            data.push({
                                x: time + (i+1) * 5000,
                                y: json_data[i][index]['Count']
                                
                            });
                        }
                        return data;
                    })()
                },
                {
                    name: 'DDOS',
                    data: (function() {

                        var data = [],
                            time = (new Date()).getTime()-60000;

                        var tname = String('DDOS');
                        for (i=0; i<json_data.length; i++)
                        {
                            var index = 0;
                            for (i1=0; i1<json_data[i].length; i1++)
                            {
                                type_name = String(json_data[i][i1]['Attack_type']).trim();
                                //console.log(type_name+"kil")
                                if (type_name.valueOf() == tname.valueOf())
                                {
                                    index = i1;
                                    //console.log("Index"+i)
                                }
                            }
                            console.log(json_data[i][index]['Count'])
                            data.push({
                                x: time + (i+1) * 5000,
                                y: json_data[i][index]['Count']
                            });
                        }
                        return data;
                    })()
                },
                {
                    name: 'Backdoor',
                    data: (function() {

                        var data = [],
                            time = (new Date()).getTime()-60000;//,
                            //i;

                        var index = 0;
                        var tname = String('Backdoor');
                        for (i=0; i<json_data.length; i++)
                        {
                            for (i1=0; i1<json_data[i].length; i1++)
                            {
                                type_name = String(json_data[i][i1]['Attack_type']).trim();
                                
                                if (type_name.valueOf() == tname.valueOf())
                                {
                                    index = i1;
                                
                                }
                            }
                            console.log(json_data[i][index]['Count'])
                            data.push({
                                x: time + (i+1) * 5000,
                                y: json_data[i][index]['Count']
                            });
                        }
                        return data;
                    })()
                }]
            });
        });
     
    });
}
