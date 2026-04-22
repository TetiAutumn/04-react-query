import axios from "axios";
import type { Movie } from "../types/movie";

interface MovieServiceResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export const movieService = async (query: string, page: number): Promise<MovieServiceResponse> => {
    try {
        const response = await axios.get<MovieServiceResponse>(`https://api.themoviedb.org/3/search/movie?query=${query}&page=${page}`, {
            params: {
                // твої параметри
            },
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
            }
        }
        );

        return response.data;
    } catch (e) {
        console.log(e);
        return {
            page: 1,
            results: [],
            total_pages: 1,
            total_results: 0,
        };
    }

}