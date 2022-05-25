import { createContext, ReactNode, useEffect, useState } from "react";
import { Dataset, Filter } from "../type/types";
import React from "react";
import {
    dataset_tfidf_pca,
    dataset_tfidf_tsne,
    dataset_network_pca,
    dataset_network_tsne,
    dataset_doc2vec_pca,
    dataset_doc2vec_tsne
} from "./ImportDataset";

interface LayoutConfigureContextProps {
    algoritmo: string;
    typeReduce: string;
    datasetAnimate: Dataset;
    applyConfigure: boolean;
    distance: number;
    maximumConnectedNeighbors: number;
    minimumDegree: number;
    layout: string;
    constructLayoutAfterApply: boolean;
    filter: Filter;
    constitutionWordsLength: number;
    clustering: number;
    isLoading: boolean;
    applyConstructGraph: boolean;
    cppFilter: number;
    whoDistance: number;
    filterByName: string;
    setAlgoritmo:       React.Dispatch<React.SetStateAction<string>>;
    setTypeReduce:      React.Dispatch<React.SetStateAction<string>>;
    setApplyConfigure:  React.Dispatch<React.SetStateAction<boolean>>;
    setDistance:        React.Dispatch<React.SetStateAction<number>>;
    setMaximumConnectedNeighbors: React.Dispatch<React.SetStateAction<number>>;
    setMinimumDegree:   React.Dispatch<React.SetStateAction<number>>;
    setLayout:          React.Dispatch<React.SetStateAction<string>>;
    setFilter:          React.Dispatch<React.SetStateAction<Filter>>;
    setConstitutionWordsLength: React.Dispatch<React.SetStateAction<number>>;
    setClustering:      React.Dispatch<React.SetStateAction<number>>;
    setIsLoading:       React.Dispatch<React.SetStateAction<boolean>>;
    setCPPFilter:       React.Dispatch<React.SetStateAction<number>>;
    setWhoDistance:     React.Dispatch<React.SetStateAction<number>>;
    setFilterByName:    React.Dispatch<React.SetStateAction<string>>;
}

interface LayoutConfigureProviderProps {
    children: ReactNode;
}

export const LayoutConfigureContext = createContext({} as LayoutConfigureContextProps);

export default function LayoutConfigureProvider({ children }: LayoutConfigureProviderProps) {

    const [algoritmo, setAlgoritmo] = useState<string>('tfidf');            // Define qual algoritmo utilizará para a construção da rede
    const [typeReduce, setTypeReduce] = useState<string>('TSNE');           // Define o tipo de algoritmo para diminuição da dimensionalidade
    const [distance, setDistance] = useState<number>(0);                    // Define o valor para simetria de cosseno/euclidiana
    const [whoDistance, setWhoDistance] = useState<number>(0);              // Verifica qual a distância foi escolhida 
    const [maximumConnectedNeighbors, setMaximumConnectedNeighbors] = useState<number>(0); // Define o número máximo de vizinhos conectados
    const [minimumDegree, setMinimumDegree] = useState<number>(0);          // Define o número mínimo do grau de cada nó
    const [layout, setLayout] = useState<string>("");                       // Define qual o layout vai ser utilizado
    const [datasetAnimate, setDatasetAnimate] = useState<Dataset>(dataset_tfidf_pca);   // Dataset da rede que será usado para animação
    const [applyConfigure, setApplyConfigure] = useState<boolean>(false);   // Busca o dataset escolhido após ativar construção do gráfico
    const [constructLayoutAfterApply, setConstructLayoutAfterApply] = useState<boolean>(false); // Aplica a construção do gráfico, conexões, layout, animação
    const [filter, setFilter] = useState<Filter>({ nodes: [] });            // Aplica o filtro do layout
    const [constitutionWordsLength, setConstitutionWordsLength] = useState<number>(0);    // Filtro para o tamanho da constituição
    const [clustering, setClustering] = useState<number>(0);                // Verifca se deve ou não clusterizar o gráfico, ativando a função
    const [isLoading, setIsLoading] = useState<boolean>(false);             // Habilita a tela de Loading
    const [applyConstructGraph, setApplyContructGraph] = useState<boolean>(false);
    const [cppFilter, setCPPFilter] = useState<number>(0);
    const [filterByName, setFilterByName] = useState<string>("");

    /**
     * Trigger para obter layout 
     */
    useEffect(() => {
        /**
         * Algoritmo
         *  TDIDF / Doc2vec / Medidas de centralidade / CPP
         * 
         * Type Reduce
         *  PCA / TSNE
         * 
         * Clustering
         *  1 - KMeans
         *  2 - Fast Greedy 
         */

        let dataset: Dataset = {
            nodes: [],
            edges: []
        };

        switch (algoritmo) {
            case 'tfidf':
                // TFIDF
                dataset = typeReduce == "TSNE" ? dataset_tfidf_tsne : dataset_tfidf_pca;
                break;
            case 'doc2vec':
                // Doc2Vec
                dataset = typeReduce == "TSNE" ? dataset_doc2vec_tsne : dataset_doc2vec_pca;
                break;
            case 'network':
                // Network
                dataset = typeReduce == "TSNE" ? dataset_network_tsne : dataset_network_pca;
                break;
            case 'cpp':
                // CPP
                break;
        }

        // Seta o dataset escolhido
        setDatasetAnimate(dataset);

        // Seta constroi o gráfico em GraphController
        setApplyContructGraph(!applyConstructGraph);

        // Seta as arestas, clusters e animações do gráfico
        setConstructLayoutAfterApply(!constructLayoutAfterApply);
    }, [applyConfigure]);

    return (
        <LayoutConfigureContext.Provider value={{
            algoritmo,
            typeReduce,
            datasetAnimate,
            applyConfigure,
            distance,
            maximumConnectedNeighbors,
            minimumDegree,
            layout,
            constructLayoutAfterApply,
            filter,
            constitutionWordsLength,
            clustering,
            isLoading,
            applyConstructGraph,
            cppFilter,
            whoDistance,
            filterByName,
            setFilter,
            setAlgoritmo,
            setTypeReduce,
            setApplyConfigure,
            setDistance,
            setMaximumConnectedNeighbors,
            setMinimumDegree,
            setLayout,
            setConstitutionWordsLength,
            setClustering,
            setIsLoading,
            setCPPFilter,
            setWhoDistance,
            setFilterByName
        }}>
            {children}
        </LayoutConfigureContext.Provider>
    )
}