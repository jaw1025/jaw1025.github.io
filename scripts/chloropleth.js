function renderChoropleth() {  
    // set the dimensions and margins of the graph based on the screen size
    const margin = {top: 10, right: 60, bottom: 50, left: 60},
    width = window.innerWidth  - margin.left - margin.right,
    height = window.innerHeight  - margin.top - margin.bottom;

    // append the svg to the div within the body of the page
    let svg = d3.select("#choropleth")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

    // Map and projection
    const path = d3.geoPath();
    const projection = d3.geoMercator()
    .scale(150)
    .center([0,20])
    .translate([width / 2, height / 2]);

    // Data and color scale
    const data = new Map();
    const colorScale = d3.scaleLinear()
    .domain([0, 50])
    .range(["#f9f1b3", "#802e0e"]);

    // Load external data and boot
    Promise.all([
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
    d3.csv("https://jaw1025.github.io/datasets/CountryData.csv", function(d) {
        data.set(d.code, +d.shareofhashrate)
    })]).then(function(loadData){
        let topo = loadData[0]
        let mouseOver = function(d) {
        d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .5)
        d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("stroke", "black")
    }

    let mouseLeave = function(d) {
        d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .8)
        d3.select(this)
        .transition()
        .duration(200)
        .style("stroke", "transparent")
    }

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        // set the color of each country
        .attr("fill", function (d) {
            d.total = data.get(d.code) || 0;
            console.log(d.total)
            return colorScale(d.total);
          })
        .style("stroke", "transparent")
        .attr("class", function(d){ return "Country" } )
        .style("opacity", .8)
        .on("mouseover", mouseOver )
        .on("mouseleave", mouseLeave )
    
    })
}
