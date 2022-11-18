//Filtering 2019 works but shows up only at the bottom. Also, filtering 2020 doesn't work 
//How to have one chart at a time show up in the right place? 
// you will also need to adjust the bar/labels/text .attr("y", ....
//How to do animations between multiple charts? 

function barChart_count(dataset){
	console.log("Drawing a bar chart")
	var margin = 0
	var width = 700
	var height = 800

//button and pulling data


const button1 = document.createElement('button')
button1.innerText = '2019 to 2020'

button1.addEventListener('click',() =>{
	alert('result2019') // empty for now, will add chart later . . . alert2019
})
document.getElementById("chart1title").append(button1)

const button2 = document.createElement('button')
button2.innerText = '2020 to 2021'

button2.addEventListener('click',() =>{
	alert('result2020') // empty for now, will add chart later . . . alert2020
})
document.getElementById("chart1title").append(button2)


//drawing the things


	var svg = d3.select("#chart1").append("svg").attr("width",width+250).attr("height", height-275)
	
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
	
	console.log(dataset)


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



// 2019 


	//instead of the y axis, we can just place labels as we did the rectangles below
	svg.selectAll(".labels")
       	 .data(dataset)
		 //.data(results2019)
         .enter()
		 .append("text")
         .attr("class", "labels")
		 .attr("x",253) 
		 .attr("text-anchor", "end")
		 .attr("y", function(d,i) { return yScale(i); })
		 .text(function(d) {
			return d.primary_business_activity}) // return the activity for each row
		.attr("font-family", "monospace")
		.attr("font-size", "11px")
		.attr("fill", "navy");

	svg.selectAll(".countText")
		 .data(dataset)
		 //.data(results2019)
		 .enter()
		 .append("text")
		 .attr("class", "countText")
		 .attr("x", function(d,i) { return xScale(d.n) + 265; })
		 .attr("y", function(d,i) { return yScale(i); })
		 .text(function(d) {
			return d.n}) // return the value n for each row 
		.attr("font-family", "monospace")
		.attr("font-size", "10px")
		.attr("fill", "lightgray");

	g.selectAll(".bar")
         .data(dataset)
		 //.data(results2019)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("width", function(d) { 
			 return xScale(d.n); }) 
         .attr("x", function(d){
			 return 0
		 })
        .attr("y", function(d,i) { return yScale(i); }) // adjust to draw at top instead of fixed index position
         .attr("height", 8)
		 .attr("fill", "lightsteelblue");


// 2020
		
	
	g.selectAll(".bar")
        // .data(dataset)
		 .data(results2021)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("width", function(d) { 
			 return xScale(d.n); }) 
         .attr("x", function(d){
			 return 0
		 })
        .attr("y", function(d,i) { return yScale(i); }) // adjust to draw at top instead of fixed index position
         .attr("height", 8)
		 .attr("fill", "lightsteelblue"); 

		 svg.selectAll(".labels")
		// .data(dataset)
	     .data(results2021)
	     .enter()
	     .append("text")
	     .attr("class", "labels")
	     .attr("x",253) 
	     .attr("text-anchor", "end")
	     .attr("y", function(d,i) { return yScale(i); })
	     .text(function(d) {
		  return d.primary_business_activity}) // return the activity for each row
	     .attr("font-family", "monospace")
	     .attr("font-size", "9px")
	     .attr("fill", "navy");

  svg.selectAll(".countText")
	    // .data(dataset)
	     .data(results2021)
	     .enter()
	     .append("text")
	     .attr("class", "countText")
	     .attr("x", function(d,i) { return xScale(d.n) + 265; })
	     .attr("y", function(d,i) { return yScale(i); })
	     .text(function(d) {
		  return d.n}) // return the value n for each row 
	     .attr("font-family", "monospace")
	     .attr("font-size", "10px")
	     .attr("fill", "lightgray"); 


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