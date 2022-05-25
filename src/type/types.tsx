export interface Dataset {
    nodes: {
        x: number,
        y: number,
        label: string,
        id: number,
        cluster: number;
    }[];
    edges: {}[];
}

export interface Filter {
    nodes: string[];
}