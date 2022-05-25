import { useContext, useEffect } from "react";
import { useSigma } from "react-sigma-v2"
import { LayoutConfigureContext } from "../context/LayoutConfigureContext";
import {
    colors_executive_power,
    colors_legislative_power,
    colors_judicial_independence,
    colors_number_of_rights
} from "../type/colors";
import { features_constitutes } from "../context/ImportDataset";
import React from 'react';

interface GraphDataControllerProps {
    children?: unknown;
}

export default function GraphDataController({ children }: GraphDataControllerProps) {

    const sigma = useSigma();
    const graph = sigma.getGraph();
    const {
        datasetAnimate,
        filter,
        cppFilter,
        applyConstructGraph,
        minimumDegree
    } = useContext(LayoutConfigureContext);

    /**
     * Constroi grafo assim que dataset é escolhido no painel direito
     */
    useEffect(() => {
        // Se não existe dataset
        if (!datasetAnimate || !graph)
            return;

        // Limpa graph
        graph.clear();

        datasetAnimate.nodes.forEach((node: any) => {
            // Para cada nó, adiciona ao grafo com as devidas features
            graph.addNode(node.label, {
                x: node.x,
                y: node.y,
                label: node.label.split("_").join(" "),
                color: '#95a5a6',
                cluster: node.cluster,
                size: 8.0,
                id: node.id,
                borderColor: "#000"
            });
        });

        return () => graph.clear();
    }, [applyConstructGraph]);

    /**
     * Aplica o filtro de acordo com o painel esquerdo
     */
    useEffect(() => {
        if (!datasetAnimate || !graph)
            return;

        // Limpa o grafo para o estado natural antes de aplicar filtro
        graph.forEachNode((node: string) => {
            graph.setNodeAttribute(node, "hidden", 0);
        });

        // Aplica filtro de acordo com os nós definidos
        if (filter.nodes.length > 0) {
            graph.forEachNode((node: string) => {
                if (filter.nodes.findIndex((nodeFilter: string) => node == nodeFilter) < 0) {
                    graph.setNodeAttribute(node, "hidden", 1);
                }
            });

            // Condifura nós visiveis de acordo com a propriedade de minimumDegree
            graph.forEachNode((node) => {
                if (graph.degree(node) < minimumDegree)
                    graph.setNodeAttribute(node, "hidden", 0);
            });
        }
    }, [filter]);

    /**
     * Aplica filtro de acordo com a feature CPP escolhido a direita
     */
    useEffect(() => {
        switch (cppFilter) {
            case 0:
                // Limpa o grafo
                graph.forEachNode((node) =>
                    graph.setNodeAttribute(node, "color", "")
                );
                break;
            case 1:
                // Executive power
                graph.forEachNode((node) => {
                    let id = graph.getNodeAttribute(node, "id");
                    if (id < features_constitutes.features.length) {
                        let executivePower: number = Number(features_constitutes.features[id]['Executive Power']);
                        graph.setNodeAttribute(node, "color", colors_executive_power[executivePower])
                    }
                });
                break;
            case 2:
                // Legislative Power
                graph.forEachNode((node) => {
                    let id = graph.getNodeAttribute(node, "id");
                    if (id < features_constitutes.features.length) {
                        let legislativePower: number = Number(features_constitutes.features[id]['Legislative Power']);
                        let index = Number(String(legislativePower * 10).split(".")[0]);
                        graph.setNodeAttribute(node, "color", colors_legislative_power[index]);
                    }
                });
                break;
            case 3:
                // Judicial Independence
                graph.forEachNode((node) => {
                    let id = graph.getNodeAttribute(node, "id");
                    if (id < features_constitutes.features.length) {
                        let judicialIndependence: number = Number(features_constitutes.features[id]['Judicial Independence']);
                        graph.setNodeAttribute(node, "color", colors_judicial_independence[judicialIndependence]);
                    }
                });
                break;
            case 4:
                // Number of Rights
                graph.forEachNode((node) => {
                    let id = graph.getNodeAttribute(node, "id");
                    if (id < features_constitutes.features.length) {
                        let numberRights: number = Number(features_constitutes.features[id]['Number of Rights']);
                        let index = Number(String(numberRights).split("")[0]);
                        graph.setNodeAttribute(node, "color", colors_number_of_rights[index]);
                    }
                });
                break;
        }
    }, [cppFilter]);

    return <>{children}</>
}