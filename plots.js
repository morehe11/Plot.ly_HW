d3.json("samples.json").then((data) => {
    console.log(data);
});

function buildMetadata (sample) {
    d3.json("samples.json").then((data)=> {
        var metadata = data.metadata;
        var resultsarray = metadata.filter(sampleobject =>
            sampleobject.id == sample);
        var result = resultsarray[0]
        var panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(result).forEach(([key,value])=>{
            panel.append("h6").text(`${key}: ${value}`);
        });
    });
}


function buildChart(sample){
    d3.json("samples.json").then((data)=> {
        var samples = data.samples;
        var resultsarray = samples.filter(sampleObject =>
            sampleObject.id == sample);
        var result = resultsarray[0]

        var id = result.otu_ids;
        var labels = result.otu_labels;
        var values = result.sample_values;

        var layoutbubble = {
            title: "Bacteria Cultures Per Sample",
            margin: {t:0},
            xaxis: {title: "OTU ID"},
            hovermode: "closest",
        };

        var databubble = [{
            x: id, 
            y: values, 
            text: labels, 
            mode: "markers", 
            marker: {
                color: id, 
                size: values,
            }
        }];
    Plotly.newPlot("bubble", databubble, layoutbubble);

        var bardata =[{
            y: id.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
            x: values.slice(0,10).reverse(),
            text: labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        }];
        var barlayout = {
            title: "Top 10 bacteria found",
            margin: {t:30, l:150}
        };

        Plotly.newPlot("bar", bardata, barlayout);
    });
}

function init(){
    var selector = d3.select("#selDataset");
    d3.json("samples.json").then((data)=>{
        var samplenames = data.names;
        samplenames.forEach((sample)=>{
            selector
            .append("option")
            .text(sample)
            .property("value", sample);
        });
        
        const initialSample = samplenames[0];
        buildChart(initialSample);
        buildMetadata(initialSample);
    });
}

function optionchanded(newsample){
    buildcharts(newsample);
    buildMetadata(newsample);
}

init();
