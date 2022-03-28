import { createContext, ReactNode, useEffect, useState } from "react";
import { Dataset, Filter } from "../type/types";
import TFIDF from "../data/tfidf/tsne/graph.json";
import React from "react";

interface LayoutConfigureContextProps {
    algoritmo: number;
    typeReduce: string;
    levelNeighbors: number;
    embeddings: number;
    datasetAnimate: Dataset;
    applyConfigure: boolean;
    cosine: number;
    maximumConnectedNeighbors: number;
    minimumDegree: number;
    layout: string;
    constructLayoutAfterApply: boolean;
    filter: Filter;
    constitutionSize: number;
    setAlgoritmo: React.Dispatch<React.SetStateAction<number>>;
    setTypeReduce: React.Dispatch<React.SetStateAction<string>>;
    setLevelNeighbors: React.Dispatch<React.SetStateAction<number>>;
    setEmbbeddings: React.Dispatch<React.SetStateAction<number>>;
    setApplyConfigure: React.Dispatch<React.SetStateAction<boolean>>;
    setCosine: React.Dispatch<React.SetStateAction<number>>;
    setMaximumConnectedNeighbors: React.Dispatch<React.SetStateAction<number>>;
    setMinimumDegree: React.Dispatch<React.SetStateAction<number>>;
    setLayout: React.Dispatch<React.SetStateAction<string>>;
    setFilter: React.Dispatch<React.SetStateAction<Filter>>;
    setConstitutionSize: React.Dispatch<React.SetStateAction<number>>;
}

interface LayoutConfigureProviderProps {
    children: ReactNode;
}

export const LayoutConfigureContext = createContext({} as LayoutConfigureContextProps);

export default function LayoutConfigureProvider({ children }: LayoutConfigureProviderProps) {

    const [algoritmo, setAlgoritmo] = useState<number>(0);  // Define qual algoritmo utilizará para a construção da rede
    const [typeReduce, setTypeReduce] = useState<string>("TSNE"); // Define o tipo de algoritmo para diminuição da dimensionalidade
    const [levelNeighbors, setLevelNeighbors] = useState<number>(0); // Define o nível de conexões para o algoritmo de Redes complexas
    const [embeddings, setEmbbeddings] = useState<number>(0); // Define o número de vertores de embeddings para algoritmo Doc2Vec
    const [cosine, setCosine] = useState<number>(0); // Define o valor para simetria de cosseno
    const [maximumConnectedNeighbors, setMaximumConnectedNeighbors] = useState<number>(0); // Define o número máximo de vizinhos conectados
    const [minimumDegree, setMinimumDegree] = useState<number>(0); // Define o número mínimo do grau de cada nó
    const [layout, setLayout] = useState<string>("");  // Define qual o layout vai ser utilizado
    const [datasetAnimate, setDatasetAnimate] = useState<Dataset>({ nodes: [] });   // Dataset da rede que será usado para animação
    const [applyConfigure, setApplyConfigure] = useState<boolean>(false); // Busca o dataset escolhido pelo menu direito
    const [constructLayoutAfterApply, setConstructLayoutAfterApply] = useState<boolean>(false); 
    const [filter, setFilter] = useState<Filter>({ nodes: [] });
    const [constitutionSize, setConstitutionSize] = useState<number>(0);

    /**
     * Trigger para obter layout 
     */
    useEffect(() => {
        /**
         * Algoritmo
         *  0 - TDIDF
         *  1 - Doc2vec
         *  2 - Medidas de centralidade
         */
        let path: string = "../data/";
        path += algoritmo == 0 ? "tfidf/" : algoritmo == 1 ? "doc2vec" : "network";
        path += typeReduce == "PCA" ? "pca/" : "tsne/";
        path +=
          algoritmo == 3 ? // Network 
            (levelNeighbors == 1 ? "1/" : (levelNeighbors == 2 ? "2/" : "3/"))
            : algoritmo == 2 ? // Doc2vec
              (embeddings == 100 ? "100/" : (embeddings == 200 ? "200/" : "300/"))
              : ''; // TFIDF
        path += "graph.json";
        const graph: any = () => import("../data/tfidf/tsne/graph.json");
    
        // Load dataset   
        graph()
          .then((data: Dataset) => {
              setDatasetAnimate(data);
              setConstructLayoutAfterApply(!constructLayoutAfterApply);
            })
          .catch(() => console.log('Path não encontrado'));
      }, [applyConfigure]);

    return (
        <LayoutConfigureContext.Provider value={{
            algoritmo,
            typeReduce,
            levelNeighbors,
            embeddings,
            datasetAnimate,
            applyConfigure,
            cosine,
            maximumConnectedNeighbors,
            minimumDegree,
            layout,
            constructLayoutAfterApply,
            filter,
            constitutionSize,
            setFilter,
            setAlgoritmo,
            setTypeReduce,
            setLevelNeighbors,
            setEmbbeddings,
            setApplyConfigure,
            setCosine,
            setMaximumConnectedNeighbors,
            setMinimumDegree,
            setLayout,
            setConstitutionSize,
        }}>
            {children}
        </LayoutConfigureContext.Provider>
    )
}