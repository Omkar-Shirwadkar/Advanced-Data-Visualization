// Word Chart with Tooltip
d3.csv("data.csv").then(data => {
    const svg = d3.select("#word-chart").append("svg").attr("width", 500).attr("height", 300);
    const fontSize = d3.scaleLinear().domain(d3.extent(data, d => +d.Volume)).range([10, 40]);

    const tooltip = d3.select("body").append("div").attr("class", "tooltip");

    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", (d, i) => (i % 5) * 100 + 50)
        .attr("y", (d, i) => Math.floor(i / 5) * 50 + 50)
        .text(d => d.Ticker)
        .attr("font-size", d => fontSize(+d.Volume))
        .attr("fill", "steelblue")
        .on("mouseover", function(event, d) {
            tooltip.style("visibility", "visible")
                   .text(`Ticker: ${d.Ticker}, Volume: ${d.Volume}`);
            d3.select(this).attr("fill", "orange");
        })
        .on("mousemove", event => {
            tooltip.style("top", (event.pageY - 10) + "px")
                   .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
            d3.select(this).attr("fill", "steelblue");
        });
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

