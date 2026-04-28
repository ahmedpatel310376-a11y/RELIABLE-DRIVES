import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import http from "../api/http";
import CarCard from "../components/CarCard";
import SearchFilters from "../components/SearchFilters";
import Skeleton from "../components/Skeleton";

export default function Cars() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(Object.fromEntries(searchParams.entries()));
  const [cars, setCars] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchCars = useCallback(async (params = Object.fromEntries(searchParams.entries())) => {
    setLoading(true);
    const { data } = await http.get("/cars", { params: { ...params, limit: 9 } });
    setCars(data.cars);
    setPagination(data.pagination);
    setLoading(false);
  }, [searchParams]);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    setFilters(params);
    fetchCars(params);
  }, [fetchCars, searchParams]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchParams(Object.fromEntries(Object.entries({ ...filters, page: 1 }).filter(([, value]) => value)));
  };

  const goToPage = (page) => {
    setSearchParams(Object.fromEntries(Object.entries({ ...filters, page }).filter(([, value]) => value)));
  };

  return (
    <section className="container-pad py-10">
      <div className="mb-7">
        <p className="text-sm font-bold uppercase tracking-wide text-teal">Marketplace</p>
        <h1 className="mt-2 text-4xl font-black">Second-hand cars</h1>
      </div>
      <SearchFilters filters={filters} setFilters={setFilters} onSubmit={handleSearch} compact />
      <div className="mt-8 flex items-center justify-between text-sm text-ink/60">
        <p>{pagination.total} car(s) found</p>
        <p>Page {pagination.page} of {pagination.pages}</p>
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 9 }).map((_, index) => <Skeleton key={index} className="h-80" />)
          : cars.map((car) => <CarCard key={car._id} car={car} />)}
      </div>
      {!loading && cars.length === 0 && (
        <div className="mt-8 rounded-lg border border-line bg-white p-8 text-center text-ink/65">No cars match these filters.</div>
      )}
      <div className="mt-8 flex justify-center gap-2">
        <button className="btn-secondary" disabled={pagination.page <= 1} onClick={() => goToPage(pagination.page - 1)}>Previous</button>
        <button className="btn-secondary" disabled={pagination.page >= pagination.pages} onClick={() => goToPage(pagination.page + 1)}>Next</button>
      </div>
    </section>
  );
}
