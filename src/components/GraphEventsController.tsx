import React, { useContext } from "react";
import { useEffect } from "react";
import { useRegisterEvents, useSigma } from "react-sigma-v2";
import { setDistanceCosine, setDistanceEuclidian } from "../service/GraphAlgoritmos";
import forceAtlas2 from "graphology-layout-forceatlas2";
import noverlap from "graphology-layout-noverlap";
import { animateNodes } from "sigma/utils/animate";
import { LayoutConfigureContext } from "../context/LayoutConfigureContext";
import { colors_clusters } from "../type/colors";
import {
  getClusterByKMeans,
  getClustersByFastyGreedy
} from "../service/Api";

function getMouseLayer() {
  return document.querySelector(".sigma-mouse");
}

interface GraphEventsControllerProps {
  children?: unknown;
  mouseEvent: boolean;
  setHoveredNode: React.Dispatch<React.SetStateAction<string | null>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setClusterSelected: React.Dispatch<React.SetStateAction<number>>;
  setOpenClusterPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GraphEventsController({
  children,
  mouseEvent,
  setHoveredNode,
  setIsOpen,
  setClusterSelected,
  setOpenClusterPopup,
}: GraphEventsControllerProps) {

  // Instância do graph  
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const registerEvents = useRegisterEvents();

  const {
    distance,                                   // Distancia de cosseno
    maximumConnectedNeighbors,                  // Número máximo de vizinhos conectados
    layout,                                     // Layout a ser utilizado
    clustering,                                 // Processo de clusterização
    constructLayoutAfterApply,                  // Aplica a mudança no gráfico
    setIsLoading,                               // Habilita/Desabilita tela de Loading
    whoDistance                                 // Verifica qual a distancia a ser usada  
  } = useContext(LayoutConfigureContext);

  /**
   * Aplica o layout
   */
  function applyLayout(layout: string) {
    // Force Layout
    if (layout === "force") {
      const forcePosition = forceAtlas2(graph, {
        iterations: 500,
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
    }
  }

  /**
   * Calcula a similaridade de cosseno entre todos os nós
   */
  function constructGraphByCosine() {
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
          if (similarity >= distance) {
            similarities.push({
              distance: similarity,
              nodeA: nodeA,
              nodeB: nodeB,
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
            source: edge.nodeA,
            target: edge.nodeB
          });
        });
    });
  }

  /**
   * Calcula a ditancia euclidiana entre todos os nós
   */
  function constructGraphByEuclidian() {
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

          let similarity = setDistanceEuclidian(vectorA, vectorB);
          if (similarity <= distance) {
            similarities.push({
              distance: similarity,
              nodeA: nodeA,
              nodeB: nodeB,
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
            source: edge.nodeA,
            target: edge.nodeB
          });
        });
    });
  }

  /**
   * Controla os eventos do mouse de click, enter e leave
   */
  useEffect(() => {
    registerEvents({
      clickNode({ node }) {
        if (!graph.getNodeAttribute(node, "hidden")) {
          setClusterSelected(graph.getNodeAttribute(node, "cluster"));
          setOpenClusterPopup(true);
        }
      },

      leaveNode({ }) {
        setHoveredNode(null);
        const mouseLayer = getMouseLayer();
        if (mouseLayer)
          mouseLayer.classList.add("mouse-pointer");
      },

      enterNode({ node }) {
        if (mouseEvent) {
          setHoveredNode(node);
          const mouseLayer = getMouseLayer();
          if (mouseLayer)
            mouseLayer.classList.remove("mouse-pointer");
        }
      }
    });
  }, [mouseEvent]);

  /**
   * Função responsável por construir as arestas do gráfico, clusters e animações
   * */
  useEffect(() => {
    // Clear graph
    graph.clearEdges();

    // Calcula a similaridade de cosseno/distancia euclidiana entre todos os nós
    if (whoDistance == 0)
      constructGraphByCosine();
    else 
      constructGraphByEuclidian();

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

    // Clusterização KMeans
    if (clustering == 1) {
      let nodes: any[] = []
      let n_clusters: number = 10;
      graph.forEachNode(node_label => {
        nodes.push({
          "id": graph.getNodeAttribute(node_label, "id"),
          "x": graph.getNodeAttribute(node_label, "x"),
          "y": graph.getNodeAttribute(node_label, "y"),
          "label": node_label
        })
      });

      // Realiza a chamada API para obter os clusters por KMeans
      setIsLoading(true);
      getClusterByKMeans(nodes, 2, 30)
        .then((data) => {
          let clusters: number[] = data['clusters'];
          let labels: string[] = data['labels'];

          labels.forEach((label, index) => {
            graph.setNodeAttribute(label, "cluster", clusters[index]);
            graph.setNodeAttribute(label, "color", colors_clusters[clusters[index]]);
          });

          // Aplica animação do layout 
          applyLayout(layout);
        })
        .catch((error: any) => {
          console.log(error);
          setIsOpen(true);
        })
        .finally(() => setIsLoading(false))
    }
    
    // Clusterização Fast Greedy
    else if (clustering == 2) {
      let nodes: any[] = []
      let edges: any[] = [];
      let n_clusters: number = 10;

      // Obtem todos os nós  
      graph.forEachNode(node_label => {
        nodes.push({
          "id": graph.getNodeAttribute(node_label, "id"),
          "x": graph.getNodeAttribute(node_label, "x"),
          "y": graph.getNodeAttribute(node_label, "y"),
          "label": node_label
        })
      });

      // Obtem todas as arestas
      graph.forEachEdge((edge) => {
        edges.push({
          "source": graph.getEdgeAttribute(edge, "source"),
          "target": graph.getEdgeAttribute(edge, "target")
        })
      });

      // Realiza a chamada API para obter os clusters por KMeans
      setIsLoading(true);
      getClustersByFastyGreedy(nodes, edges, n_clusters)
        .then((data: any) => {
          // Aplica os clusters  
          data.nodes.forEach((node: any) => {
            graph.setNodeAttribute(node.label, "cluster", node.cluster);
            graph.setNodeAttribute(node.label, "color", colors_clusters[node.cluster]);
          });

          // Aplica animação do layout 
          applyLayout(layout);
        })
        .catch((error: any) => {
          setIsOpen(true);
          console.log(error);
        })
        .finally(() => setIsLoading(false))
    }
  }, [constructLayoutAfterApply]);

  return <>{children}</>;
}
