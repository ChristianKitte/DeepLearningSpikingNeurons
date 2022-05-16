// https://www.youtube.com/watch?v=y2-sgZh49dQ
// https://github.com/BlastWind/D3.js-Tutorial
// https://github.com/BlastWind/D3.js-Tutorial

// https://observablehq.com/@chinwobble/force-layout
// https://www.pluralsight.com/guides/creating-force-layout-graphs-in-d3

// https://chartio.com/resources/tutorials/how-to-resize-an-svg-when-the-window-is-resized-in-d3-js/
// https://observablehq.com/@xianwu/force-directed-graph-network-graph-with-arrowheads-and-lab
class NetworkGraph {
    constructor(network) {
        this.neurons = network.neurons;
        this.connections = network.connections;

        this.graph = this.GetGraphData(this.neurons, this.connections);

        d3.select("#test").remove();

        const svg = d3.select("div#container")
            .append("svg")
            .attr("id", "test")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 400 400")
            .classed("svg-content", true);

        const simulation = d3.forceSimulation(this.graph.nodes)
            .force('charge', d3.forceManyBody().strength(-500))
            .force('link', d3.forceLink(this.graph.links).id(d => d.nameTest)
                .distance(50))
            .force('center', d3.forceCenter(200, 200))

        const node = svg.selectAll('circle')
            .data(this.graph.nodes)
            .enter()
            .append('circle')
            .attr('r', 5)
            .attr('fill', 'blue');

        const link = svg
            .selectAll('path.link')
            .data(this.graph.links)
            .enter()
            .append('path')
            .attr('stroke', 'black')
            .attr('fill', 'none');

        const lineGenerator = d3.line();

        simulation.on('tick', () => {
            node.attr('cx', d => d.x);
            node.attr('cy', d => d.y);
            link.attr('d', d => lineGenerator([
                [d.source.x, d.source.y],
                [d.target.x, d.target.y]])
            )
        });

        // http://bl.ocks.org/mbostock/2706022

        return svg.node();
    }

    GetGraphData(neurons = [], connections = []) {
        let nodes = [];
        let links = [];

        this.neurons.forEach(
            (neuron) => {
                //nodes.push({name: neuron.id});
                nodes.push({nameTest: neuron.id, namex: neuron.Spiking});
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