function renderChoropleth() {
    // set the dimensions and margins of the graph based on the screen size
    const margin = { top: 10, right: 60, bottom: 50, left: 60 },
        width = window.innerWidth - margin.left - margin.right,
        height = window.innerHeight - margin.top - margin.bottom;

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
        .center([0, 20])
        .translate([width / 2, height / 2]);

    // Data and color scale
    const data = new Map();
    const colorScale = d3.scaleLinear()
        .domain([0, 50])
        .range(["#f9f1b3", "#802e0e"]);

    const tooltip = d3.select("#choropleth")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "10px")
        .style("padding", "10")
        .style("color", "white")
        .style("width", "150px")
        .style("height", "75px")

    // Load external data and boot
    Promise.all([
        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
        d3.csv("https://jaw1025.github.io/datasets/CountryData.csv", function (d) {
            data.set(d.code,
                {
                    name: d.country,
                    shareofhash: Number(d.shareofhashrate),
                });

        })]).then(function (loadData) {
            let topo = loadData[0]

            let mouseOver = function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(TooltipHTML(data.get(d.id)));
                tooltip.style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px")

                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 1)
                    .style("stroke", "black")
            }

            let mouseLeave = function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);

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
                    if (!data.has(d.id)) {
                        return 0;
                    } else {
                        return colorScale(data.get(d.id).shareofhash);
                    }
                })
                .style("stroke", "transparent")
                .attr("class", function (d) { return "Country" })
                .style("opacity", .8)
                .on("mouseover", mouseOver)
                .on("mouseleave", mouseLeave)

        })
}

function TooltipHTML(object) {
    return "<div>" + object.name + "</div><div>" + object.shareofhash + "% of global hash rate</div>";
}
