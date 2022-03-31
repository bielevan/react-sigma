import { IconButton } from "@mui/material";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import React, { useState } from "react";
import { SigmaContainer } from "react-sigma-v2";
import styleElement from "./service/HtmlElementModifyProperties";
import ContainerOptionsRight from "./components/ContainerOptionsRight";
import ContainerOptionsLeft from "./components/ContainerOptionsLeft";
import GraphDataController from "./components/GraphDataController";
import GraphEventsController from "./components/GraphEventsController";
import GraphSettingController from "./components/GraphSettingsController";
import drawLabel from "./service/canvas-utils";
import "./styles/App.css";
import "react-sigma-v2/lib/react-sigma-v2.css";

export default function App() {

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);  // Controla node mouse_enter
  const [mouseEvent, setMouseEvent] = useState<boolean>(true);          // Controla se habilita ou não eventos do mouse  

  function openContainerFilterLeft() {
    styleElement("panelRight", "width", "0");
    styleElement("panelLeft", "width", "25%");
  }

  function openContainerFilterRight() {
    styleElement("panelLeft", "width", "0");
    styleElement("panelRight", "width", "25%");
  }

  function setMouseEventBtn() {
    let elem = document.getElementById("btnMouseEvent") as HTMLElement;
    if (mouseEvent) {
      elem.classList.remove("mouseBtnEventTrue");
      elem.classList.add("mouseBtnColorFalse");
      setMouseEvent(false);

    } else {
      elem.classList.remove("mouseBtnColorFalse");
      elem.classList.add("mouseBtnEventTrue");
      setMouseEvent(true);
    }
  }

  return (
    <section className="graphContainer">
      <section className="react-sigma">
        <SigmaContainer
          className="containerGraph"
          initialSettings={{
            labelRenderer: drawLabel,
            labelDensity: 0.07,
            labelGridCellSize: 60,
            labelRenderedSizeThreshold: 15,
            labelFont: "Roboto, sans-serif",
            zIndex: true,
          }}
        >
          <GraphDataController />
          <GraphEventsController
            setHoveredNode={setHoveredNode}
            mouseEvent={mouseEvent}
          />
          <GraphSettingController hoveredNode={hoveredNode} />
        </SigmaContainer>
      </section>

      <div className="graphOptionsFilterShow">
        <IconButton
          aria-label="layout"
          className="buttonOption"
          onClick={openContainerFilterLeft}
        >
          <ArrowForwardIosOutlinedIcon />
        </IconButton>
      </div>

      <div className="graphOptionsLayoutShow">
        <IconButton
          aria-label="layout"
          className="buttonOption"
          onClick={openContainerFilterRight}
        >
          <ArrowBackIosOutlinedIcon />
        </IconButton>
      </div>

      <menu className="graphOptionsLayoutLeft" id="panelLeft">
        <ContainerOptionsLeft
          containerLeftClose={() => styleElement("panelLeft", "width", "0")} />
      </menu>
      <menu className="graphOptionsLayoutRight" id="panelRight">
        <ContainerOptionsRight
          containerRightClose={() => styleElement("panelRight", "width", "0")}
        />
      </menu>

      <footer>
        <button
          id="btnMouseEvent"
          type="button"
          className="mouseBtnEvent mouseBtnColorTrue"
          onClick={setMouseEventBtn}>
          <img src="images/mouse.png" alt="Icon mouse" />
        </button>
      </footer>
    </section>
  );
}
