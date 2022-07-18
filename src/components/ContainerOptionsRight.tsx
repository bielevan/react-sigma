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
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useContext, useState } from "react";
import { LayoutConfigureContext } from "../context/LayoutConfigureContext";
import "../styles/ContainerOptionRight.css";
import { Box } from "@mui/system";

interface ContainerOptionsRightProps {
  containerRightClose: () => void;
}

// Layout Tooltip
const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#2980b9",
    maxWidth: 300,
    fontWeight: 400
  },
}));

export default function ContainerOptionsRight({
  ...props
}: ContainerOptionsRightProps) {

  const [showDistance, setShowDistance] = useState<number>(0);
  const [disableFastgreedy, setDisableFastGreedy] = useState<boolean>(true);

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
    setClustering,
    setWhoDistance
  } = useContext(LayoutConfigureContext);

  // Reseta todas as propriedades do grafo  
  function resetGraph() {
    setDistance(0);                         // Limpar distancia cosseno
    setMaximumConnectedNeighbors(0);        // Limpa maximo de conexões
    setLayout("");                          // Limpa Layout
    setClustering(0);                       // Limpa Cluster              
    setApplyConfigure(!applyConfigure);     // Constroi grafo
  }

  // Seta a distancia
  function setDistanceNetwork(distance: number) {
    setDistance(distance);
    if (distance > 0)
      setDisableFastGreedy(false);
    else
      setDisableFastGreedy(true);
  }

  return (
    <section className="menuRight">
      <div className="containerBtnClose">
        <IconButton color="error" className="closeBtnRight">
          <CloseIcon onClick={props.containerRightClose} />
        </IconButton>
      </div>

      <div className="containerLayoutConfigure">
        <List
          sx={{
            width: '92%',
          }}>
          <Divider component="li" sx={{background: "#3498db"}} />
          <li>
            <Typography
              sx={{ mt: 0.5, ml: 2 }}
              color="#3498db"
              display="block"
              variant="caption"
            >
              Settings
            </Typography>
          </li>
          <ListItem>
            <Box>
              {/* Define o algoritmo que será utilizado na modelagem */}
              <FormControl className="layoutConfigureForm">
                <LightTooltip
                  title={`
                    Define the ML model for the studies. The platform offers three models: 
                    TF-IDF is a statistical model that expresses the importance of a word in a document 
                    context; Doc2Vec is a numerical representation model built with Deep Learning that 
                    synthesizes the relationships between words based on vectors; finally Network builds a document 
                    with Complex Networks, relating words to each other and extracting meaningful measurements from 
                    the resulting network. Each model has its own results.
                  `}
                  placement="left"
                  enterDelay={3000}>
                  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="select-small">Model</InputLabel>
                    <Select
                      labelId="select-small"
                      id="select-small"
                      label="Algoritmo"
                      value={algoritmo}
                      onChange={(event: SelectChangeEvent) => setAlgoritmo(event.target.value)}
                    >
                      <MenuItem value={'tfidf'}>TF-IDF</MenuItem>
                      <MenuItem value={'doc2vec'}>Doc2Vec</MenuItem>
                      <MenuItem value={'network'}>Network</MenuItem>
                    </Select>
                  </FormControl>
                </LightTooltip>
              </FormControl>

              {/* Define a técnica de diminuição da dimensionalidade */}
              <FormControl className="layoutConfigureForm">
                <FormLabel sx={{ fontSize: "0.9rem", fontWeight: 600 }}>Resize</FormLabel>
                <LightTooltip
                  title={`
                    Each model extracts relationships between texts and generates high-dimensional 
                    results. 2D visualization on the platform is allowed based on reducing the 
                    result to 2 dimensions. This task is performed by the PCA or t-SNE algorithms. 
                    Each algorithm has its own results.
                  `}
                  placement="left"
                  enterDelay={3000}>
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

              {/* Valida a distancia que será utilizada */}
              <FormControl className="layoutConfigureForm">
                <FormLabel sx={{ fontSize: "0.9rem", fontWeight: 600 }}>Distance</FormLabel>
                <LightTooltip
                  title={`
                    Define the similarity calculation. The connection between the network nodes will 
                    be performed based on the defined distance measure, where it seeks to express a 
                    certain relationship between the constitutions (nodes) of the network. Each 
                    measurement has different results.
                  `}
                  placement="left"
                  enterDelay={3000}>
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
                      label="Euclidean"
                      control={<Radio />}
                      value="euclidian"
                      onClick={() => {
                        setShowDistance(1);
                        setWhoDistance(1);
                      }} />
                  </RadioGroup>
                </LightTooltip>
              </FormControl>

              {/* Define o algoritmo de agrupamento */}
              <FormControl className="layoutConfigureForm">
                <FormLabel sx={{ fontSize: "0.9rem", fontWeight: 600 }}>Cluster</FormLabel>
                <LightTooltip
                  title={`
                    Define the clustering algorithm. The algorithm will try to allocate 
                    similar constitutions in clusters: KMeans defines central points in a 
                    network and the closest nodes will belong to the same group; Fast Greedy 
                    (enabled when distance > 0) searches for communities in a network, 
                    based on connections between constitutions. The algorithms will generate 
                    different results.
                  `}
                  placement="left"
                  enterDelay={3000}>
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
                      disabled={disableFastgreedy}
                      onClick={() => setClustering(2)}
                    />
                  </RadioGroup>
                </LightTooltip>
              </FormControl>
            </Box>
          </ListItem>
          <Divider component="li" sx={{background: "#3498db"}} />
          <li>
            <Typography
              sx={{ mt: 0.5, ml: 2 }}
              color="#3498db"
              display="block"
              variant="caption"
            >
              Graph
            </Typography>
          </li>
          <ListItem>
            <Box>
              {/* Configura a distancia de cosseno/euclidiana que será usada */}
              {showDistance == 0 ? (
                <LightTooltip
                  title={`
                    Cosine Similarity is the measure that determines the cosine of the 
                    angle between two vectors in space and generates good results with TF-IDF
                  `}
                  placement="left"
                  enterDelay={3000}>
                  <FormControl className="layoutConfigureForm">
                    <FormLabel sx={{ fontSize: "0.85rem" }}>
                      Cosine Distance: <span>{distance}</span>
                    </FormLabel>
                    <Slider
                      size="small"
                      defaultValue={0}
                      min={0}
                      max={1}
                      step={0.02}
                      aria-label="Small"
                      valueLabelDisplay="auto"
                      onChange={(event: any) => setDistanceNetwork(Number(event.target.value))}
                    />
                  </FormControl>
                </LightTooltip>
              ) : (
                <LightTooltip
                  title={`
                    The Euclidean distance represents the shortest distance between two points 
                    and has better quality with models such as the Doc2Vec and Network
                  `}
                  placement="left"
                  enterDelay={3000}>
                  <FormControl className="layoutConfigureForm">
                    <FormLabel sx={{ fontSize: "0.85rem" }}>
                      Euclidean Distance: <span>{distance}</span>
                    </FormLabel>
                    <Slider
                      size="small"
                      defaultValue={0}
                      min={0}
                      max={8}
                      step={0.1}
                      aria-label="Small"
                      valueLabelDisplay="auto"
                      onChange={(event: any) => setDistanceNetwork(Number(event.target.value))}
                    />
                  </FormControl>
                </LightTooltip>
              )}

              {/* Define a quantidade máxima de vizinhos  */}
              <LightTooltip
                title={`
                  Defines the maximum number of connections that a network constitution (node) 
                  can have
                `}
                placement="left"
                enterDelay={3000}>
                <FormControl className="layoutConfigureForm">
                  <FormLabel sx={{ fontSize: "0.85rem" }}>
                    Maximum connected neighbors: <span>{maximumConnectedNeighbors}</span>
                  </FormLabel>
                  <Slider
                    size="small"
                    defaultValue={0}
                    min={0}
                    max={10}
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
                  title={`
                    Defines the layout of the resulting network: Force Layout will try to 
                    approximate the constitutions (nodes) that are connected and move away 
                    those that are not, it loses the initial positions of each node; N-Overlap 
                    builds the layout inside an array in such a way that the nodes do not 
                    overlap, it loses the initial position; 2D maintains the positions of 
                    each node.
                  `}
                  placement="left"
                  enterDelay={3000}>
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
            </Box>
          </ListItem>
        </List>

      </div>
    </section >
  );
}
