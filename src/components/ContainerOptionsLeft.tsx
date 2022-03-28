import {
  Chip,
  FormControl,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Slider,
  Theme,
  useTheme,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import "../styles/ContainerOptionLeft.css";
import { Box } from "@mui/system";
import { getAllConstitutesByFilter, getAllConstitutesByPromulgation } from "../service/Api";
import { LayoutConfigureContext } from "../context/LayoutConfigureContext";

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
const selectItems = ["America", "Europe", "Asia", "Africa"];

// Style menu
function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

// Props Container Options Left
interface ContainerOptionsLeftProps {
  containerLeftClose: () => void;
}

export default function ContainerOptionsLeft({
  containerLeftClose,
}: ContainerOptionsLeftProps) {

  const dataActual: number = Number(Date().split(" ")[3]);

  const theme = useTheme();
  const [continents, setContinents] = useState<string[]>([]);
  const [minPromulgation, setMinPromulgation] = useState<number>(1200); // Controla a data de promulgação minima
  const [maxPromulgation, setMaxPromulgation] = useState<number>(dataActual); // Controla a data de promulgação máxima
  const {
    constitutionSize,
    setFilter,
    setConstitutionSize
  } = useContext(LayoutConfigureContext);

  function handleChange(event: SelectChangeEvent<typeof selectItems>) {
    const {
      target: { value },
    } = event;

    setContinents(typeof value === "string" ? value.split(",") : value);
  }

  function applyFilter() {
    if (continents.length == 0 || continents.length == selectItems.length) {
      getAllConstitutesByPromulgation(minPromulgation, maxPromulgation)
        .then((data: any) => {
          // Adiciona todas as constituições aos nodes
          let nodes: string[] = [];
          data.forEach((node: any) => nodes.push(node.title.replace("_", " ").split(" (")[0]));
          setFilter({ nodes });
        })
        .catch((err: any) => console.log(err));
    } else {
      getAllConstitutesByFilter(continents, minPromulgation, maxPromulgation)
        .then((data: any) => {
          // Adiciona todas as constituições aos nodes
          let nodes: string[] = [];
          data.forEach((node: any) => nodes.push(node.title.replace("_", " ").split(" (")[0]));
          setFilter({ nodes });
        })
        .catch((err: any) => console.log(err));
    }
  }

  function removeFilter() {
    setFilter({ nodes: [] });
  }

  return (
    <section className="menuLeft">
      <div className="containerBtnCloseLeft">
        <IconButton color="error" className="closeBtnLeft">
          <CloseIcon onClick={containerLeftClose} />
        </IconButton>
      </div>
      <div className="containerLayoutConfigureLeft">
        <FormControl className="formControlLeft">
          <InputLabel id="demo-multiple-chip-label">Continente</InputLabel>
          <Select
            labelId="demo-multiple-chip-label"
            id="filterContinents"
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

        <FormControl className="formControlLeft">
          <FormLabel>Promulgation Data</FormLabel>
          <p>
            Minimum Date: <span>{minPromulgation}</span>
          </p>
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

        <FormControl className="formControlLeft">
          <p>
            Maximum Date: <span>{maxPromulgation}</span>
          </p>
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
      </div>

      <div className="applyOptionsBtn">
        <button
          type="button"
          className="applyOptionFilterBtn"
          onClick={applyFilter}>
          Apply
        </button>
        <button
          type="button"
          className="clearOptionFilterBtn"
          onClick={removeFilter}>
          Remove
        </button>
      </div>

      <div className="containerLayoutConfigureLeft">
        <FormControl className="formControlLeft">
          <p>
            Constitution Size: <span>{constitutionSize}</span>
          </p>
          <Slider
            size="small"
            defaultValue={constitutionSize}
            aria-label="Small"
            valueLabelDisplay="auto"
            min={0}
            max={100000}
            step={10}
            onChange={(event: any) => { setConstitutionSize(event.target.value); }}
          />
        </FormControl>
      </div>

      <div className="applyOptionsBtn">
        <button
          type="button"
          className="applyOptionFilterBtn">
          Apply
        </button>
        <button
          type="button"
          className="clearOptionFilterBtn">
          Remove
        </button>
      </div>
    </section>
  );
}
