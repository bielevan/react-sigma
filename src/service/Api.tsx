import axios from "axios";

const api = axios.create({
    baseURL: "https://www.constituteproject.org/service/",
})

export async function getAllConstitutesByPromulgation(minPromulgation: number, maxPromulgation: number) {
    let filter = `constitutions?from_year=${minPromulgation}&to_year=${maxPromulgation}`;
    return api.get(filter).then((response: any) => response.data);
}

export async function getAllConstitutesByFilter(continents: string[], minPromulgation: number, maxPromulgation: number) {
    let filter = 'constitutions?';
    continents.forEach((continent) => filter += `region=${continent}&`)
    filter += `from_year=${minPromulgation}&to_year=${maxPromulgation}`;
    return api.get(filter).then((response: any) => response.data);
}