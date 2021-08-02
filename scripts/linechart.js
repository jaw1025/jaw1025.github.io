// Second Slide

async function renderLineChart() {  
    // set the dimensions and margins of the graph based on the screen size
    const margin = {top: 10, right: 50, bottom: 50, left: 50},
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
    function(d) {
        return { date : d3.timeParse("%m\/%d\/%Y")(d.date), close : d.close }
    })

    // load the ethereum data
    const ethData = await d3.csv("https://jaw1025.github.io/datasets/Ethereum.csv",
    
    // parse the date into the correct format
    function(d) {
        return { date : d3.timeParse("%m\/%d\/%Y")(d.date), close : d.close }
    })

    // Add X axis
    const x = d3.scaleTime()
    .domain(d3.extent(bitcoinData, function(d) { return d.date; }))
    .range([ 0, width ]);
    svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLog()
    .domain([1, d3.max(bitcoinData, function(d) { return +d.close; })])
    .range([ height, 0 ]);
    svg.append("g")
    .call(d3.axisLeft(y)
    .tickFormat(d => '$' + `${d3.format(".2s")(d)}`));

    // Add the bitcoin price line
    svg.append("path")
    .datum(bitcoinData)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.close) })
    )

    // Add the ethereum price line
    svg.append("path")
    .datum(ethData)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.close) })
    )


/* Code below relevant for annotations */
const annotations = [{
    note: { label: "Steve Jobs Returns" },
    subject: {
      y1: 100,
      y2: window.innerHeight - 100
    },
    y: 100,
    data: { x: "7/9/2018"} //position the x based on an x scale
  },
  {
    note: { label: "iMac Release" },
    subject: {
      y1: margin.top,
      y2: height - margin.bottom
    },
    y: margin.top,
    data: { x: "8/15/1998"}
  },
  {
    note: { label: "iPod Release"},
    subject: {
      y1: margin.top,
      y2: height - margin.bottom
    },
    y: margin.top,
    data: { x: "10/23/2001"}
  },
  {
    note: { label: "Beginning of Pandemic", 
      lineType:"none", 
      orientation: "leftRight", 
      "align": "middle" },
    className: "anomaly",
    type: d3.annotationCalloutCircle,
    subject: { radius: 35,
                opacity: 1
    },
    data: { x: "4/2/2020", y: 80},
    dx: 200
  },
  {
    note: { label: "Above $100", wrap: 100, },
    className: "above",
    disable: ["connector"],
    subject: {
      x1: x( new Date('10/1/1999')),
      x2: x( new Date('8/1/2000'))
    },
    x: x( new Date('10/1/1999')),
    dx: -30,
    data: { y: 100}
  }

  ]

  //An example of taking the XYThreshold and merging it 
  //with custom settings so you don't have to 
  //repeat yourself in the annotations Objects
  const type = d3.annotationCustomType(
    d3.annotationXYThreshold, 
    {"note":{
        "lineType":"none",
        "orientation": "top",
        "align":"middle"}
    }
  )

  const makeAnnotations = d3.annotation()
    .type(type)
    //Gives you access to any data objects in the annotations array
    .accessors({ 
      x: function(d){ return x(new Date(d.x))},
      y: function(d){ return y(d.y) }
    })
    .annotations(annotations)
    .textWrap(30)

  d3.select("svg")
    .append("g")
    .attr("class", "annotation-group")
    .call(makeAnnotations)

}