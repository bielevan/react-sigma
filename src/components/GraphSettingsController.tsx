import { useEffect } from "react";
import { useSigma } from "react-sigma-v2";
import drawHover from "sigma/rendering/canvas/hover";
import useDebounce from "../service/use-debounce";
import React from "react";

interface GraphSettingControllerProps {
  children?: unknown;
  hoveredNode: string | null;
}

const NODE_FADE_COLOR = "#bbb";
const EDGE_FADE_COLOR = "#eee";
const NODE_HIGH_COLOR = "#2ecc71";

export default function GraphSettingController({
  children,
  hoveredNode,
}: GraphSettingControllerProps) {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const debouncedHoveredNode = useDebounce(hoveredNode, 40);

  useEffect(() => {
    sigma.setSetting("hoverRenderer", (context, data, settings) =>
      drawHover(context, { ...sigma.getNodeDisplayData(data.key), ...data }, settings),
    );
  }, [sigma, graph]);

  useEffect(() => {
    const hoveredColor: string = debouncedHoveredNode
      ? sigma.getNodeDisplayData(debouncedHoveredNode)!.color
      : "";

    sigma.setSetting(
      "nodeReducer",
      debouncedHoveredNode
        ? (node, data) =>
            node === debouncedHoveredNode ||
            graph.hasEdge(node, debouncedHoveredNode) ||
            graph.hasEdge(debouncedHoveredNode, node)
              ? { ...data, zIndex: 1, color: NODE_HIGH_COLOR }
              : {
                  ...data,
                  zIndex: 0,
                  label: "",
                  color: NODE_FADE_COLOR,
                  highlighted: false,
                }
        : null
    );

    sigma.setSetting(
      "edgeReducer",
      debouncedHoveredNode
        ? (edge, data) =>
            graph.hasExtremity(edge, debouncedHoveredNode)
              ? { ...data, color: hoveredColor, size: 1 }
              : { ...data, color: EDGE_FADE_COLOR, hidden: true }
        : null
    );
  }, [debouncedHoveredNode]);

  return <>{children}</>;
}
