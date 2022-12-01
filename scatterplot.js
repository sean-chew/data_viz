const tooltip = d3.select("body").append("div").attr("class", "tooltip");

function scatterPlot(data) {
  var w = 800;
  var h = 600;
  var padding = 20;
  var xScale = d3
    .scaleLinear()
    .domain([0, 0.3])
    .rangeRound([0, w - padding * 2]);

  var yScale = d3
    .scaleLinear()
    .domain([0, 250])
    .range([h - padding, 0]);

  var rScale = d3
    .scaleLinear()
    .domain([
      0, //Because I want a zero baseline
      d3.max(data, function (d) {
        return parseInt(d["count_all"]);
      }),
    ])
    .range([2, 20]);

  const uniqueValues = Array.from(new Set(data.map((i) => i.boro___x)));
  console.log(uniqueValues);
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(uniqueValues);

  console.log(data)

  //Create SVG element
  var svg = d3
    .select("#scatterplot")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("transform", "translate(20, 0)")
    .attr("viewBox", [0, 0, w + padding * 2, h + padding * 2]);

  xAxis = d3.axisBottom().scale(xScale).ticks(9); //TODO: change ticks

  //Define Y axis
  yAxis = d3.axisLeft().scale(yScale).ticks(10);

  const circles = svg.selectAll("circle").data(data.filter((d) => d.boro___x));

  circles
    .enter()
    .append("circle")
    .attr("class", (d) => d.boro___x)
    .attr("cx", function (d) {
      return xScale(d.vacant_ratio);
    })
    .attr("cy", function (d) {
      return yScale(d.unit_value_mean_y);
    })
    .attr("r", (d) => rScale(d.count_all))
    .style("fill", (d) => colorScale(d.boro___x))
    .attr("opacity", 0.6)
    .on("mouseover", (e, d) => {
      content = `NTA: ${d.NTA__}<br>Storefront Counts: ${d.count_all}<br>Vacant Storefront Ratio: ${+d3.format(".2f")(d.vacant_ratio)}<br>Median Land Unit Value: ${+d3.format(".2f")(d.unit_value_mean_y)}`;
      tooltip.html(content).style("visibility", "visible");
      d3.select(e.target).transition().duration('100').attr('r', (d) => rScale(d.count_all)+5).style("stroke","grey").style("stroke-width", 2)
    })
    .on("mousemove", (e, d) => {
      tooltip
        .style("top", e.pageY - (tooltip.node().clientHeight + 5) + "px")
        .style("left", e.pageX - tooltip.node().clientWidth / 2.0 + "px");
    })
    .on("mouseout", (e, d) => {
      tooltip.style("visibility", "hidden");
      d3.select(e.target).transition().duration('180').attr('r', (d) => rScale(d.count_all)).style("stroke","transparent").style("stroke-width", 1)
    });

  const boroCircles = document.querySelectorAll("circle");
  const buttons = document.querySelectorAll(".boro-btn");
  Array.from(buttons).forEach((button) => {
    button.addEventListener("click", (event) => {
      if (button.id !== "overall") {
        let boroNum = event.target.attributes["data-index"].value;
        Array.from(boroCircles).forEach((circle) => {
          if (+circle.classList === +boroNum) {
            circle.attributes["opacity"].value = 0.6;
            circle.attributes["style"].value = `fill: ${colorScale(boroNum)}`;
          } else {
            circle.attributes["opacity"].value = 0.05;
            circle.attributes["style"].value = "grey";
          }
        });
      } else {
        Array.from(boroCircles).forEach((circle) => {
          circle.attributes["opacity"].value = 0.6;
          circle.attributes["style"].value = `fill: ${colorScale(
            circle.classList.value
          )}`;
        });
      }

      // document.querySelector('#scatterTitle').innerText = button.innerText
    });
  });

  //Create X axis
  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(20," + (h - padding) + ")")
    .call(xAxis);

  //Create Y axis
  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);
}
