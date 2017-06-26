function renderGraph(json_data) 
{
    console.log(json_data)
    

    /*var margin = {top: (parseInt(d3.select('body').style('height'), 10)/10), right: (parseInt(d3.select('body').style('width'), 10)/20), bottom: (parseInt(d3.select('body').style('height'), 10)/10), left: (parseInt(d3.select('body').style('width'), 10)/20)},
            width = parseInt(d3.select('body').style('width'), 10) - margin.left - margin.right,
            height = parseInt(d3.select('body').style('height'), 10) - margin.top - margin.bottom;*/

    var margin = {top: 20, right: 20, bottom: 70, left: 70},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    var div = d3.select("body").append("div").attr("class", "toolTip");

    var formatPercent = d3.format("");

    var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .2, 0.5);

    var y = d3.scale.linear()
            .range([height, 0]);

    var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

    var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(formatPercent);

    //var svg = d3.select("body").append("svg")
    var svg = d3.select("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

    change(json_data);

    function change(dataset) {

        x.domain(dataset.map(function(d) { return d.Attack_type; }));
        y.domain([0, d3.max(dataset, function(d) { return d.Count; })]);

        svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text");
                //.attr("transform", "rotate(-90)")
                /*.attr("y", 6)
                .attr("x", 16)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Frequency of Attacks %");*/

        svg.select(".y.axis").remove();
        svg.select(".x.axis").remove();

        svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Frequency of Attacks %");

        svg.append("text")      // text label for the x axis
        .attr("x", 265 )
        .attr("y", 250 )
        .style("text-anchor", "middle")
        .text("Cyber Attack Type");

        var bar = svg.selectAll(".bar")
                .data(dataset, function(d) { return d.Attack_type; });
        // new data:
        bar.enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.Attack_type); })
                //.attr("y", function(d) { return y(d.Count); })
                //.attr("height", function(d) { return height - y(d.Count); })
                .attr("y",y(0))
                .attr("height",height-y(0))
                .attr("width", x.rangeBand());

        bar
                .on("mousemove", function(d){
                    div.style("left", d3.event.pageX+10+"px");
                    div.style("top", d3.event.pageY-25+"px");
                    div.style("display", "inline-block");
                    div.html((d.attack_type)+"<br>"+(d.count)+"%");
                });
        bar
                .on("mouseout", function(d){
                    div.style("display", "none");
                });

        // removed data:
        bar.exit().remove();
        // updated data:
        bar
                .transition()
                .duration(750)
                .attr("y", function(d) { return y(d.Count); })
                //.attr("y",0)
                .attr("height", function(d) { return height - y(d.Count); });
    };}