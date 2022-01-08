export default interface ILayer {
    id: string;
    name: string;
    doc: { [key: string]: string };
    updates: string;
    geojson_url?: string;
    vector_tile_url?: string;
}