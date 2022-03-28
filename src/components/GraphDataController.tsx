import { useContext, useEffect } from "react";
import { useSigma } from "react-sigma-v2"
import { LayoutConfigureContext } from "../context/LayoutConfigureContext";
import React from 'react';

interface GraphDataControllerProps {
    children?: unknown;
}

export default function GraphDataController({ children }: GraphDataControllerProps) {

    const sigma = useSigma();
    const graph = sigma.getGraph();
    const { datasetAnimate, filter } = useContext(LayoutConfigureContext);

    /**
     * Constroi grafo assim que dataset é mudado
     */
    useEffect(() => {
        if (!datasetAnimate || !graph)
            return;

        datasetAnimate.nodes.forEach((node) => {
            let label_complete: string[] = node.label.split(" ");
            let promulgation: string = label_complete[label_complete.length - 1];
            graph.addNode(node.label, {
                x: node.x,
                y: node.y,
                label: node.label,
                color: node.color,
                size: 8.0,
                promulgation: promulgation
            })
        });

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