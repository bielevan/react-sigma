export interface Dataset {
    nodes: {
        x: number,
        y: number,
        label: string,
        id: number,
        cluter: number;
    }[];
    clusters: number;
}

export interface Filter {
    nodes: string[];
}