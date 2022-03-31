import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Slider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useContext, useState } from "react";
import { LayoutConfigureContext } from "../context/LayoutConfigureContext";
import "../styles/ContainerOptionRight.css";

interface ContainerOptionsRightProps {
  containerRightClose: () => void;
}

export default function ContainerOptionsRight({
  ...props
}: ContainerOptionsRightProps) {
  const [showLevel, setShowLevel] = useState<boolean>(false);
  const [showVectors, setShowVectors] = useState<boolean>(false);
  const {
    cosine,
    maximumConnectedNeighbors,
    minimumDegree,
    applyConfigure,
    setCosine,
    setMaximumConnectedNeighbors,
    setMinimumDegree,
    setLayout,
    setApplyConfigure,
    setAlgoritmo,
    setTypeReduce,
    setLevelNeighbors,
    setEmbbeddings,
    setIsClustering
  } = useContext(LayoutConfigureContext);

  function setSelectedAlgoritm() {
    let algoritm: number = (document.getElementById("selectAlgoritm") as any)
      .selectedIndex;
    setAlgoritmo(algoritm);
    setShowLevel(algoritm == 2 ? true : false);
    setShowVectors(algoritm == 1 ? true : false);
  }

  return (
    <section className="menuRight">
      <div className="containerBtnClose">
        <IconButton color="error" className="closeBtnRight">
          <CloseIcon onClick={props.containerRightClose} />
        </IconButton>
      </div>
      <div className="containerLayoutConfigure">
        <FormControl className="layoutConfigureForm">
          <FormLabel id="">Algoritmo</FormLabel>
          <select
            name="selectAlgoritm"
            id="selectAlgoritm"
            className="selectFilterAlgoritm"
            onChange={setSelectedAlgoritm}
          >
            <option value="tfidf">TF-IDF</option>
            <option value="Americas">Doc2Vec</option>
            <option value="Asia">Centralidade</option>
            <option value="Asia">CCP</option>
          </select>
        </FormControl>

        <FormControl className="layoutConfigureForm">
          <FormLabel id="">Resize</FormLabel>
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
        </FormControl>

        {showLevel && (
          <FormControl className="layoutConfigureForm">
            <FormLabel id="">Level</FormLabel>
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
          </FormControl>
        )}

        {showVectors && (
          <FormControl className="layoutConfigureForm">
            <FormLabel id="">Embeddings</FormLabel>
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
          </FormControl>
        )}

        <FormControl className="layoutConfigureForm">
          <FormLabel id="">
            Cosine Distance <br />
            <span>{cosine}</span>
          </FormLabel>
          <Slider
            size="small"
            defaultValue={0}
            min={0}
            max={1}
            step={0.02}
            aria-label="Small"
            valueLabelDisplay="auto"
            onChange={(event: any) => setCosine(event.target.value)}
          />
        </FormControl>

        <FormControl className="layoutConfigureForm">
          <FormLabel id="">
            Maximum connected neighbors <br />
            <span>{maximumConnectedNeighbors}</span>
          </FormLabel>
          <Slider
            size="small"
            defaultValue={0}
            min={0}
            max={5}
            step={1}
            aria-label="Small"
            valueLabelDisplay="auto"
            onChange={(event: any) => setMaximumConnectedNeighbors(event.target.value)}
          />
        </FormControl>

        <FormControl className="layoutConfigureForm">
          <FormLabel id="">
            Minimum Degree <br />
            <span>{minimumDegree}</span>
          </FormLabel>
          <Slider
            size="small"
            defaultValue={0}
            min={0}
            max={5}
            step={1}
            aria-label="Small"
            valueLabelDisplay="auto"
            onChange={(event: any) => setMinimumDegree(event.target.value)}
          />
        </FormControl>

        <FormControl className="layoutConfigureForm">
          <FormLabel id="">Layout</FormLabel>
          <RadioGroup
            row
            name="radioButtonsGroupResize"
            id="layoutSelected"
            defaultValue="force"
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
          </RadioGroup>
        </FormControl>

        <FormControl className="layoutConfigureForm">
          <FormLabel id="">Agrupar</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox onClick={(event: any) => setIsClustering(event.target.checked)} />
              }
              label="KMeans" />
          </FormGroup>
        </FormControl>

        <button
          type="button"
          className="applyLayoutBtn"
          onClick={() => setApplyConfigure(!applyConfigure)}
        >
          Apply Layout
        </button>
      </div>
    </section>
  );
}
