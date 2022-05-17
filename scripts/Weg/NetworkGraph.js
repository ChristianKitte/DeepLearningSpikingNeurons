// https://www.youtube.com/watch?v=y2-sgZh49dQ
// https://github.com/BlastWind/D3.js-Tutorial
// https://github.com/BlastWind/D3.js-Tutorial

// https://observablehq.com/@chinwobble/force-layout
// https://www.pluralsight.com/guides/creating-force-layout-graphs-in-d3

// https://chartio.com/resources/tutorials/how-to-resize-an-svg-when-the-window-is-resized-in-d3-js/
// https://observablehq.com/@xianwu/force-directed-graph-network-graph-with-arrowheads-and-lab

// https://stackoverflow.com/questions/69246302/d3-why-on-mousehover-field-is-undefined-and-d3-event-is-undefined-too

// http://bl.ocks.org/mbostock/2706022

class NetworkGraph {
    constructor(network) {
        this.neurons = network.neurons;
        this.connections = network.connections;
    }

   createGraph() {
        // Initialisieren der DataSets für den Graphen
        this.graph = this.GetGraphData(this.neurons, this.connections);

        // Unsichtbaren ToolTip anlegen (Style in main.css über Klasse)
        let tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // svg initialisieren
        d3.select("#svgOutput").remove();

        const svg = d3.select("div#container")
            .append("svg")
            .attr("id", "svgOutput")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 400 400")
            .classed("svg-content", true);

        // node initialisieren
        const node = svg.selectAll('circle')
            .data(this.graph.nodes)
            .enter()
            .append('circle')
            .attr('class', 'networkNodeInactive')
            .attr('r', 5)
            .attr('fill', 'blue')
            .attr("width", function (d) {
                return d.size + 5;
            })
            .attr("height", function (d) {
                return d.size + 5;
            })
            .on("mouseover", function (d) {
                d3.select(this)
                    .transition()
                    .duration(350)
                    .attr("r", 10)
            })
            .on("mouseout", function (d) {
                d3.select(this)
                    .transition()
                    .duration(350)
                    .attr("r", 5)
            })
            .on('mouseover.tooltip', function (event, d) {
                tooltip.transition()
                    .duration(300)
                    .style("opacity", .8);
                tooltip.html(
                    "ID : " + d.Id + "</br>" +
                    "InputConnections : " + d.InputConnections + "</br>" +
                    "OutputConnections : " + d.OutputConnections + "</br>" +
                    "IncommingCurrent : " + d.IncommingCurrent + "</br>" +
                    "Spiking : " + d.Spiking + "</br>" +
                    "OutgoingVoltage : " + d.OutgoingVoltage + "</br>" +
                    "IncommingConnections : " + d.IncommingConnections + "<p/>" +
                    "IncommingActiveConenctions : " + d.IncommingActiveConenctions + "</br>" +
                    "OutgoingConnections : " + d.OutgoingConnections + "</br>")
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY + 10) + "px");
            })
            .on("mouseout.tooltip", function () {
                tooltip.transition()
                    .duration(100)
                    .style("opacity", 0);
            })
            .call(d3.drag()  //sets the event listener for the specified typenames and returns the drag behavior.
                .on("start", dragstarted) //start - after a new pointer becomes active (on mousedown or touchstart).
                .on("drag", dragged)      //drag - after an active pointer moves (on mousemove or touchmove).
                .on("end", dragended) //end - after an active pointer becomes inactive (on mouseup, touchend or touchcancel).
            );

        // link initialisieren
        const link = svg
            .selectAll('path.link')
            .data(this.graph.links)
            .enter()
            .append('path')
            .attr("class", "links")  // funktioniert noch nicht so richtig
            .attr('stroke', 'black')
            .attr('fill', 'none');

        // initialisieren der Simulation
        const simulation = d3.forceSimulation(this.graph.nodes)
            .force('charge', d3.forceManyBody() // Legt die Anziehung zwischen den Knoten fest
                .strength(-500)) // negative Werte führen zu Abstoßung
            .force('link', d3.forceLink(this.graph.links) // Unterstützt Links zwischen Knoten
                .id(d => d.Id)  // definiert die ID der Nodes (Default wird der Inex genutzt)
                .distance(50)) // definiert die Abstände
            .force('center', d3.forceCenter(200, 200)) // definert das Zentrum der Simulation

        const lineGenerator = d3.line();
        simulation.on('tick', () => {
            node.attr('cx', d => d.x);
            node.attr('cy', d => d.y);
            link.attr('d', d => lineGenerator([
                [d.source.x, d.source.y],
                [d.target.x, d.target.y]])
            )
        });

        //When the drag gesture starts, the targeted node is fixed to the pointer
        //The simulation is temporarily “heated” during interaction by setting the target alpha to a non-zero value.
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();//sets the current target alpha to the specified number in the range [0,1].
            d.fy = d.y; //fx - the node’s fixed x-position. Original is null.
            d.fx = d.x; //fy - the node’s fixed y-position. Original is null.
        }

        //When the drag gesture starts, the targeted node is fixed to the pointer
        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        //the targeted node is released when the gesture ends
        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        //return svg.node();
        return simulation;
    }

    updateGraph(neurons, connections, simulation) {
        simulation.stop();

        this.graph = this.GetGraphData(neurons, connections);

        let node_update = svg.selectAll(".node").data(
            force.nodes(),
            function(d) { return d.id;}
        );

        node_update.enter()
            .append("circle")
            .attr("class", function(d) { return "node " + d.id; })
            .attr("r", 8);

        // Apply the general update pattern to the nodes.
        node = node.data(nodes, function(d) { return d.id;});
        node.exit().remove();
        node = node.enter().append("circle").attr("fill", function(d) { return color(d.id); }).attr("r", 8).merge(node);


        /*
        const svg = d3.select("div#container");
        const nodes = svg.selectAll('circle')
            .data(this.graph.nodes, function (d) {
                return d.Id;
            })
            .attr('class', 'networkNodeActive');
*/

        simulation.nodes(this.graph.nodes);
        simulation.force("link").links(this.graph.links);
        simulation.alpha(1).restart();

        let test = 2;
    }


    restart() {


        // Apply the general update pattern to the nodes.
        node = node.data(nodes, function(d) { return d.id;});
        node.exit().remove();
        node = node.enter().append("circle").attr("fill", function(d) { return color(d.id); }).attr("r", 8).merge(node);

        // Apply the general update pattern to the links.
        link = link.data(links, function(d) { return d.source.id + "-" + d.target.id; });
        link.exit().remove();
        link = link.enter().append("line").merge(link);

        // Update and restart the simulation.
        simulation.nodes(nodes);
        simulation.force("link").links(links);
        simulation.alpha(1).restart();
    }


    /**
     * Erzeugt die für den Graphen benötigten Datasets (Nodes, Links/Edges)
     * @param neurons Ein Array der beteiligten Neuronen
     * @param connections Ein array der vorhandenen Verbindungen
     * @returns {{nodes: *[], links: *[]}} Ein Array
     * @constructor
     */
    GetGraphData(neurons = [], connections = []) {
        let nodes = [];
        let links = [];

        this.neurons.forEach(
            (neuron) => {
                //nodes.push({name: neuron.id});
                //nodes.push({nameTest: neuron.id, namex: neuron.Spiking});
                nodes.push({
                    Id: neuron.id,
                    InputConnections: neuron.inputConnections.length,
                    OutputConnections: neuron.outputConnection.length,
                    IncommingCurrent: neuron.incomingCurrent,
                    Spiking: neuron.spiking,
                    OutgoingVoltage: neuron.outgoingVoltag,
                    IncommingConnections: neuron.incomingConnections,
                    IncommingActiveConenctions: neuron.incomingActiveConnections,
                    OutgoingConnections: neuron.outgoingConnection,
                });
            }
        );

        this.connections.forEach(
            (connection) => {
                links.push(
                    {source: connection.from.id, target: connection.to.id}
                )
            }
        );

        return {
            nodes: nodes,
            links: links
        };
    }
}