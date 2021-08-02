// First Slide
function renderBarChart() {  
    // set the dimensions and margins of the graph based on the screen size
    const margin = {top: 10, right: 60, bottom: 50, left: 60},
    width = window.innerWidth  - margin.left - margin.right,
    height = window.innerHeight  - margin.top - margin.bottom;

    // append the svg to the div within the body of the page
    let svg = d3.select("#bar_chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

    // load the data
    d3.csv("https://jaw1025.github.io/datasets/MarketCap.csv").then( 
        function(data) {
            // sort the data based on highest market cap
            data.sort(function(b, a) {
                return a.marketcap - b.marketcap;
            });

            var color = d3.scaleOrdinal(d3.schemeCategory10);

            // Add X axis
            var x = d3.scaleBand()
            .range([ 0, width ])
            .domain(data.map( d => d.name))
            .padding(0.2);

            svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
                .attr("transform", "translate(10,0)")
                .style("text-anchor", "end");

            // Add Y axis
            var y = d3.scaleLinear()
            .domain([0, 700000000000])
            .range([ height, 0]);
            svg.append("g")
            .call(d3.axisLeft(y)
            .ticks()
            .tickFormat(d => '$' + `${d3.format(".2s")(d)}`.replace('G','B')));

            // Add the bars
            svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
                .attr("x", d => x(d.name))
                .attr("y", d => y(d.marketcap))
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(d.marketcap))
                .attr("fill", function(d,i) { return color(i);})
        }
    )
}