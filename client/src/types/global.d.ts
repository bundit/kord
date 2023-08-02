declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

type Source = "soundcloud" | "spotify" | "youtube";

export interface Track {
  title: string;
  id: string | number;
  duration: number;
  img: string;
  artist: {
    name: string;
    img: string;
    id: string | number;
  };
  permalink?: string;
  type?: string;
  source: Source;
  streamable: boolean;
}
