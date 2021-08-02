// Second Slide

async function renderLineChart() {
    // set the dimensions and margins of the graph based on the screen size
    const margin = { top: 10, right: 50, bottom: 50, left: 50 },
        width = window.innerWidth - margin.left - margin.right,
        height = window.innerHeight - margin.top - margin.bottom;

    // append the svg to the div within the body of the page
    let svg = d3.select("#line_chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // load the bitcoin data
    const bitcoinData = await d3.csv("https://jaw1025.github.io/datasets/Bitcoin.csv",

        // parse the date into the correct format
        function (d) {
            return { date: d3.timeParse("%m\/%d\/%Y")(d.date), close: d.close }
        })

    // load the ethereum data
    const ethData = await d3.csv("https://jaw1025.github.io/datasets/Ethereum.csv",

        // parse the date into the correct format
        function (d) {
            return { date: d3.timeParse("%m\/%d\/%Y")(d.date), close: d.close }
        })

    // Add X axis
    const x = d3.scaleTime()
        .domain(d3.extent(bitcoinData, function (d) { return d.date; }))
        .range([0, width]);

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x)
            .ticks(30)
            .tickFormat(function (date) {
                if (d3.timeYear(date) < date) {
                    return d3.timeFormat('%b')(date);
                } else {
                    return d3.timeFormat('%Y')(date);
                }
            }))
        .selectAll("text")
        .style("text-anchor", "center")
        .style("font-weight", "bold")
        .style("font-size", "14px");

    // Add Y axis
    const y = d3.scaleLog()
        .domain([1, d3.max(bitcoinData, function (d) { return +d.close; })])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y)
            .tickValues([10, 150, 500, 1000, 3000, 5000, 10000, 20000, 60000])
            .tickFormat(d => '$' + `${d3.format(".2s")(d)}`))
        .selectAll("text")
        .style("text-anchor", "center")
        .style("font-weight", "bold")
        .style("font-size", "14px");

    // Add the bitcoin price line
    svg.append("path")
        .datum(bitcoinData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function (d) { return x(d.date) })
            .y(function (d) { return y(d.close) })
        )

    // Add the ethereum price line
    svg.append("path")
        .datum(ethData)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function (d) { return x(d.date) })
            .y(function (d) { return y(d.close) })
        )

    /* Code below relevant for annotations */
    const annotations = [{
        note: { label: "Hacks on Asian Exchanges" },
        subject: {
            y1: 100,
            y2: height + 10
        },
        y: 75,
        data: { x: "1/20/2018" }
    },
    {
        note: { label: "Bitcoin Cash Fork" },
        subject: {
            y1: 190,
            y2: height + 10
        },
        y: 175,
        data: { x: "8/15/2017" }
    },
    {
        note: { label: "China Bans Crypto Mining" },
        subject: {
            y1: 170,
            y2: height + 10
        },
        y: 160,
        data: { x: "6/25/2021" }
    },
    {
        note: {
            label: "Beginning of Pandemic",
            lineType: "none",
            orientation: "leftRight",
            "align": "middle"
        },
        className: "anomaly",
        type: d3.annotationCalloutCircle,
        subject: { radius: 25 },
        data: { x: "4/25/2020", y: 120 },
        dx: 100
    },
    {
        note: { label: "Above $100", wrap: 100, },
        className: "above",
        disable: ["connector"],
        subject: {
            x1: x(new Date('10/1/1999')),
            x2: x(new Date('8/1/2000'))
        },
        x: x(new Date('10/1/1999')),
        dx: -30,
        data: { y: 100 }
    }

    ]
    const type = d3.annotationCustomType(
        d3.annotationXYThreshold,
        {
            "note": {
                "lineType": "none",
                "orientation": "top",
                "align": "middle"
            }
        }
    )

    const makeAnnotations = d3.annotation()
        .type(type)
        .accessors({
            x: function (d) { return x(new Date(d.x)) },
            y: function (d) { return y(d.y) }
        })
        .annotations(annotations)
        .textWrap(60)

    d3.select("svg")
        .append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations)
}
