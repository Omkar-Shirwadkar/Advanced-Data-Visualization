// Bar Chart
d3.csv("data.csv").then(data => {
  const svg = d3.select("#bar-chart").append("svg").attr("width", 500).attr("height", 300);
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  const width = 500 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  const x = d3.scaleBand().domain(data.map(d => d.Ticker)).range([0, width]).padding(0.1);
  const y = d3.scaleLinear().domain([0, d3.max(data, d => +d.Volume)]).range([height, 0]);

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  g.append("g").call(d3.axisLeft(y));
  g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

  g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.Ticker))
      .attr("y", d => y(+d.Volume))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(+d.Volume))
      .attr("fill", "steelblue");
});

// Pie Chart
d3.csv("data.csv").then(data => {
  const svg = d3.select("#pie-chart").append("svg").attr("width", 300).attr("height", 300);
  const radius = 150;
  const g = svg.append("g").attr("transform", "translate(150,150)");

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const pie = d3.pie().value(d => d.Volume);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  const arcs = g.selectAll("arc").data(pie(data)).enter().append("g");

  arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.Ticker));

  arcs.append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .text(d => d.data.Ticker);
});

// Histogram
d3.csv("data.csv").then(data => {
  const svg = d3.select("#histogram").append("svg").attr("width", 500).attr("height", 300);
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  const width = 500 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  const x = d3.scaleLinear().domain([0, d3.max(data, d => +d.Volume)]).range([0, width]);
  const histogram = d3.histogram().value(d => +d.Volume).domain(x.domain()).thresholds(x.ticks(10));

  const bins = histogram(data);

  const y = d3.scaleLinear().domain([0, d3.max(bins, d => d.length)]).range([height, 0]);

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  g.append("g").call(d3.axisLeft(y));
  g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

  g.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("transform", d => `translate(${x(d.x0)},${y(d.length)})`)
      .attr("width", d => x(d.x1) - x(d.x0) - 1)
      .attr("height", d => height - y(d.length))
      .attr("fill", "orange");
});

// Timeline Chart
d3.csv("data.csv").then(data => {
  const svg = d3.select("#timeline-chart").append("svg").attr("width", 800).attr("height", 300);
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  const width = 800 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  const x = d3.scaleTime().domain(d3.extent(data, d => new Date(d.Date))).range([0, width]);
  const y = d3.scaleLinear().domain([0, d3.max(data, d => +d.Close)]).range([height, 0]);

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  g.append("g").call(d3.axisLeft(y));
  g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

  g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line().x(d => x(new Date(d.Date))).y(d => y(+d.Close)));
});

// Scatter Plot
d3.csv("data.csv").then(data => {
  const svg = d3.select("#scatter-plot").append("svg").attr("width", 500).attr("height", 300);
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  const width = 500 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  const x = d3.scaleLinear().domain([d3.min(data, d => +d.Open), d3.max(data, d => +d.Open)]).range([0, width]);
  const y = d3.scaleLinear().domain([d3.min(data, d => +d.Close), d3.max(data, d => +d.Close)]).range([height, 0]);

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  g.append("g").call(d3.axisLeft(y));
  g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

  g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(+d.Open))
      .attr("cy", d => y(+d.Close))
      .attr("r", 5)
      .attr("fill", "purple");
});

// Word Chart
d3.csv("data.csv").then(data => {
  const svg = d3.select("#word-chart").append("svg").attr("width", 500).attr("height", 300);
  
  // Define the font size scale based on volume
  const fontSize = d3.scaleLinear().domain(d3.extent(data, d => +d.Volume)).range([10, 40]);

  svg.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d, i) => (i % 5) * 100 + 50)
      .attr("y", (d, i) => Math.floor(i / 5) * 50 + 50)
      .text(d => d.Ticker)
      .attr("font-size", d => fontSize(+d.Volume))
      .attr("fill", "steelblue");
});

// Box and Whisker Plot
d3.csv("data.csv").then(data => {
  const svg = d3.select("#box-whisker").append("svg").attr("width", 500).attr("height", 300);
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  const width = 500 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  const tickers = Array.from(new Set(data.map(d => d.Ticker)));
  const x = d3.scaleBand().domain(tickers).range([0, width]).padding(0.2);
  const y = d3.scaleLinear().domain([d3.min(data, d => +d.Close), d3.max(data, d => +d.Close)]).range([height, 0]);

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
  g.append("g").call(d3.axisLeft(y));
  g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

  // Aggregating data for each ticker for a basic box plot (mean, quartiles, etc.)
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

  // Draw box and whisker for each ticker
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
      });
});

// Violin Plot (simplified)
d3.csv("data.csv").then(data => {
  const svg = d3.select("#violin-plot").append("svg").attr("width", 500).attr("height", 300);
  
  // Kernel density estimation could be added here using an additional library or custom function
  // For simplicity, we plot distributions based on sample data
  
  // Placeholder for a custom kernel density estimation function if needed
  function kernelDensityEstimator(kernel, X) {
      return function(V) {
          return X.map(x => [x, d3.mean(V, v => kernel(x - v))]);
      };
  }
  
  // Further implementation needed for full violin plot distribution visualization
});

// Regression Plot
d3.csv("data.csv").then(data => {
  const svg = d3.select("#regression-plot").append("svg").attr("width", 500).attr("height", 300);
  
  // Scatter plot
  const x = d3.scaleLinear().domain(d3.extent(data, d => +d.Open)).range([0, 500]);
  const y = d3.scaleLinear().domain(d3.extent(data, d => +d.Close)).range([300, 0]);
  
  svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(+d.Open))
      .attr("cy", d => y(+d.Close))
      .attr("r", 3)
      .attr("fill", "blue");
  
  // Linear regression line
  const regressionLine = d3.line()
      .x(d => x(d.Open))
      .y(d => y(d.Close)); // Dummy function; for actual regression, you'd calculate y = a + b*x here
});

// Jitter Plot
d3.csv("data.csv").then(data => {
  const svg = d3.select("#jitter-plot").append("svg").attr("width", 500).attr("height", 300);
  
  const x = d3.scaleBand().domain(data.map(d => d.Ticker)).range([0, 500]);
  const y = d3.scaleLinear().domain(d3.extent(data, d => +d.Close)).range([300, 0]);
  
  svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.Ticker) + Math.random() * x.bandwidth())
      .attr("cy", d => y(+d.Close))
      .attr("r", 4)
      .attr("fill", "purple")
      .attr("opacity", 0.6);
});
