function barChart_count(dataset){
	console.log("Drawing a bar chart")
	var margin = 0
	var width = 700
	var height = 800


//drawing the things


var svg = d3.select("#chart1").append("svg").attr("width",width+250).attr("height", height-275)
	
	//xScale moves x-axis up and down & sets scale. yScale shrinks labels and bars together
	var xScale = d3.scaleLinear().range ([0, width=250])
	var yScale = d3.scaleLinear().range ([height/2,0]);
	

	//get the max value of x from the dataset
	var xMax = d3.max(dataset,function(d){return d.n})
	
	//get the max value of x from the dataset
	//console.log(xMax)
	xScale.domain([0,xMax]);
	yScale.domain([0,dataset.length])
	

// Filter between years


	const results2019 = dataset.filter(only2019)
	//looping through each row and matching 
	 function only2019(row){
		return row.reporting_year == "2019 and 2020"
	}
	console.log(results2019); // here is the list of only 2019/2020 values

	const results2021 = dataset.filter(only2021)
	//looping through each row and matching 
	 function only2021(row){
		return row.reporting_year == "2020 and 2021"
	}
	console.log(results2021); // here is the list of only 2020/2021 values

	
//Call the function 2 times to draw the bars for both - they are on top of each other


drawTypeBarChart(results2021,"_2021")
drawTypeBarChart(results2019,"_2019")

	
//Put functions into buttons
	//2019 button
	d3.select("#button2019").on("click",function(){
		//Remove the other chart and add 2019 
		d3.selectAll(".typeCharts").remove()
		drawTypeBarChart(results2019,"_2019")
		d3.selectAll(".typecountText").remove()


	})
	d3.select("#button2020").on("click",function(){
		//Remove the other chart and add 2021
		d3.selectAll(".typeCharts").remove()
		drawTypeBarChart(results2021,"_2021")
		d3.selectAll(".typecountText").remove()

		
	})
	d3.select("#buttonChange").on("click",function(){
		//here I remove all other charts and add the change which will be drawn below
		d3.selectAll(".typeCharts").remove()
		drawChangeChart(changeData,"change")
		
	})
	
	
	//TODO: NEXT STEPS
	//TODO 1 Calculate the change here in a loop
	//const changeData = dataset.map()....

	
	//TODO 2
	function drawChangeChart(dataset,className){
		//draw a new separte chart here for the change
	}

	
	//NEW 1.this below is your unchanged code put into a function
	
	function drawTypeBarChart(dataset,className){
	//set where the bars start to draw 
	var g = svg.append("g")
		.attr("transform", "translate(" + 260 + "," + -8 + ")")
		//here i am adding 2 class names - the year and the chart group's general name for reference
        .attr("class", className+" typeCharts")
		

// draw the svgs 


g.selectAll("._2021")
	 .data(dataset)
     .enter().append("rect")
	 //NEW class
     .attr("class", 'bar')
     .attr("width", function(d) { 
	 return xScale(d.n); }) 
     .attr("x", function(d){
	 return 0
	 })
     .attr("y", function(d,i) { return yScale(i) - 200; }) 
     .attr("height", 8)
	 .attr("fill", "#C0DCF1"); 

 svg.selectAll(".countText")
     .data(results2019)
     .enter()
     .append("text")
     .attr("class", "countText")
     .attr("x", function(d,i) { return xScale(d.n) + 265; })
     .attr("y", function(d,i) { return yScale(i) - 200; })
     .text(function(d) {
	  return d.n}) // return the value n for each row 
     .attr("font-family", "monospace")
     .attr("font-size", "10px")
     .attr("fill", "lightgray"); 

 svg.selectAll(".countText")
     .data(results2021)
     .enter()
     .append("text")
     .attr("class", "countText") // new class
     .attr("x", function(d,i) { return xScale(d.n) + 265; })
     .attr("y", function(d,i) { return yScale(i) - 200; })
     .text(function(d) {
	  return d.n}) // return the value n for each row 
     .attr("font-family", "monospace")
     .attr("font-size", "10px")
     .attr("fill", "lightgray"); 

 svg.selectAll(".labels")
     .data(results2021)
     .enter()
     .append("text")
     .attr("class", "labels") // new class
     .attr("x",253) 
     .attr("text-anchor", "end")
     .attr("y", function(d,i) { return yScale(i) - 200; })
     .text(function(d) {
	  return d.primary_business_activity}) // return the activity for each row
     .attr("font-family", "monospace")
     .attr("font-size", "11px")
     .attr("fill", "#29335C");
		
	}


// Pull buttons 


const buttons = document.querySelectorAll('.year-button')
	 Array.from(buttons).forEach(button => {
	 const reporting_year = button.dataset.reporting_year
	 button.addEventListener('click', () => {
		createRect(svg, data, reporting_year)
		document.querySelector('#title').innerText = button.innerText
	})
})
}