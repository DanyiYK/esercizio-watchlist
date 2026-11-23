export type Kinds = "film" | "serie"
export type Show = {
    id: number,
    title: string,
    year: number,
    kind: Kinds,
    watched: boolean,
    review: number
}