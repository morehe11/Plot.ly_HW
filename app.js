  
d3.json("samples.json").then((data) => {
    console.log(data);
});

function buildMeta(sample){
    d3.json("samples.json").then(function(data){
        var metadata = data.metadata;
        var infoArray = metadata.filter(item => item.id == sample);
        var info = infoArray[0]
        var panel = d3.select("#sample-metadata")
        
        panel.html("");

        Object.entries(info).forEach(([key, value]) => {
            panel.append("p").text(`${key}: ${value}`);
        });
    });
};

function buildPlot(sample) {
    d3.json("samples.json").then(function(data){
        var samples = data.samples;
        var infoArray = samples.filter(item => item.id ==sample);
        var info = infoArray[0]

        var ids = info.otu_ids;
        var labels = info.otu_labels;
        var values = info.sample_values;

        var barTrace = [
            {
                x: values.slice(0,10).reverse(),
                y: ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
                text: labels.slice(0,10).reverse(),
                marker: {color: "rgb(242, 169, 58)"},
                type: "bar",
                orientation: "h"
            }
        ]

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            xaxis: {title: "Bacteria Sample"},
            yaxis: {title: "OTU ID"}
        }

        Plotly.newPlot("bar", barTrace, barLayout)

        var bubbleTrace = [
            {
                x: ids,
                y: values,
                text: labels,
                mode: "markers",
                marker: {
                    color: ids,
                    colorscale: "Electric",
                    size: values
                }
            }
        ];

        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Amount of Bacteria"}
        }

        Plotly.newPlot("bubble", bubbleTrace, bubbleLayout)
    })
}

function init(){
    var selector = d3.select("#selDataset");
    
    d3.json("samples.json").then(function(data){
        var sampleNames = data.names;
        sampleNames.forEach(function(sample){
            selector.append("option")
                    .text(sample)
                    .property("value", sample);
        });

        const initSample = sampleNames[0]
        buildPlot(initSample);
        buildMeta(initSample);
    })
}

function optionChange(newSample){
    buildPlot(newSample);
    buildMeta(newSample);
}
init();