import {
  Chip, FormControl, FormControlLabel, Radio, RadioGroup,
  FormLabel, IconButton, InputLabel, MenuItem, OutlinedInput,
  Select, SelectChangeEvent, Slider, Theme, useTheme, Button,
  styled, Tooltip, TooltipProps, tooltipClasses, TextField,
  List, Divider, Typography, ListItem
} from "@mui/material";
import React, { useContext, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/system";
import { getAllConstitutesByFilter, getAllConstitutesByPromulgation, getConstitutesByTopic } from "../service/Api";
import { LayoutConfigureContext } from "../context/LayoutConfigureContext";
import "../styles/ContainerOptionLeft.css";

const ITEM_HEIGHT = 30;
const ITEM_PADDING_TOP = 8;

// Props menu constitutes
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 * ITEM_PADDING_TOP,
    },
  },
};

// Lists of continents
const selectItems = ["Americas", "Europe", "Asia", "Africa"];

// Style menu
function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
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

// Props Container Options Left
interface ContainerOptionsLeftProps {
  containerLeftClose: () => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ContainerOptionsLeft({
  containerLeftClose,
  setIsOpen
}: ContainerOptionsLeftProps) {

  const dataActual: number = Number(Date().split(" ")[3]);

  const theme = useTheme();
  const [continents, setContinents] = useState<string[]>([]);
  const [minPromulgation, setMinPromulgation] = useState<number>(1200); // Controla a data de promulgação minima
  const [maxPromulgation, setMaxPromulgation] = useState<number>(dataActual); // Controla a data de promulgação máxima
  const [textFieldConstitute, setTextFieldConstitute] = useState<string>("");

  const {
    constitutionWordsLength,
    setFilter,
    setConstitutionWordsLength,
    setIsLoading,
    setCPPFilter,
    minimumDegree,
    setMinimumDegree,
    setFilterByName
  } = useContext(LayoutConfigureContext);

  // Seta os continentes que vão ser utilizados na pesquisa  
  function handleChange(event: SelectChangeEvent<typeof selectItems>) {
    const {
      target: { value },
    } = event;

    setContinents(typeof value === "string" ? value.split(",") : value);
  }

  // Aplicar filtro  
  function applyFilter() {
    // Realiza uma busca por range de promulgação
    if (continents.length == 0 || continents.length == selectItems.length) {
      setIsLoading(true);
      getAllConstitutesByPromulgation(minPromulgation, maxPromulgation)
        .then((data: any) => {
          // Adiciona todas as constituições aos nodes
          let nodes: string[] = data.map((elem: any) => {
            if (elem.word_length >= constitutionWordsLength)
              return elem.id;
          });
          setFilter({ nodes });
        })
        .catch((err: any) => {
          console.log(err);
          setIsOpen(true);
        })
        .finally(() => setIsLoading(false));
    } else {
      // Realiza uma busca pelos continentes e range de promulgação
      setIsLoading(true);
      getAllConstitutesByFilter(continents, minPromulgation, maxPromulgation)
        .then((data: any) => {
          // Adiciona todas as constituições aos nodes
          let nodes: string[] = data.map((elem: any) => {
            if (elem.word_length >= constitutionWordsLength)
              return elem.id;
          });
          setFilter({ nodes });
        })
        .catch((err: any) => {
          console.log(err);
          setIsOpen(true);
        })
        .finally(() => setIsLoading(false));
    }
  }

  return (
    <section className="menuLeft">
      {/* Botão de fechar */}
      <div className="containerBtnCloseLeft">
        <IconButton color="error" className="closeBtnLeft">
          <CloseIcon onClick={containerLeftClose} />
        </IconButton>
      </div>

      <div className="containerLayoutConfigureLeft">
        <List
          sx={{
            width: '100%',
            marginLeft: '10%'
          }}>
          <Divider component="li" sx={{ background: "#3498db" }} />
          <li>
            <Typography
              sx={{ mt: 0.5, ml: 2 }}
              color="#3498db"
              display="block"
              variant="caption"
            >
              Filter
            </Typography>
          </li>
          <ListItem>
            <Box>
              {/* Seleciona continentes */}
              <FormControl className="formControlLeft">
                <LightTooltip
                  title={`
                    Filters continents based on search settings below
                  `}
                  placement="right"
                  enterDelay={3000}>
                  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="multiple-chip-label">Continents</InputLabel>
                    <Select
                      labelId="multiple-chip-label"
                      id="multiple-chip-label"
                      multiple
                      value={continents}
                      onChange={handleChange}
                      input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.3 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {selectItems.map((continent) => (
                        <MenuItem
                          key={continent}
                          value={continent}
                          style={getStyles(continent, continents, theme)}
                        >
                          {continent}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </LightTooltip>
              </FormControl>

              {/* Seleciona a data de promulgação  minima */}
              <LightTooltip
                title={`
                  Minimum date of promulgation of the constitution
                `}
                placement="right"
                enterDelay={3000}>
                <FormControl className="formControlLeft">
                  <FormLabel sx={{ fontSize: "0.9rem", fontWeight: 600 }}>Promulgation Data</FormLabel>
                  <FormLabel sx={{ fontSize: "0.8rem" }}>
                    Minimum Date: {minPromulgation}
                  </FormLabel>
                  <Slider
                    size="small"
                    defaultValue={1200}
                    aria-label="Small"
                    valueLabelDisplay="auto"
                    min={1200}
                    max={dataActual}
                    step={10}
                    onChange={(event: any) => { setMinPromulgation(event.target.value) }}
                  />
                </FormControl>
              </LightTooltip>

              {/* Seleciona a data de promulgação máxima */}
              <LightTooltip
                title={`
                  Maximum date of promulgation of the constitution
                `}
                placement="right"
                enterDelay={3000}>
                <FormControl className="formControlLeft">
                  <FormLabel sx={{ fontSize: "0.8rem" }}>
                    Maximum Date: {maxPromulgation}
                  </FormLabel>
                  <Slider
                    size="small"
                    defaultValue={dataActual}
                    aria-label="Small"
                    valueLabelDisplay="auto"
                    min={1200}
                    max={dataActual}
                    step={10}
                    onChange={(event: any) => { setMaxPromulgation(event.target.value); }}
                  />
                </FormControl>
              </LightTooltip>

              {/* Seleciona o tamanho das constituições */}
              <LightTooltip
                title={`
                  Define a quantidade mínima de palavras que uma constituição deve ter
                `}
                placement="right"
                enterDelay={3000}>
                <FormControl className="formControlLeft">
                  <FormLabel sx={{ fontSize: "0.8rem" }}>
                    Constitution Size: {constitutionWordsLength}
                  </FormLabel>
                  <Slider
                    size="small"
                    defaultValue={0}
                    aria-label="Small"
                    valueLabelDisplay="auto"
                    min={0}
                    max={100000}
                    step={10}
                    onChange={(event: any) => setConstitutionWordsLength(Number(event.target.value))}
                  />
                </FormControl>
              </LightTooltip>

              {/* Seleciona o grau dos nós */}
              <LightTooltip
                title={`
                  Defines the degree (number of connections) that a constitution must 
                  have to appear on the network
                `}
                placement="left"
                enterDelay={3000}>
                <FormControl className="formControlLeft">
                  <FormLabel sx={{ fontSize: "0.8rem" }}>
                    Minimum Degree: {minimumDegree}
                  </FormLabel>
                  <Slider
                    size="small"
                    defaultValue={0}
                    min={0}
                    max={5}
                    step={1}
                    aria-label="Small"
                    valueLabelDisplay="auto"
                    onChange={(event: any) => {
                      setMinimumDegree(event.target.value);
                    }}
                  />
                </FormControl>
              </LightTooltip>
            </Box>
          </ListItem>
        </List>
      </div>

      <div className="applyOptionsBtn">
        <Button variant="contained" size="small" onClick={applyFilter}>
          Apply
        </Button>
        <Button
          variant="contained" size="small" color="error" onClick={() => setFilter({ nodes: [] })}>
          Remove
        </Button>
      </div>

      {/* Define clusters CPP */}
      <div className="containerLayoutConfigureLeft">
        <FormControl className="layoutConfigureForm">
          <FormLabel sx={{ fontSize: "0.9rem", fontWeight: 600, marginTop: "1rem" }}>Clusters</FormLabel>
          <RadioGroup
            row
            name="radioButtonsGroupResize"
            className="radioButtonsGroup"
            id="layoutSelected"
            defaultValue={0}
          >
            <LightTooltip
              title={`
              This is an additive index drawn from a working paper, Constitutional Constraints on Executive Lawmaking. 
              The index ranges from 0-7 and captures the presence or absence of seven important aspects of executive 
              lawmaking
              `}
              placement="right"
              enterDelay={3000}>
              <FormControlLabel
                label="Executive Power"
                control={<Radio />}
                value="1"
                key="executive_power"
                onClick={(event: any) => { setCPPFilter(Number(event.target.value)) }}
              />
            </LightTooltip>
            <LightTooltip
              title={`
              This captures the formal degree of power assigned to the legislature by the constitution.
              `}
              placement="right"
              enterDelay={3000}>
              <FormControlLabel
                label="Legislative Power"
                control={<Radio />}
                value="2"
                key="legislative_power"
                onClick={(event: any) => { setCPPFilter(Number(event.target.value)) }}
              />
            </LightTooltip>
            <LightTooltip
              title={`
              It is an additive index ranging from 0-6 that captures the constitutional presence or absence 
              of six features thought to enhance judicial independence. 
              `}
              placement="right"
              enterDelay={3000}>
              <FormControlLabel
                label="Judicial Independence"
                control={<Radio />}
                value="3"
                key="judicial_independence"
                onClick={(event: any) => { setCPPFilter(Number(event.target.value)) }}
              />
            </LightTooltip>
            <LightTooltip
              title={`
                Set of 1172 different rights found in national constitutions. The rights index indicates 
                the number of these rights found in any particular constitution.
              `}
              placement="right"
              enterDelay={3000}>
              <FormControlLabel
                label="Number of Rights"
                control={<Radio />}
                value="4"
                key="number_rights"
                onClick={(event: any) => { setCPPFilter(Number(event.target.value)) }}
              />
            </LightTooltip>
          </RadioGroup>
        </FormControl>
      </div>

      <div className="containerLayoutConfigureLeft">
        <FormControl
          className="layoutConfigureForm"
          sx={{ marginBottom: "1rem", width: "85%", marginLeft: "auto", marginRight: "auto" }}>
          <TextField
            id="constituteFilter"
            label="Constitute"
            variant="outlined"
            size="small"
            onChange={(event) => setTextFieldConstitute(event.target.value)}></TextField>
        </FormControl>

        <Button
          color="warning"
          variant="outlined"
          size="small"
          onClick={() => setFilterByName(textFieldConstitute.split(" ").join("_"))}>
          Search
        </Button>
      </div>
    </section >
  );
}
