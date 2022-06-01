import axios from "axios";

const api = axios.create();

// Obtem todas as constituições promulgadas a partir em um range de data
export async function getAllConstitutesByPromulgation(minPromulgation: number, maxPromulgation: number) {
    let filter = `https://www.constituteproject.org/service/constitutions?from_year=${minPromulgation}&to_year=${maxPromulgation}`;
    return api.get(filter)
        .then((response: any) => response.data);
}

// Obtem todas as constituições através do filtro
export async function getAllConstitutesByFilter(continents: string[], minPromulgation: number, maxPromulgation: number) {
    let filter = 'https://www.constituteproject.org/service/constitutions?';
    continents.forEach((continent) => filter += `region=${continent}&`)
    filter += `from_year=${minPromulgation}&to_year=${maxPromulgation}`;
    return api.get(filter)
        .then((response: any) => response.data);
}

// Obtem os clusters via KMeans
export async function getClusterByKMeans(nodes: any[], min_clusters: number, max_clusters: number) {
    // let url = 'http://localhost:8000/kmeans';
    let url = 'https://fierce-chamber-49502.herokuapp.com/kmeans'
    let data: any = {
        "nodes": nodes,
        "min_clusters": min_clusters,
        "max_clusters": max_clusters
    };
    return api.post(url, data, {
        headers: { 
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        },
        timeout: 180000
    }).then((response: any) => response.data);
}

// Obtem os clusters via Fast Greedy
export async function getClustersByFastyGreedy(nodes: any[], edges: any[], n_clusters: number) {
    // let url = 'http://localhost:8000/fastgreedy';
    let url = 'https://fierce-chamber-49502.herokuapp.com/fastgreedy'
    let data = {
        "nodes": nodes,
        "edges": edges,
        "n_clusters": n_clusters
    }
    return api.post(url, data, {
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        timeout: 180000
    }).then((response: any) => response.data);
}

// Obtem todos os tópicos de pesquisa
export async function getAllTopics() {
    let url: string = 'https://www.constituteproject.org/service/topics?lang=en';
    return api.get(url, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((result: any) => result.data);
}

// Obter todas as constituições de um tópico
export async function getConstitutesByTopic(key: string) {
    let url: string = `https://www.constituteproject.org/service/constopicsearch?key=${key}&lang=en`;
    return api.get(url, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((result: any) => result.data);
}