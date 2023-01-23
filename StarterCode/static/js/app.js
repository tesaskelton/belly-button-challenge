const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

function getMetaData(id) {

    // promise for data elements contained in 'samples.json'
  d3.json(url).then((data) => {     
    
    var metadata = data.metadata;

    console.log(metadata);
  
        // stores the metadata for the id chosen
    var metadataArray = metadata.filter(sampleRec => sampleRec.id == id);

    console.log(metadataArray);

    //where to place on html
    divID = d3.select("#sample-metadata");

    //html reset
        divID.html("");

        // use object.entries to return key value pairs 
    Object.entries(metadataArray[0]).forEach(([key, value]) => {
      
      //  appends key/value pair to h5 on html
      divID.append("h5").text(`${key} : ${value}`);
    });
    });
}


function buildCharts(id) {

  // "promise to return data element from 'samples.json'"
  d3.json(url).then((data) => {

    // array that stores samples from json
    var samples = data.samples;
    var samplesArray = samples.filter(sampleRec => sampleRec.id == id);

    // get first element, labels and values
    var bactId = samplesArray[0];
    var otu_labels = bactId.otu_labels;
    var sample_values = bactId.sample_values;
    var otu_ids = bactId.otu_ids;

    

    // get top 10 otuids
    var top10otuids = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    
    // create bar chart
    var barData = [{
        //get top 10 in reverse to align with values
      x: sample_values.slice(0,10).reverse(),
      y: top10otuids,
      text: otu_labels.slice(0,10).reverse(),
      type: "bar",
      orientation : "h"
    }];
    
      // set bar layout
    var barLayout = {
      title: "Top 10 OTUIDs",
      margin: {t:30},
      height: 700,
      width: 700
    };
    // place plot at "bar" div id in html
    Plotly.newPlot("bar", barData, barLayout);

  // setup bubble chart
  var bubbleData = [
          {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
              size: sample_values,
              color: otu_ids,
              colorscale: "Bluered"
            }
          }
        ];
  // setup Layout
  var layout = {
    title: "Bubble Chart for Sample",
    xaxis: {title: "OTU ID"},
    hovermode: "closest",
    margin: {t: 20},
    margin: {t:30},
    height: 700,
    width: 1200
  };
// ploting the bubble chart
    Plotly.newPlot("bubble", bubbleData, layout);
  });
}


function init() {

  var selectID= d3.select("#selDataset");
  d3.json(url).then((data) => {
    var names = data.names;

    names.forEach((id) => {
      selectID
        .append("option")
        .text(id)
        .property("value", id)
    });

    var chosen = names[0];
    buildCharts(chosen)
    getMetaData(chosen);
  });
};

//builds new charts when new ID is chosen
function optionChanged(chosenID) {
  buildCharts(chosenID);
  getMetaData(chosenID);
}

// main call to initiation function
init();