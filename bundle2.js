(function (d3) {
    'use strict';
  
  
  
    const dropdownMenu = (selection, props) => {
      const {
        options,
        onOptionClicked,
        selectedOption
      } = props;
      
      let select = selection.selectAll('select').data([null]);
      select = select.enter().append('select')
        .merge(select)
          .on('change', function() {
            onOptionClicked(this.value);
          });
      
      const option = select.selectAll('option').data(options);
      option.enter().append('option')
        .merge(option)
          .attr('value', d => d)
          .property('selected', d => d === selectedOption)
          .text(d => d);
    };
  
    const scatterPlot = (selection, props) => {
      const {
        xValue,
        xAxisLabel,
        yValue,
        circleRadius,
        yAxisLabel,
        margin,
        width,
        height,
        data
      } = props;
      
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      
      const xScale = d3.scaleLinear()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice();
      
      const yScale = d3.scaleLinear();
      yScale.domain(d3.extent(data, yValue));
      yScale.range([innerHeight, 0]);
      yScale.nice();
      
      const g = selection.selectAll('.container').data([null]);
      const gEnter = g
        .enter().append('g')
          .attr('class', 'container');
      gEnter
        .merge(g)
          .attr('transform',
            `translate(${margin.left},${margin.top})`
          );
      
      const xAxis = d3.axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickPadding(15);
      
      const yAxis = d3.axisLeft(yScale)
        .ticks(6)
        .tickSize(-innerWidth)
        .tickPadding(10);
      
      const yAxisG = g.select('.y-axis');
      const yAxisGEnter = gEnter
        .append('g')
          .attr('class', 'y-axis');
      yAxisG
        .merge(yAxisGEnter)
          .call(yAxis)
          .selectAll('.domain').remove();
      
      const yAxisLabelText = yAxisGEnter
        .append('text')
          .attr('class', 'axis-label')
          .attr('y', -93)
          .attr('fill', 'black')
          .attr('transform', `rotate(-90)`)
          .attr('text-anchor', 'middle')
        .merge(yAxisG.select('.axis-label'))
          .attr('x', -innerHeight / 2)
          .text(yAxisLabel);
      
      
      const xAxisG = g.select('.x-axis');
      const xAxisGEnter = gEnter
        .append('g')
          .attr('class', 'x-axis');
      xAxisG
        .merge(xAxisGEnter)
          .attr('transform', `translate(0,${innerHeight})`)
          .call(xAxis)
          .selectAll('.domain').remove();
      
      const xAxisLabelText = xAxisGEnter
        .append('text')
          .attr('class', 'axis-label')
          .attr('y', 75)
          .attr('fill', 'black')
        .merge(xAxisG.select('.axis-label'))
          .attr('x', innerWidth / 2)
          .text(xAxisLabel);
  
      
      const circles = g.merge(gEnter)
        .selectAll('circle').data(data);
      circles
        .enter().append('circle')
          .attr('cx', innerWidth / 2)
          .attr('cy', innerHeight / 2)
          .attr('r', 0)
        .merge(circles)
        .transition().duration(2000)
        .delay((d, i) => i * 10)
          .attr('cy', d => yScale(yValue(d)))
          .attr('cx', d => xScale(xValue(d)))
          .attr('r', circleRadius);
    };
  
    const svg = d3.select('svg');
  
    const width = +svg.attr('width');
    const height = +svg.attr('height');
  
    let data;
    let xColumn;
    let yColumn;
  
    const onXColumnClicked = column => {
      xColumn = column;
      render();
    };
  
    const onYColumnClicked = column => {
      yColumn = column;
      render();
    };
  
    const render = () => {
      
      d3.select('#x2-menu')
        .call(dropdownMenu, {
          options: data.columns,
          onOptionClicked: onXColumnClicked,
          selectedOption: xColumn
        });
      

      
      svg.call(scatterPlot, {
        xValue: d => d[xColumn],
        xAxisLabel: xColumn,
        yValue: d => d.year, //d[yColumn],
        circleRadius: 10,
        yAxisLabel: yColumn,
        margin: { top: 10, right: 40, bottom: 88, left: 150 },
        width,
        height,
        data
      });
    };
  
    d3.csv('https://raw.githubusercontent.com/sc6354/Info-Vis.-Spring-2021-Final-Project/main/data%20files/2015_2021.csv')
      .then(loadedData => {
        data = loadedData;
        data.forEach(d => {
          d.score = +d.score;
          d.logged_gdp_per_capita = +d.logged_gdp_per_capita;
          d.social_support = +d.social_support;
          d.healthy_life_expectancy = +d.healthy_life_expectancy;
          d.freedom_to_make_life_choices = +d.freedom_to_make_life_choices;
          d.generosity = +d.generosity;
          d.perceptions_of_corruption = +d.perceptions_of_corruption;
          d.eb_log_gdp_per_capita = +d.eb_log_gdp_per_capita;
          d.eb_social_support = +d.eb_social_support;
          d.eb_healthy_life_expectancy = +d.eb_healthy_life_expectancy;
          d.eb_freedom_to_make_life_choices = +d.eb_freedom_to_make_life_choices;
          d.eb_generosity = +d.eb_generosity;
          d.eb_perceptions_of_corruption = +d.eb_perceptions_of_corruption;
        });
        xColumn = data.columns[4];
        yColumn = data.columns[2];
        render();
      });
  
  }(d3));
  
  