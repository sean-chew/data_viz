function barChart_count(dataset){
	console.log("Drawing a bar chart")
	var margin = 200
	var width = 400
	var height = 800
	
	var svg = d3.select("#chart1").append("svg").attr("width",width+margin).attr("height",height+margin)
		
	var xScale = d3.scaleLinear().range ([0, width])
	var yScale = d3.scaleLinear().range ([height, 0]);
	
	var g = svg.append("g").attr("transform", "translate(" + 100 + "," + 100 + ")");

	//get the max value of x from the dataset
	var xMax = d3.max(dataset,function(d){return d.n})
	//console.log(xMax)
	xScale.domain([0,xMax]);

	yScale.domain([0,dataset.length])
	
	g.append("g")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(xScale));

	console.log(dataset)
	
	svg.selectAll(".labels")
         .data(dataset)
         .enter()
		 .append("text")
         .attr("class", "labels")
		.attr("x",20)
		 .attr("y", function(d,i) { return yScale(i); })
		.text(function(d){return d.primary_business_activity})
         

	g.selectAll(".bar")
         .data(dataset)
         .enter().append("rect")
         .attr("class", "bar")
		 //then over here you can use the index
         .attr("width", function(d) { 
			 return xScale(d.n); })
         .attr("x", function(d){
			 return 0
		 })
         .attr("y", function(d,i) { return yScale(i); })
         .attr("height", 20 );


}