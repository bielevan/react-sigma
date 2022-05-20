import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Slider,
  styled,
  Tooltip,
  TooltipProps,
  tooltipClasses,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useContext, useState } from "react";
import { LayoutConfigureContext } from "../context/LayoutConfigureContext";
import "../styles/ContainerOptionRight.css";

interface ContainerOptionsRightProps {
  containerRightClose: () => void;
}

// Layout Tooltip
const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    maxWidth: 300,
    fontWeight: 400
  },
}));

const longText: string = `
Aliquam eget finibus ante, non facilisis lectus. Sed vitae dignissim est, vel aliquam tellus.
Praesent non nunc mollis, fermentum neque at, semper arcu.
Nullam eget est sed sem iaculis gravida eget vitae justo.
`;

export default function ContainerOptionsRight({
  ...props
}: ContainerOptionsRightProps) {

  const [showLevel, setShowLevel] = useState<boolean>(false);
  const [showVectors, setShowVectors] = useState<boolean>(false);
  const [showDistance, setShowDistance] = useState<number>(0);

  const {
    algoritmo,
    distance,
    maximumConnectedNeighbors,
    applyConfigure,
    setDistance,
    setMaximumConnectedNeighbors,
    setLayout,
    setApplyConfigure,
    setAlgoritmo,
    setTypeReduce,
    setLevelNeighbors,
    setEmbbeddings,
    setClustering,
    setWhoDistance
  } = useContext(LayoutConfigureContext);

  function setSelectedAlgoritm(algoritmoSelect: string) {
    setAlgoritmo(algoritmoSelect);
    setShowLevel(algoritmoSelect   == 'network' ? true : false);
    setShowVectors(algoritmoSelect == 'doc2vec' ? true : false);
  }

  // Reseta todas as propriedades do grafo  
  function resetGraph() {
    setDistance(0);                         // Limpar distancia cosseno
    setMaximumConnectedNeighbors(0);        // Limpa maximo de conexões
    setLayout("");                          // Limpa Layout
    setClustering(0);                       // Limpa Cluster              
    setApplyConfigure(!applyConfigure);     // Constroi grafo
  }

  return (
    <section className="menuRight">
      <div className="containerBtnClose">
        <IconButton color="error" className="closeBtnRight">
          <CloseIcon onClick={props.containerRightClose} />
        </IconButton>
      </div>
      <div className="containerLayoutConfigure">

        {/* Define o algoritmo que será utilizado na modelagem */}
        <FormControl className="layoutConfigureForm">
          <LightTooltip
            title={longText}
            placement="left"
            enterDelay={2000}>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="select-small">Algoritmo</InputLabel>
              <Select
                labelId="select-small"
                id="select-small"
                label="Algoritmo"
                value={algoritmo}
                onChange={(event: SelectChangeEvent) => setSelectedAlgoritm(event.target.value)}
              >
                <MenuItem value={'tfidf'}>TF-IDF</MenuItem>
                <MenuItem value={'doc2vec'}>Doc2Vec</MenuItem>
                <MenuItem value={'network'}>Network</MenuItem>
                <MenuItem value={'cpp'}>CPP</MenuItem>
              </Select>
            </FormControl>
          </LightTooltip>
        </FormControl>

        {/* Define a técnica de diminuição da dimensionalidade */}
        <FormControl className="layoutConfigureForm">
          <FormLabel sx={{ fontSize: "0.9rem", fontWeight: 600 }}>Resize</FormLabel>
          <LightTooltip
            title={longText}
            placement="left"
            enterDelay={2000}>
            <RadioGroup
              row
              name="radioButtonsGroupResize"
              className="radioBtnsLayout"
              defaultValue="TSNE"
              onChange={(event: any) => setTypeReduce(event.target.value)}
            >
              <FormControlLabel label="PCA" control={<Radio />} value="PCA" />
              <FormControlLabel label="TSNE" control={<Radio />} value="TSNE" />
            </RadioGroup>
          </LightTooltip>
        </FormControl>


        {showLevel && (
          // Define o level da conexão entre vizinhos no grafo para Network
          <FormControl className="layoutConfigureForm">
            <FormLabel sx={{ fontSize: "0.9rem", fontWeight: 600 }}>Level</FormLabel>
            <LightTooltip
              title={longText}
              placement="left"
              enterDelay={2000}>
              <RadioGroup
                row
                name="radioButtonsGroupResize"
                className="radioBtnsLayout"
                onChange={(event: any) => setLevelNeighbors(Number(event.target.value))}
              >
                <FormControlLabel label="1" control={<Radio />} value="1" />
                <FormControlLabel label="2" control={<Radio />} value="2" />
                <FormControlLabel label="3" control={<Radio />} value="3" />
              </RadioGroup>
            </LightTooltip>
          </FormControl>
        )}

        {showVectors && (
          // Define o tamanho do vetor de embeddings
          <FormControl className="layoutConfigureForm">
            <FormLabel sx={{ fontSize: "0.9rem", fontWeight: 600 }}>Embeddings</FormLabel>
            <LightTooltip
              title={longText}
              placement="left"
              enterDelay={2000}>
              <RadioGroup
                row
                name="radioButtonsGroupResize"
                className="radioBtnsLayout"
                onChange={(event: any) => setEmbbeddings(Number(event.target.value))}
              >
                <FormControlLabel label="100" control={<Radio />} value="100" />
                <FormControlLabel label="200" control={<Radio />} value="200" />
                <FormControlLabel label="300" control={<Radio />} value="300" />
              </RadioGroup>
            </LightTooltip>
          </FormControl>
        )}

        {/* Valida a distancia que será utilizada */}
        <FormControl className="layoutConfigureForm">
          <FormLabel sx={{ fontSize: "0.9rem", fontWeight: 600 }}>Distance</FormLabel>
          <LightTooltip
            title={longText}
            placement="left"
            enterDelay={2000}>
            <RadioGroup
              row
              name="radioButtonsGroupResize"
              className="radioBtnsLayout"
              defaultValue="cosine"
              onChange={(event: any) => setTypeReduce(event.target.value)}
            >
              <FormControlLabel
                label="Cosine"
                control={<Radio />}
                value="cosine"
                onClick={() => {
                  setShowDistance(0); 
                  setWhoDistance(0);
                }} />
              <FormControlLabel
                label="Euclidian"
                control={<Radio />}
                value="euclidian"
                onClick={() => {
                  setShowDistance(1);
                  setWhoDistance(1);
                }} />
            </RadioGroup>
          </LightTooltip>
        </FormControl>

        {/* Configura a distancia de cosseno/euclidiana que será usada */}
        {showDistance == 0 ? (
          <LightTooltip
            title={longText}
            placement="left"
            enterDelay={2000}>
            <FormControl className="layoutConfigureForm">
              <FormLabel sx={{ fontSize: "0.9rem", fontWeight: 600 }}>
                Cosine Distance <br />
                <span>{distance}</span>
              </FormLabel>
              <Slider
                size="small"
                defaultValue={0}
                min={0}
                max={1}
                step={0.02}
                aria-label="Small"
                valueLabelDisplay="auto"
                onChange={(event: any) => setDistance(event.target.value)}
              />
            </FormControl>
          </LightTooltip>
        ) : (
          <LightTooltip
            title={longText}
            placement="left"
            enterDelay={2000}>
            <FormControl className="layoutConfigureForm">
              <FormLabel sx={{ fontSize: "0.9rem", fontWeight: 600 }}>
                Euclidian Distance <br />
                <span>{distance}</span>
              </FormLabel>
              <Slider
                size="small"
                defaultValue={0}
                min={0}
                max={5}
                step={0.1}
                aria-label="Small"
                valueLabelDisplay="auto"
                onChange={(event: any) => setDistance(event.target.value)}
              />
            </FormControl>
          </LightTooltip>
        )}

        {/* Define a quantidade máxima de vizinhos  */}
        <LightTooltip
          title={longText}
          placement="left"
          enterDelay={2000}>
          <FormControl className="layoutConfigureForm">
            <FormLabel sx={{ fontSize: "0.9rem", fontWeight: 600 }}>
              Maximum connected neighbors <br />
              <span>{maximumConnectedNeighbors}</span>
            </FormLabel>
            <Slider
              size="small"
              defaultValue={0}
              min={0}
              max={7}
              step={1}
              aria-label="Small"
              valueLabelDisplay="auto"
              onChange={(event: any) => setMaximumConnectedNeighbors(event.target.value)}
            />
          </FormControl>
        </LightTooltip>


        {/* Define o layout */}
        <FormControl className="layoutConfigureForm">
          <FormLabel sx={{ fontSize: "0.9rem", fontWeight: 600 }}>Layout</FormLabel>
          <LightTooltip
            title={longText}
            placement="left"
            enterDelay={2000}>
            <RadioGroup
              row
              name="radioButtonsGroupResize"
              className="radioBtnsLayout"
              id="layoutSelected"
            >
              <FormControlLabel
                label="Force"
                control={<Radio />}
                value="force"
                key="force"
                onClick={(event: any) => setLayout(event.target.value)}
              />
              <FormControlLabel
                label="N-Overlap"
                control={<Radio />}
                value="n-overlap"
                key="n-overlap"
                onClick={(event: any) => setLayout(event.target.value)}
              />
              <FormControlLabel
                label="2D"
                control={<Radio />}
                value="2D"
                key="2D"
                onClick={(event: any) => setLayout(event.target.value)}
              />
            </RadioGroup>
          </LightTooltip>
        </FormControl>

        {/* Define o algoritmo de agrupamento */}
        <FormControl className="layoutConfigureForm">
          <FormLabel sx={{ fontSize: "0.9rem", fontWeight: 600 }}>Agrupar</FormLabel>
          <LightTooltip
            title={longText}
            placement="left"
            enterDelay={2000}>
            <RadioGroup
              row
              name="radioButtonsGroupResize"
              className="radioBtnsLayout"
              id="layoutSelected"
            >
              <FormControlLabel
                label="KMeans"
                control={<Radio />}
                value="1"
                key="kmeans"
                onClick={() => setClustering(1)}
              />
              <FormControlLabel
                label="FastGreedy"
                control={<Radio />}
                value="2"
                key="fastgreedy"
                onClick={() => setClustering(2)}
              />
            </RadioGroup>
          </LightTooltip>
        </FormControl>

        <div className="btnLayoutApply">
          <Button
            variant="contained"
            size="small"
            onClick={() => setApplyConfigure(!applyConfigure)}
          >
            Apply Layout
          </Button>

          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={resetGraph}
          >
            Reset
          </Button>
        </div>
      </div>
    </section >
  );
}
