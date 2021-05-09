import {
    select,
    csv,
    scaleLinear,
    extent,
    axisLeft,
    axisBottom
  } from 'd3';
  import { dropdownMenu } from './dropdownMenu';
  import { scatterPlot } from './scatterPlot';
  
  const svg = select('svg');
  
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
    
    select('#x-menu')
      .call(dropdownMenu, {
        options: data.columns,
        onOptionClicked: onXColumnClicked,
        selectedOption: xColumn
      });
    
    select('#y-menu')
      .call(dropdownMenu, {
        options: data.columns,
        onOptionClicked: onYColumnClicked,
        selectedOption: yColumn
      });
    
    svg.call(scatterPlot, {
      xValue: d => d[xColumn],
      xAxisLabel: xColumn,
      yValue: d => d[yColumn],
      circleRadius: 10,
      yAxisLabel: yColumn,
      margin: { top: 10, right: 40, bottom: 88, left: 150 },
      width,
      height,
      data
    });
  };
  
  csv('https://raw.githubusercontent.com/sc6354/Info-Vis.-Spring-2021-Final-Project/main/data%20files/2015_2021.csv')
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
      yColumn = data.columns[0];
      render();
    });