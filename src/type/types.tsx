export interface Dataset {
    nodes: {
        x: number,
        y: number,
        label: string,
        id: number,
        color: string
    }[];
}

export interface Filter {
    nodes: string[];
}