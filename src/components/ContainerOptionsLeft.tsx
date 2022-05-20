import { Chip, FormControl, FormControlLabel, Radio, RadioGroup, FormLabel, IconButton, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Slider, Theme, useTheme, Button, styled, Tooltip, TooltipProps, tooltipClasses } from "@mui/material";
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

const longText = `
Aliquam eget finibus ante, non facilisis lectus. Sed vitae dignissim est, vel aliquam tellus.
Praesent non nunc mollis, fermentum neque at, semper arcu.
Nullam eget est sed sem iaculis gravida eget vitae justo.
`;

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
  const {
    constitutionWordsLength,
    setFilter,
    setConstitutionWordsLength,
    setIsLoading,
    setCPPFilter,
    minimumDegree,
    setMinimumDegree
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
        {/* Seleciona continentes */}
        <FormControl className="formControlLeft">
          <LightTooltip
            title={longText}
            placement="right"
            enterDelay={2000}>
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
          title={longText}
          placement="right"
          enterDelay={2000}>
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
          title={longText}
          placement="right"
          enterDelay={2000}>
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
          title={longText}
          placement="right"
          enterDelay={2000}>
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
          title={longText}
          placement="left"
          enterDelay={2000}>
          <FormControl className="layoutConfigureForm">
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
          <FormLabel sx={{ fontSize: "0.9rem", fontWeight: 600 }}>Clusters</FormLabel>
          <RadioGroup
            row
            name="radioButtonsGroupResize"
            className="radioButtonsGroup"
            id="layoutSelected"
            defaultValue={0}
          >
            <LightTooltip
              title={longText}
              placement="right"
              enterDelay={2000}>
              <FormControlLabel
                label="Executive Power"
                control={<Radio />}
                value="1"
                key="executive_power"
                onClick={(event: any) => { setCPPFilter(Number(event.target.value)) }}
              />
            </LightTooltip>
            <LightTooltip
              title={longText}
              placement="right"
              enterDelay={2000}>
              <FormControlLabel
                label="Legislative Power"
                control={<Radio />}
                value="2"
                key="legislative_power"
                onClick={(event: any) => { setCPPFilter(Number(event.target.value)) }}
              />
            </LightTooltip>
            <LightTooltip
              title={longText}
              placement="right"
              enterDelay={2000}>
              <FormControlLabel
                label="Judicial Independence"
                control={<Radio />}
                value="3"
                key="judicial_independence"
                onClick={(event: any) => { setCPPFilter(Number(event.target.value)) }}
              />
            </LightTooltip>
            <LightTooltip
              title={longText}
              placement="right"
              enterDelay={2000}>
              <FormControlLabel
                label="Number of Rights"
                control={<Radio />}
                value="4"
                key="number_rights"
                onClick={(event: any) => { setCPPFilter(Number(event.target.value)) }}
              />
            </LightTooltip>
            <LightTooltip
              title={longText}
              placement="right"
              enterDelay={2000}>
              <FormControlLabel
                label="Normal"
                control={<Radio />}
                value="0"
                key="normal"
                onClick={(event: any) => { setCPPFilter(Number(event.target.value)) }}
              />
            </LightTooltip>
          </RadioGroup>
        </FormControl>
      </div>
    </section >
  );
}
