//https://d3js.org/d3.v4.min.js
define(["qlik", "./d3.v4.min","css!./style.css"],
    function(qlik, d3) {
        return {
            initialProperties: {
                qHyperCubeDef: {
                    qDimensions: [],
                    qMeasures: [],
                    customItems: [],
                    qInitialDataFetch: [{
                        qWidth: 3,
                        qHeight: 1000
                    }]
                }
            },
            definition: {
                type: "items",
                component: "accordion",
                items: {
                    dimensions: {
                        uses: "dimensions",
                        min: 1,
                        max: 1
                    },
                    measures: {
                        uses: "measures",
                        min: 1,
                        max: 1,
                        items: {
                            color: {
                                type: "string",
                                ref: "qAttributeExpressions.0.qExpression",
                                label: "Bubble Color",
                                //expression: "always",
                                component: "expression",
                                defaultValue: "='#000'"
                            },
                            circleWidthMes: {
                                type: "string",
                                ref: "qAttributeExpressions.1.qExpression",
                                label: "Bubble Width",
                                //expression: "always",
                                component: "expression",
                                defaultValue: "=10",
                                show: function(a, d) {
                                    return !d.layout.showcircleWidth;
                                }
                            },
                            Textcolor: {
                                type: "string",
                                ref: "qAttributeExpressions.2.qExpression",
                                label: "Text Color",
                                //expression: "always",
                                component: "expression",
                                defaultValue: "='#000'"
                            },
                        }
                    },
                    sorting: {
                        uses: "sorting"
                    },
                    settings: {
                        uses: "settings",
                        items: {
                            settingsPanel: {
                                type: "items",
                                label: "More Settings",
                                items: {
                                    lineWidth: {
                                        type: "integer",
                                        label: "Line Width",
                                        ref: "lineWidth",
                                        defaultValue: "5"
                                    },
                                    showcircleWidth: {
                                        type: "boolean",
                                        label: "show Circle Width",
                                        ref: "showcircleWidth",
                                        defaultValue: true
                                    },
                                    circleWidth: {
                                        type: "integer",
                                        label: "Circle Width",
                                        ref: "circleWidth",
                                        defaultValue: "10",
                                        show: function(d) {
                                            return d.showcircleWidth;
                                        }
                                    },
                                    xAxisFontSize: {
                                        type: "number",
                                        component: "slider",
                                        label: "X Axis FontSize",
                                        ref: "xAxisFontSize",
                                        min: 10,
                                        max: 20,
                                        step: 0.5,
                                        defaultValue: 15
                                    },
                                    xAxisRightLeft: {
                                        type: "number",
                                        component: "slider",
                                        label: "X Axis Right/Left",
                                        ref: "xAxisRightLeft",
                                        min: -20,
                                        max: 100,
                                        step: 1,
                                        defaultValue: -10
                                    },
                                    xAxisRotate: {
                                        type: "number",
                                        component: "slider",
                                        label: "X Axis Rotate",
                                        ref: "xAxisRotate",
                                        min: -180,
                                        max: 180,
                                        step: 1,
                                        defaultValue: -10
                                    },
                                    yAxisFontSize: {
                                        type: "number",
                                        component: "slider",
                                        label: "Y Axis FontSize",
                                        ref: "yAxisFontSize",
                                        min: 10,
                                        max: 20,
                                        step: 0.5,
                                        defaultValue: 15
                                    },
                                    yAxisRightLeft: {
                                        type: "number",
                                        component: "slider",
                                        label: "Y Axis Right/Left",
                                        ref: "yAxisRightLeft",
                                        min: -20,
                                        max: 100,
                                        step: 1,
                                        defaultValue: -10
                                    },
                                    yAxisRotate: {
                                        type: "number",
                                        component: "slider",
                                        label: "Y Axis Rotate",
                                        ref: "yAxisRotate",
                                        min: -180,
                                        max: 180,
                                        step: 1,
                                        defaultValue: -10
                                    },
                                }
                            }
                        }
                    }
                }
            },
            support: {
                snapshot: true,
                export: true,
                exportData: false
            },
            paint: function($element, layout) {
                //add your rendering code here
                console.log(layout);
                var options = {
                        "objid": layout.qInfo.qId,
                        "lineWidth": layout.lineWidth,
                        "circleWidth": layout.circleWidth,
                        "xAxisFontSize": layout.xAxisFontSize,
                        "yAxisFontSize": layout.yAxisFontSize,
                        "yAxisRightLeft": layout.yAxisRightLeft,
                        "yAxisRotate": layout.yAxisRotate,
                        "xAxisRightLeft": layout.xAxisRightLeft,
                        "xAxisRotate": layout.xAxisRotate
                    },
                    data = [],self=this;
                $element.html('<div id="chart' + options.objid + '"></div>');
                layout.qHyperCube.qDataPages["0"].qMatrix.map(function(val) {
                    data.push({
                        "Dim": val["0"].qText,
                        "bubbleColor": val["1"].qAttrExps.qValues["0"].qText,
                        "bubbleSize": val["1"].qAttrExps.qValues["1"].qText,
                        "ElemNo": val["0"].qElemNumber,
                        "Value": val["1"].qNum,
                        "ValueText": val["1"].qText,
                        "Textcolor": val["1"].qAttrExps.qValues["2"].qText
                    });
                });
				//Math.floor(
                var maxValue = layout.qHyperCube.qMeasureInfo["0"].qMax,
					minValue =( layout.qHyperCube.qMeasureInfo["0"].qMin > 0 ? 0 :  layout.qHyperCube.qMeasureInfo["0"].qMin);


                // set the dimensions and margins of the graph
                var margin = { top: 40, right: 20, bottom: 20, left: 40 },
                    width = $element.width() - margin.left - margin.right,
                    height = $element.height() - margin.top - margin.bottom;

                // append the svg object to the body of the page
                var svg = d3.select("#chart" + options.objid)
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    /*
                    .style("margin-top", margin.top)
                    .style("margin-bottom", margin.bottom)
                    .style("margin-right", margin.right)
                    .style("margin-left", margin.left)
                    */
                    .append("g")
                    .attr("class", "chart_container")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

                // Parse the Data
                // X axis
                var x = d3.scaleBand()
                    .range([0, width])
                    .domain(data.map(function(d) { return d.Dim; }))
                    .padding(1);

                svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .attr("class", "xAxis")
                    .style("font-size", options.xAxisFontSize)
                    .call(d3.axisBottom(x))
                    .selectAll("path")
                    .attr("stroke", "#b1b0b0")
                    .selectAll("text")
                    .attr("transform", "translate(" + options.xAxisRightLeft + ",0)rotate(" + options.xAxisRotate + ")")
                    .style("text-anchor", "end");

                // Add Y axis
                var y = d3.scaleLinear()
                    .domain([0, maxValue])
                    .range([height, minValue])
                    .nice();
				
                svg.append("g")
                    .attr("class", "yAxis")
                    .style("font-size", options.yAxisFontSize)
                    .call(d3.axisLeft(y))
                    .selectAll("path")
                    .attr("stroke", "#b1b0b0")
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("transform", "translate(" + options.yAxisRightLeft + ",0)rotate(" + options.yAxisRotate + ")");

                // Lines
                svg.selectAll("myline")
                    .data(data)
                    .enter()
                    .append("line")
                    .attr("x1", function(d) { return x(d.Dim); })
                    .attr("x2", function(d) { return x(d.Dim); })
                    .attr("y1", function(d) { return y(d.Value); })
                    .attr("y2", y(0))
                    .attr("stroke", "#595959")
                    .attr("stroke-width", options.lineWidth)
					.on("click", function(d) {
                        self.selectValues(0, [d.ElemNo], true);
						this.classList.toggle("selected");
                	});

                // Circles
                svg.selectAll("mycircle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("class", "circleValue")
                    .attr("cx", function(d) { return x(d.Dim); })
                    .attr("cy", function(d) { return y(d.Value); })
                    .attr("r", (layout.showcircleWidth ? options.circleWidth : function(d) { return d.bubbleSize; }))
                    .style("fill", function(d) { return d.bubbleColor; })
                    .attr("stroke", "black")
                    .attr("ElemNo", function(d) { return d.ElemNo; })
					.on("click", function(d) {
                        self.selectValues(0, [d.ElemNo], true);
						this.classList.toggle("selected");
                	});

                // Add the circles Text				
                svg.selectAll("myValue")
                    .data(data)
                    .enter()
                    .append("text").attr("x", function(d) {
                        return (x(d.Dim));
                    }).attr("y", function(d) {
                        return (y(d.Value) - 30);
                    }).attr("font-size", "15px").attr("text-anchor", "middle").attr("alignment-baseline", "central").attr("fill", function(d) {
                        return d.Textcolor;
                    }).text(function(d) {
                        return d.Value;
                    }).append("title").text(function(d) {
                        return d.Value;
                    })
					.on("click", function(d) {
                        self.selectValues(0, [d.ElemNo], true);
						this.classList.toggle("selected");
                	});
				
				
				
                //needed for export
                return qlik.Promise.resolve();
            }
        };
    });