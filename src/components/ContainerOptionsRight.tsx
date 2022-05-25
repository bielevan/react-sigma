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
          <Divider component="li" />
          <li>
            <Typography
              sx={{ mt: 0.5, ml: 2 }}
              color="text.secondary"
              display="block"
              variant="caption"
            >
              Teste
            </Typography>
          </li>
          <ListItem>
            <Box>
              {/* Define o algoritmo que será utilizado na modelagem */}
              <FormControl className="layoutConfigureForm">
                <LightTooltip
                  title={`
              Defina o modelo ML para os estudos. A plataforma oferece três modelos: 
              TF-IDF é um modelo estatístico que expressa a importância de uma palavra 
              em um contexto de documentos; Doc2Vec é um modelo de representação númerica
              construído com Deep Learning que sintetiza as relações entre palavras com 
              base em vetores; por último Network constroi um documento com Redes Complexas,
              relacionando as palavras entre si e extraindo medidas significativas da rede
              resultante. Cada modelo possui resultados próprios.
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
                      <MenuItem value={'cpp'}>CPP</MenuItem>
                    </Select>
                  </FormControl>
                </LightTooltip>
              </FormControl>

              {/* Define a técnica de diminuição da dimensionalidade */}
              <FormControl className="layoutConfigureForm">
                <FormLabel sx={{ fontSize: "0.9rem", fontWeight: 600 }}>Resize</FormLabel>
                <LightTooltip
                  title={`
              Cada modelo extra relações entre os textos e gera resultados em alta dimensão.
              A visualização 2D na plataforma é permitido com base na redução do resultado para
              2 dimensões. Essa tarefa é realizado pelos algoritmos PCA ou t-SNE. Cada
              algoritmo possui resultados próprios.
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
              Defina o cálculo de proximidade. A conexão entre os nós da rede será realizado
              com base na medida de distância definida, onde busca expressar certa relação entre
              as constituições (nós) da rede. Cada medida possui resultados diferentes.
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
                Defina o algoritmo de agrupamento. O algoritmo tentará simbolizar em clusters
                constituições semelhantes: KMeans define pontos centrais numa rede e os nós mais 
                próximos pertencerão ao mesmo cluster; Fast Greedy (habilitado apenas se definido 
                a distância) busca comunidades numa rede, com base nas conexões entre as constituições. 
                Os algoritmos gerá resultados diferentes.
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
          <Divider component="li" />
          <li>
            <Typography
              sx={{ mt: 0.5, ml: 2 }}
              color="text.secondary"
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
              A Similidade de Cosseno é a medida que determina o cosseno do ângulo entre 
              dois vetores no espaço e possui melhor qualidade junto a modelos como Doc2Vec 
              e Network.
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
            A distância Euclidiana representa a distância mais curta entre dois pontos 
            e possui melhor qualidade junto a modelos como o TF-IDF
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
            Define o máximo de conexões que uma constituição (nó) da rede pode ter
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
                    max={8}
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
              Define o layout da rede resultante: Force Layout tentará apróximar as constituições 
              (nós) que estão conectadas e afastar os que não estão, desta forma perdisse as posições
              iniciais de cada nó; N-Overlap constrói o layout dentro de uma matriz, de tal forma
              que os nós não se soprepõem, perdendo a posição inicial; 2D mantém as 
              posições de cada nó 
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
