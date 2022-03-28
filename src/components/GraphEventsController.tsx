import React, { useContext } from "react";
import { useEffect } from "react";
import { useRegisterEvents, useSigma } from "react-sigma-v2";
import setDistanceCosine from "../service/GraphAlgoritmos";
import forceAtlas2 from "graphology-layout-forceatlas2";
import { random } from "graphology-layout";
import noverlap from "graphology-layout-noverlap";
import { animateNodes } from "sigma/utils/animate";
import { LayoutConfigureContext } from "../context/LayoutConfigureContext";

function getMouseLayer() {
  return document.querySelector(".sigma-mouse");
}

interface GraphEventsControllerProps {
  children?: unknown;
  mouseEvent: boolean;
  setHoveredNode: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function GraphEventsController({
  children,
  mouseEvent,
  setHoveredNode
}: GraphEventsControllerProps) {

  // Instância do graph  
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const registerEvents = useRegisterEvents();

  const {
    cosine,
    maximumConnectedNeighbors,
    minimumDegree,
    layout,
    constructLayoutAfterApply
  } = useContext(LayoutConfigureContext);

  /**
   * Controla os eventos do mouse de click, enter e leave
   */
  useEffect(() => {
    registerEvents({
      clickNode({ node }) {
        if (!graph.getNodeAttribute(node, "hidden")) {
          console.log(node);
        }
      },
      leaveNode({ }) {
        setHoveredNode(null);
        const mouseLayer = getMouseLayer();
        if (mouseLayer) mouseLayer.classList.add("mouse-pointer");
      },
      enterNode({ node }) {
        if (mouseEvent) {
          setHoveredNode(node);
          const mouseLayer = getMouseLayer();
          if (mouseLayer) mouseLayer.classList.remove("mouse-pointer");
        }
      }
    });
  }, [mouseEvent]);

  useEffect(() => {
    // Clear graph
    graph.clearEdges();

    // Calcula a similaridade de cosseno entre todos os nós
    graph.forEachNode((nodeA) => {
      const vectorA = [
        graph.getNodeAttribute(nodeA, "x"),
        graph.getNodeAttribute(nodeA, "y"),
      ];
      const similarities: any[] = [];

      graph.forEachNode((nodeB) => {
        if (nodeA != nodeB) {
          const vectorB = [
            graph.getNodeAttribute(nodeB, "x"),
            graph.getNodeAttribute(nodeB, "y"),
          ];
          let similarity = setDistanceCosine(vectorA, vectorB);
          if (similarity >= cosine) {
            similarities.push({
              distance: similarity,
              nodeA: nodeA,
              nodeB: nodeB,
              label: `${nodeA} - ${nodeB}`,
            });
          }
        }
      });

      similarities
        .sort((edgeA, edgeB) => edgeA.distance - edgeB.distance)
        .slice(0, maximumConnectedNeighbors)
        .forEach((edge) => {
          graph.addEdge(edge.nodeA, edge.nodeB, {
            size: 1.0,
            color: "#95a5a6",
            label: edge.label,
          });
        });
    });

    // Configura size de cada nó de acordo com seu grau
    let degrees: number[] = [];
    graph.forEachNode((node) => degrees.push(graph.degree(node)));
    let maxDegree = Math.max(...degrees);
    let minDegree = Math.min(...degrees);
    if (maxDegree != minDegree) {
      graph.forEachNode((node) => {
        let degreeNode = graph.degree(node);
        let normValue =
          Math.round(
            ((degreeNode - minDegree) / (maxDegree - minDegree)) * 15
          ) + 5;
        graph.setNodeAttribute(node, "size", normValue);
      });
    }

    // Condigura nós visiveis de acordo com a propriedade de minimumDegree
    graph.forEachNode((node) => {
      if (graph.degree(node) < minimumDegree)
        graph.setNodeAttribute(node, "hidden", 0);
    });


    // Aplica animação do layout 
    // Force Layout
    if (layout === "force") {
      const forcePosition = forceAtlas2(graph, {
        iterations: 300,
        settings: {
          gravity: 1,
        },
      });
      animateNodes(graph, forcePosition, { duration: 3000, easing: "linear" });

      // N-Overlap Layout
    } else if (layout === "n-overlap") {
      const noverlapPosition = noverlap(graph, {
        maxIterations: 300,
        settings: {
          gridSize: 1,
          margin: 5,
        },
      });
      animateNodes(graph, noverlapPosition, {
        duration: 2000,
        easing: "linear",
      });

      // Random Layout
    } else if (layout === "random") {
      const randomPosition = random(graph, { scale: 1 });
      animateNodes(graph, randomPosition, {
        duration: 2000,
        easing: "linear",
      });
    }
  }, [constructLayoutAfterApply]);

  return <>{children}</>;
}
