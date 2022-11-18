

        function scatterPlot(data) {
            var w = 800;
            var h = 600;
            var padding = 20;
            var xScale = d3.scaleLinear()
                .domain([0, 0.3])
                .rangeRound([0, w - padding * 2])

            var yScale = d3.scaleLinear()
                .domain([0, 250])
                .range([h - padding, 0]);

            // var rScale = d3.scaleLinear()
            //     .domain([
            //         0,  //Because I want a zero baseline
            //         d3.max(data, function (d) { return parseInt(d["dropout_rate"]); })
            //     ])
            //     .range([2, 10]);

            // const uniqueValues = Array.from(new Set(data.map(i => i.boro_mix)))
            // const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(uniqueValues)

            // console.log(colorScale('11'))

            //Create SVG element
            var svg = d3.select("#scatterplot")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .attr("transform", "translate(20, 0)")
                .attr("viewBox", [0, 0, w + padding * 2, h + padding * 2])

            xAxis = d3.axisBottom()
                .scale(xScale)
                .ticks(9)//TODO: change ticks 

            //Define Y axis
            yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(10);

            function createCircles(svg, data, boroNum = '1') {
                const circles = svg.selectAll("circle")
                    .data(data.filter(d => d.boro___x.includes(boroNum)))

                const circlesEnter = circles.enter().append("circle")
                circles.exit().remove()

                circlesEnter.merge(circles).attr("cx", function (d) {
                    return xScale(d.vacant_ratio);
                })
                    .attr("cy", function (d) {
                        return yScale(d.unit_value_mean_y)
                    })
                    .attr("r", d => d.count_all * .01)
                    // .style("fill", d => colorScale(d.boro_mix))
                    .attr("opacity", .6);

                return circles

            }

            createCircles(svg, data, '1')


            const buttons = document.querySelectorAll('.boro-button')
            Array.from(buttons).forEach(button => {
                const boroNum = button.dataset.boronum
                button.addEventListener('click', () => {

                    createCircles(svg, data, boroNum)
                    document.querySelector('#title').innerText = button.innerText

                })
            })

            //Create X axis
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(20," + (h - padding) + ")")
                .call(xAxis);

            //Create Y axis
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + padding + ",0)")
                .call(yAxis);
        }