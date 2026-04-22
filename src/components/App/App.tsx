import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import { MovieGrid } from "../MovieGrid/MovieGrid";
import "./App.module.css"
import { movieService } from "../../services/movieService";
import { useState, type ComponentType } from "react";
import type { Movie } from "../../types/movie";
import { Loader } from "../Loader/Loader";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { MovieModal } from "../MovieModal/MovieModal";
import { useQuery } from "@tanstack/react-query";
import ReactPaginateModule, { type ReactPaginateProps } from "react-paginate";
import css from "./App.module.css";

type ModuleWithDefault<T> = { default: T }

const ReactPaginate = (ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>).default;

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState<number>(1);

  const { data: movies, isLoading, isError } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => movieService(query, page),
    enabled: !!query || !!page,
  });

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <Toaster />

      {isLoading && <Loader />}

      {isError && <ErrorMessage />}
      {!isLoading && !isError && movies && movies.results.length > 0 && (
        <>
          <ReactPaginate
            pageCount={movies.total_pages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
            renderOnZeroPageCount={null}
          />
          <MovieGrid
            movies={movies.results}
            onSelect={(movie) => setSelectedMovie(movie)}
          />
        </>
      )}

      {movies?.results.length === 0 && query && !isLoading && (
        toast("No movies found for your request.")
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
}
