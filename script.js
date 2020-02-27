var minYear = 1800
var maxYear = 2020
var yearSpan = [...Array(maxYear - minYear).keys()]
  .map(x => x + minYear)
  .filter(x => x % 10 === 0)
var year = document.getElementById('selected-year').innerHTML
var minVal = 24
var maxVal = 64

// When user changes year with slider
var slider = document.getElementById('slider'),
  selectedYearDiv = document.getElementById('selected-year')

slider.oninput = function() {
  selectedYearDiv.innerHTML = this.value
  year = this.value
  reFill()
}

// The svg
var svg = d3.select('svg'),
  width = +svg.attr('width'),
  height = +svg.attr('height')

// Map and projection
var path = d3.geoPath()
var projection = d3.geoMercator().scale(90)

/*
  .center([0, 20])
  .translate([width / 2, height / 2])
*/

// Data and color scale
var data = d3.map()
var colorScale = d3
  .scaleThreshold()
  .domain([10, 20, 30, 40, 50, 60, 70, 80])
  .range(d3.schemeReds[9])

var topo = null
// Load external data and boot

Promise.all([
  d3
    .json(
      'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'
    )
    .then(data => {
      topo = data
    }),
  d3.csv('csv/gini.csv').then(d => {
    d.map(x => {
      data.set(x.country, x)
    })
  }),
]).then(ready)

function ready() {
  // Draw the map
  svg
    .append('g')
    .selectAll('path')
    .data(topo.features)
    .enter()
    .append('path')
    // draw each country
    .attr('d', d3.geoPath().projection(projection))
    // set the color of each country
    .attr('fill', function(d) {
      d.total =
        (data.get(d.properties.name) && data.get(d.properties.name)[year]) || 0
      return colorScale(d.total)
    })
}

function reFill() {
  // Draw after changing year
  svg.selectAll('path').attr('fill', function(d) {
    d.total =
      (data.get(d.properties.name) && data.get(d.properties.name)[year]) || 0
    return colorScale(d.total)
  })
}
