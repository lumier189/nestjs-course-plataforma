export interface PartNormalized {
  id: number;
  modulo: string;
  moduloIndex: number;
  aula: string;
  aulaIndex: number;
  parte: string;
  parteIndex: number;
  video: {
    id: number;
    path: string;
    duration: number;
    mimeType: string;
    size: number;
    thumbnailPath?: string;
  };
}
