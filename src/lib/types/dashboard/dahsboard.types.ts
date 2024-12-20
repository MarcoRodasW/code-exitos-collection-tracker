export type MostValueCollectionsResponse = {
  id: string;
  name: string;
  value: number;
  image_url: string | null;
  description: string | null;
};

export type MostValueItemsResponse = {
  id: string;
  name: string;
  price: number;
  year_made: number | null;
  total_price: number | null;
  quantity: number;
  image_url: string | null;
};

export type OlderItemsReponse = {
  id: string;
  name: string;
  price: number;
  year_made: number | null;
  total_price: number | null;
  quantity: number;
  image_url: string | null;
};
