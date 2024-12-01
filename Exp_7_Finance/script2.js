// Bar Chart with Tooltip
d3.csv("data.csv").then(data => {
    const svg = d3.select("#bar-chart").append("svg").attr("width", 500).attr("height", 300);
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const x = d3.scaleBand().domain(data.map(d => d.Ticker)).range([0, width]).padding(0.1);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => +d.Close)]).nice().range([height, 0]);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    g.append("g").call(d3.axisLeft(y));
    g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

    const tooltip = d3.select("body").append("div").attr("class", "tooltip");

    g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.Ticker))
        .attr("y", d => y(+d.Close))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(+d.Close))
        .attr("fill", "steelblue")
        .on("mouseover", (event, d) => {
            tooltip.style("visibility", "visible")
                   .text(`Ticker: ${d.Ticker}, Close: ${d.Close}`);
            d3.select(event.target).attr("fill", "orange");
        })
        .on("mousemove", event => {
            tooltip.style("top", (event.pageY - 10) + "px")
                   .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", (event) => {
            tooltip.style("visibility", "hidden");
            d3.select(event.target).attr("fill", "steelblue");
        });
});

// Timeline Chart with Tooltip
d3.csv("data.csv").then(data => {
    const svg = d3.select("#timeline-chart").append("svg").attr("width", 500).attr("height", 300);
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    data.forEach(d => d.Date = new Date(d.Date));

    const x = d3.scaleTime().domain(d3.extent(data, d => d.Date)).range([0, width]);
    const y = d3.scaleLinear().domain(d3.extent(data, d => +d.Close)).range([height, 0]);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    g.append("g").call(d3.axisLeft(y));
    g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

    const tooltip = d3.select("body").append("div").attr("class", "tooltip");

    const line = d3.line().x(d => x(d.Date)).y(d => y(+d.Close));
    g.append("path").datum(data).attr("fill", "none").attr("stroke", "steelblue").attr("stroke-width", 1.5).attr("d", line);

    g.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.Date))
        .attr("cy", d => y(+d.Close))
        .attr("r", 3)
        .attr("fill", "red")
        .on("mouseover", (event, d) => {
            tooltip.style("visibility", "visible")
                   .text(`Date: ${d.Date.toDateString()}, Close: ${d.Close}`);
        })
        .on("mousemove", event => {
            tooltip.style("top", (event.pageY - 10) + "px")
                   .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", () => tooltip.style("visibility", "hidden"));
});

// Scatter Plot
d3.csv("data.csv").then(data => {
    const svg = d3.select("#scatter-plot").append("svg").attr("width", 500).attr("height", 300);
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const x = d3.scaleLinear().domain(d3.extent(data, d => +d.Open)).range([0, width]);
    const y = d3.scaleLinear().domain(d3.extent(data, d => +d.Close)).range([height, 0]);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    g.append("g").call(d3.axisLeft(y));
    g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

    g.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(+d.Open))
        .attr("cy", d => y(+d.Close))
        .attr("r", 3)
        .attr("fill", "blue");
});

// Bubble Plot
d3.csv("data.csv").then(data => {
    const svg = d3.select("#bubble-plot").append("svg").attr("width", 500).attr("height", 300);
    const x = d3.scaleLinear().domain(d3.extent(data, d => +d.Volume)).range([20, 480]);
    const y = d3.scaleLinear().domain(d3.extent(data, d => +d.Close)).range([280, 20]);
    const size = d3.scaleSqrt().domain(d3.extent(data, d => +d.Volume)).range([4, 40]);

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.Volume))
        .attr("cy", d => y(d.Close))
        .attr("r", d => size(d.Volume))
        .attr("fill", "green");
});

// Box and Whisker Plot with Tooltip
d3.csv("data.csv").then(data => {
    const svg = d3.select("#box-whisker").append("svg").attr("width", 500).attr("height", 300);
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const tickers = Array.from(new Set(data.map(d => d.Ticker)));
    const x = d3.scaleBand().domain(tickers).range([0, width]).padding(0.2);
    const y = d3.scaleLinear().domain([d3.min(data, d => +d.Close), d3.max(data, d => +d.Close)]).range([height, 0]);

    const tooltip = d3.select("body").append("div").attr("class", "tooltip");

    const boxData = tickers.map(ticker => {
        const prices = data.filter(d => d.Ticker === ticker).map(d => +d.Close);
        return {
            ticker: ticker,
            min: d3.min(prices),
            q1: d3.quantile(prices, 0.25),
            median: d3.median(prices),
            q3: d3.quantile(prices, 0.75),
            max: d3.max(prices)
        };
    });

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    g.append("g").call(d3.axisLeft(y));
    g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

    g.selectAll("g.box")
        .data(boxData)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${x(d.ticker)},0)`)
        .each(function(d) {
            const gBox = d3.select(this);
            gBox.append("line").attr("x1", x.bandwidth() / 2).attr("x2", x.bandwidth() / 2).attr("y1", y(d.min)).attr("y2", y(d.max)).attr("stroke", "black");
            gBox.append("rect").attr("x", 0).attr("width", x.bandwidth()).attr("y", y(d.q3)).attr("height", y(d.q1) - y(d.q3)).attr("fill", "steelblue");
            gBox.append("line").attr("x1", 0).attr("x2", x.bandwidth()).attr("y1", y(d.median)).attr("y2", y(d.median)).attr("stroke", "black");

            gBox.on("mouseover", () => {
                tooltip.style("visibility", "visible")
                    .text(`Ticker: ${d.ticker}, Min: ${d.min}, Max: ${d.max}, Median: ${d.median}`);
            })
            .on("mousemove", event => {
                tooltip.style("top", (event.pageY - 10) + "px")
                       .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", () => {
                tooltip.style("visibility", "hidden");
            });
        });
});
