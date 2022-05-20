import { features_constitutes } from "../context/ImportDataset";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, AppBar, IconButton, Button, Toolbar, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSigma } from "react-sigma-v2"
import React, { useState } from "react";

interface ShowClustersProps {
  clusterSelected: number;
  setOpenClusterPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ShowClusters({ clusterSelected, setOpenClusterPopup }: ShowClustersProps) {

  const sigma = useSigma();
  const graph = sigma.getGraph();

  function constructCSV() {
    // Preenche as informações do grafo
    let txt: string = "";

    // Preenche as informações de cada nó
    graph.forEachNode((node) => {
      // Se o node faz parte do cluster selecionado
      if (graph.getNodeAttribute(node, "cluster") == clusterSelected) {
        const id: number = graph.getNodeAttribute(node, "id");
        if (id < features_constitutes.features.length) {
          const label = graph.getNodeAttribute(node, 'label');
          const nodeFeatures = features_constitutes['features'][id];
          txt += `
            label: ${label} 
            id: ${id} 
            Executive Power: ${nodeFeatures['Executive Power']} 
            Judicial Independence: ${nodeFeatures['Judicial Independence']} 
            Legislative Power: ${nodeFeatures['Legislative Power']}
            Length: ${nodeFeatures['Length']}
            Number Rights: ${nodeFeatures['Number of Rights']}
            Scope: ${nodeFeatures['Scope']}
            \n
          `
        }
      }
    });

    // Download TXT
    const element = document.createElement("a");
    const file = new Blob([txt], {
      type: "text/plain"
    })
    element.href = URL.createObjectURL(file);
    element.download = "constitutes.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setOpenClusterPopup(false)
  }

  return (
    <>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setOpenClusterPopup(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Cluster Selected
          </Typography>
          <Button
            autoFocus
            color="inherit"
            onClick={() => constructCSV() }>
            Export
          </Button>
        </Toolbar>
      </AppBar>

      <TableContainer>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Constituição</TableCell>
              <TableCell align="right">Scope</TableCell>
              <TableCell align="right">Length</TableCell>
              <TableCell align="right">Executive Power</TableCell>
              <TableCell align="right">Legislative Power</TableCell>
              <TableCell align="right">Judicial Independence</TableCell>
              <TableCell align="right">Number of Rights</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              graph.nodes().map((node) => {
                // Se o node faz parte do cluster selecionado
                if (graph.getNodeAttribute(node, "cluster") == clusterSelected) {
                  const id: number = graph.getNodeAttribute(node, "id");
                  if (id < features_constitutes.features.length) {
                    const label = graph.getNodeAttribute(node, 'label');
                    const nodeFeatures = features_constitutes['features'][id];
                    return (
                      <TableRow
                        key={id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">{label}</TableCell>
                        <TableCell align="right">{nodeFeatures['Scope']}</TableCell>
                        <TableCell align="right">{nodeFeatures['Length']}</TableCell>
                        <TableCell align="right">{nodeFeatures['Executive Power']}</TableCell>
                        <TableCell align="right">{nodeFeatures['Legislative Power']}</TableCell>
                        <TableCell align="right">{nodeFeatures['Judicial Independence']}</TableCell>
                        <TableCell align="right">{nodeFeatures['Number of Rights']}</TableCell>
                      </TableRow>
                    )
                  }
                }
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}