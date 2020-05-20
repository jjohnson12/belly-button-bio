
function metadataRefresh(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    // Filter the data for the target sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Use d3 to select the `metadata` panel
    var panel = d3.select("#sample-metadata");
    console.log(panel)

    // Use `.html("") to clear metadata
    panel.html("");

    // Get key & value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h5").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

function init() {
  // Reference  the dropdown element
  var selector = d3.select("#selDataset");
  console.log(selector);

  // Use the sample names to populate options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the 1st sample to build beginning plots
    var firstSample = sampleNames[0];
    metadataRefresh(firstSample);
    chartRefresh(firstSample)
  });
}

function optionChanged(sample) {
  // Fetch new data when new sample selected
  metadataRefresh(sample);
  chartRefresh(sample)
};

// Start the engine
init();

function chartRefresh(sample) {
    
  d3.json('samples.json').then(function (data) {
    console.log(data);

    var otu_ids = data.samples.filter(d => d.id == sample)[0].otu_ids;
    var otu_labels = data.samples.filter(d => d.id == sample)[0].otu_labels;
    var sample_values = data.samples.filter(d => d.id == sample)[0].sample_values;

    // bubbles
    var data = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'CubehelixDefault'
      }
    }];      
//chart layout
    var layout = {
      showlegend: false,
      margin: { t: 0 },
      hovermode: 'closest', 
      xaxis: {title: 'OTU ID'},
    };

    Plotly.newPlot('bubbles', data, layout);

  // Make the pizza
  var data = [{
      values: sample_values.slice(0,10),
      labels: otu_ids.slice(0, 10),
      hovertext: otu_labels.slice(0, 10),
      type: 'pie'
    }];

    Plotly.newPlot('pizzapie', data);
});
};
