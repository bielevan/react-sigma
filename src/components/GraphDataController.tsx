import { useContext, useEffect } from "react";
import { useSigma } from "react-sigma-v2"
import { LayoutConfigureContext } from "../context/LayoutConfigureContext";
import React from 'react';

interface GraphDataControllerProps {
    children?: unknown;
}

const colors = [
    '#1abc9c',
    '#2ecc71',
    '#3498db',
    '#9b59b6',
    '#34495e',
    '#f1c40f',
    '#e67e22',
    '#e74c3c',
    '#7f8c8d',
    '#e84393',
]

export default function GraphDataController({ children }: GraphDataControllerProps) {

    const sigma = useSigma();
    const graph = sigma.getGraph();
    const {
        datasetAnimate,
        filter,
        isClustering
    } = useContext(LayoutConfigureContext);

    /**
     * Constroi grafo assim que dataset é mudado
     */
    useEffect(() => {
        if (!datasetAnimate || !graph)
            return;

        if (isClustering) {
            datasetAnimate.nodes.forEach((node: any) => {
                let label_complete: string[] = node.label.split(" ");
                let promulgation: string = label_complete[label_complete.length - 1];
                graph.addNode(node.label, {
                    x: node.x,
                    y: node.y,
                    label: node.label,
                    cluster: node.cluter,
                    color: colors[node.cluster],
                    size: 8.0,
                    promulgation: promulgation
                })
            });
        } else {
            datasetAnimate.nodes.forEach((node: any) => {
                let label_complete: string[] = node.label.split(" ");
                let promulgation: string = label_complete[label_complete.length - 1];
                graph.addNode(node.label, {
                    x: node.x,
                    y: node.y,
                    label: node.label,
                    color: '#95a5a6',
                    size: 8.0,
                    promulgation: promulgation
                })
            });
        }

        return () => graph.clear();
    }, [datasetAnimate]);

    /**
     * Aplica o filtro
     */
    useEffect(() => {
        if (!datasetAnimate || !graph)
            return;

        // Aplica filtro de acordo com os nós definidos
        if (filter.nodes.length > 0) {
            graph.forEachNode((node: string) => {
                let att = graph.getNodeAttributes(node);
                if (filter.nodes.findIndex((nodeFilter: string) =>
                    att.label == nodeFilter) < 0) {
                    graph.setNodeAttribute(node, "hidden", 1);
                }
            });
        }

        // Remove filtro
        else {
            graph.forEachNode((node: string) =>
                graph.setNodeAttribute(node, "hidden", 0)
            );
        }
    }, [filter]);

    return <>{children}</>
}