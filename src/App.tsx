import { IconButton, Slide, Button, Dialog, DialogActions, Snackbar, Stack, DialogContent, DialogContentText, DialogTitle, PaperProps, Paper, Fab, Box } from "@mui/material"
import { TransitionProps } from "@mui/material/transitions";
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import ArrowBackIosOutlinedIcon from "@mui/icons-material//ArrowBackIosOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import MouseIcon from "@mui/icons-material/Mouse";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import React, { useContext, useState } from "react";

import { SigmaContainer } from "react-sigma-v2";
import Loading from "./components/Loading";
import styleElement from "./service/HtmlElementModifyProperties";

import { LayoutConfigureContext } from "./context/LayoutConfigureContext";
import ContainerOptionsRight from "./components/ContainerOptionsRight";
import ContainerOptionsLeft from "./components/ContainerOptionsLeft";
import GraphDataController from "./components/GraphDataController";
import GraphEventsController from "./components/GraphEventsController";
import GraphSettingController from "./components/GraphSettingsController";

import drawLabel from "./service/canvas-utils";
import ShowClusters from "./components/ShowClusters";
import "./styles/App.css";
import "react-sigma-v2/lib/react-sigma-v2.css";
import ShowFilter from "./components/ShowFilter";

// Alert error
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Efeito transition Dialog
const Transition = React.forwardRef(function Transaction(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
});

export default function App() {

  const [open, setIsOpen] = useState<boolean>(false);                         // Abre menu de erro
  const [openPopupProject, setOpenPopupProject] = useState<boolean>(false);   // Abre popup para apresentação do projeto
  const [openClusterPopup, setOpenClusterPopup] = useState<boolean>(false);   // Abre menu para demonstrar informações sobre cluter
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);        // Controla node mouse_enter
  const [mouseEvent, setMouseEvent] = useState<boolean>(true);                // Controla se habilita ou não eventos do mouse  
  const [clusterSelected, setClusterSelected] = useState<number>(-1);         // Cluster selecionado pelo usuário
  const [containerFilterControl, setContainerFilterControl] = useState<boolean>(false);
  const { isLoading } = useContext(LayoutConfigureContext);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setIsOpen(false);
  };

  // Controle abertura painel esquerdo  
  function openContainerFilterLeft() {
    styleElement("panelFooter", "height", "0rem");
    styleElement("panelRight", "width", "0");
    styleElement("panelLeft", "width", "25%");
  }

  // Controla abertura painel direito
  function openContainerFilterRight() {
    styleElement("panelFooter", "height", "0rem");
    styleElement("panelLeft", "width", "0");
    styleElement("panelRight", "width", "25%");
  }

  // Controla abertura painel filter
  function openContainerFilterFooter() {
    setContainerFilterControl(!containerFilterControl);
    if (containerFilterControl) {
      styleElement("panelFooter", "height", "10rem");
      styleElement("panelLeft", "width", "0");
      styleElement("panelRight", "width", "0");
    } else {
      styleElement("panelFooter", "height", "0rem");
      styleElement("panelLeft", "width", "0");
      styleElement("panelRight", "width", "0");
    }
  }

  return (
    <section className="graphContainer">

      {/* Dialog de apresentação do projeto */}
      <Dialog
        open={openPopupProject}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpenPopupProject(false)}
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle>{"Conweb - Platform for visualization and analysis of constitutions"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Constitutions are a very important milestone in the history of any country, where each one
            represents a set of rules, laws and norms valid in those territories, organizing all the possible
            actions of the State. The identification of patterns among these texts is a opportunity for a better
            understanding of the similarities and differences that may exist among the countries. The work
            uses Text Mining techniques to group these documents using Machine Learning models widely
            used in the literature: TF-IDF, Doc2Vec and Complex Networks. All the results and analyzes
            made possible by each model can be explored through the developed web platform, allowing the
            user to interact with the networks of constitutions built and apply different filters.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPopupProject(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para erro de acesso ao backend */}
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '80%' }}>
            Erro ao acessar backend, não possível obter os resultados esperados
          </Alert>
        </Snackbar>
      </Stack>

      {/* Tela de Loading */}
      {isLoading && <Loading />}

      {/* Container do grafo */}
      <section className="react-sigma">
        <SigmaContainer
          className="containerGraph"
          initialSettings={{
            labelRenderer: drawLabel,
            labelDensity: 0.07,
            labelGridCellSize: 60,
            labelRenderedSizeThreshold: 15,
            labelFont: "Roboto, sans-serif",
            defaultNodeColor: '#95a5a6',
            zIndex: true
          }}
        >
          <GraphDataController />
          <GraphEventsController
            setHoveredNode={setHoveredNode}
            mouseEvent={mouseEvent}
            setIsOpen={setIsOpen}
            setClusterSelected={setClusterSelected}
            setOpenClusterPopup={setOpenClusterPopup}
          />
          <GraphSettingController hoveredNode={hoveredNode} />

          <Dialog
            fullScreen
            open={openClusterPopup}
            onClose={() => setOpenClusterPopup(false)}
            TransitionComponent={Transition}
          >
            <ShowClusters
              clusterSelected={clusterSelected}
              setOpenClusterPopup={setOpenClusterPopup} />
          </Dialog>
        </SigmaContainer>
      </section>

      {/* Botão para abrir menu a esquerda */}
      <div className="graphOptionsFilterShow">
        <IconButton
          aria-label="layout"
          className="buttonOption"
          onClick={openContainerFilterLeft}
        >
          <ArrowForwardIosOutlinedIcon />
        </IconButton>
      </div>

      {/* Botão para abrir menu a direita */}
      <div className="graphOptionsLayoutShow">
        <IconButton
          aria-label="layout"
          className="buttonOption"
          onClick={openContainerFilterRight}
        >
          <ArrowBackIosOutlinedIcon />
        </IconButton>
      </div>

      {/* Container Esquerdo */}
      <menu className="graphOptionsLayoutLeft" id="panelLeft">
        <ContainerOptionsLeft
          containerLeftClose={() => styleElement("panelLeft", "width", "0")}
          setIsOpen={setIsOpen} />
      </menu>

      {/* Container Direito */}
      <menu className="graphOptionsLayoutRight" id="panelRight">
        <ContainerOptionsRight
          containerRightClose={() => styleElement("panelRight", "width", "0")}
        />
      </menu>

      {/* Ativa ou desativa eventos do mouse */}
      <footer>
        <Fab
          color="primary"
          aria-label="add"
          size="small"
          onClick={openContainerFilterFooter}>
          <FilterAltOutlinedIcon />
        </Fab>

        <Fab
          color="secondary"
          aria-label="mouse"
          size="small"
          onClick={() => setMouseEvent(!mouseEvent)}>
          <MouseIcon />
        </Fab>

        <Fab
          color="warning"
          aria-label="mouse"
          size="small"
          onClick={() => setOpenPopupProject(true)}>
          <InfoOutlinedIcon />
        </Fab>
      </footer>

      <div className="graphOptionsFilterFooter" id="panelFooter">
        <div>
          <ShowFilter setIsOpen={setIsOpen} />
        </div>
      </div>
    </section>
  );
}
