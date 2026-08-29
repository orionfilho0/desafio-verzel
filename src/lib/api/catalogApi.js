import httpClient from "./httpClient";

export async function searchCatalog(query) {
  const { data } = await httpClient.get("/catalog/search", { params: { query } });
  return data.map((item) => ({
    ...item,
    id: String(item.tmdbId),
    description: item.overview || "",
    imageUrl: item.posterUrl || "",
  }));
}
