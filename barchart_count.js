//How to show storefront value to the right of the bars?
//How to show only 2019/2020?
//How to do one chart, and have a buttom to show the next chart?
//How do we change fonts? 
//How to do animations between multiple charts? (Jia)

function barChart_count(dataset){
	console.log("Drawing a bar chart")
	var margin = 0
	var width = 700
	var height = 800
	
	var svg = d3.select("#chart1").append("svg").attr("width",width+200).attr("height",height-250)
	
	//xScale moves x-axis up and down & sets scale. yScale shrinks labels and bars together
	var xScale = d3.scaleLinear().range ([0, width=250])
	var yScale = d3.scaleLinear().range ([height-275, 0]);
	
	//set where the bars start to draw 
	var g = svg.append("g")
	.attr("transform", "translate(" + 260 + "," + -8 + ")")

	//get the max value of x from the dataset
	var xMax = d3.max(dataset,function(d){return d.n})
	
	//get the max value of x from the dataset
	console.log(xMax)
	xScale.domain([0,xMax]);
	yScale.domain([0,dataset.length])
	
	//set where the x-axis is drawn 
	//g.append("g")
	//.attr("transform", "translate(0, 545)")
	//.call(d3.axisBottom(xScale));

	console.log(dataset)

	//instead of the y axis, we can just place labels as we did the rectangles below
	svg.selectAll(".labels")
         .data(dataset)
         .enter()
		 .append("text")
         .attr("class", "labels")
		 .attr("x",255)
		 .attr("text-anchor", "end")
		 .attr("y", function(d,i) { return yScale(i); })
		 .text(function(d) {
			return d.primary_business_activity})
			//if(reporting_year="2020 and 2021"){
				//break;
			//}	
		.attr("font-family", "sans-serif")
		.attr("font-size", "11px")
		.attr("fill", "black");

	// Having problems getting labels to show up 
	svg.selectAll(".text")
		 .data(dataset)
		 .enter()
		 .append("text")
		 .attr("class", "text")
		 .attr("width", function(d) { 
			return yScale(d.n); })
		 .attr("y", function(d){
			return 0
		})
		 .attr("font-family", "sans-serif")
		 .attr("font-size", "12px")
		 .attr("fill", "black");
			
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
         .attr("height", 8)
		 .attr("fill", "lightsteelblue"); //silver


}