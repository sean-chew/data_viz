function barChart_count(dataset){
	console.log("Drawing a bar chart")
	var margin = 200
	var width = 400
	var height = 800
	
	var svg = d3.select("#chart1").append("svg").attr("width",width+margin).attr("height",height+margin)
		
		
		//really both are linear scales not Band
		//here is the old		
		//var xScale = d3.scaleBand().range ([0, width]).padding(0.4);
		//here is the new
	var xScale = d3.scaleLinear().range ([0, width])
	var yScale = d3.scaleLinear().range ([height, 0]);
	
	var g = svg.append("g").attr("transform", "translate(" + 100 + "," + 100 + ")");

	//get the max value of x from the dataset
	var xMax = d3.max(dataset,function(d){return d.n})
	//console.log(xMax)
	xScale.domain([0,xMax]);
	//HERE: if you expand your elements panel, you will see that the rectangels are not drawing becasue y is undefined.
	//It is not defined because the scale y is nominal - and there is no max for types of businesses. instead, you can use the length of the data to be your y.
	
	//this i sthe old
	//	yScale.domain([0, d3.max(dataset, function(d) { console.log(d); return d["primary_business_activity"]; })]);
	
	//this is the new
	yScale.domain([0,dataset.length])
	
	g.append("g")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(xScale));

	console.log(dataset)
	
	//instead of the y axis, we can just place labels as we did the rectangles below
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