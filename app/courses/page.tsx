"use client";

import { useState, useEffect } from "react";
import api from "@/src/lib/api";
import CourseCard from "@/src/components/CourseCard";

interface Syllabus {
    content: string;
    module: string;
    id: string;
}
interface Course {
    _id: string;
    title: string;
    description: string;
    instructor: string;
    price: number;
    syllabus: Syllabus[];
    category: string;
}

export default function CourseListingPage() {

    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalCourses, setTotalCourses] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [sortBy, setSortBy] = useState(''); // by price
    const [categoryFilter, setCategoryFilter] = useState("")

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams();
                params.append("page", page.toString());
                params.append("limit", '2');
                if (searchTerm) params.append("search", searchTerm);
                if (sortBy) params.append("sortBy", sortBy);
                if (categoryFilter) params.append("filter", categoryFilter);

                const response = await api.get(`/courses?${params.toString()}`);
                setCourses(response.data.courses);
                setTotalCourses(response.data.totalCourses);
                setLoading(false);
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to fetch courses");
                setLoading(false);
            }
        };
        fetchCourses();
    }, [page, searchTerm, sortBy, categoryFilter])


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };
    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSearchTerm(searchValue);
        setPage(1); // Reset page on new search
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategoryFilter(e.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const totalPages = Math.ceil(totalCourses / 2);

    if (loading) return <p className="p-8 text-center">Loading courses...</p>;
    if (error) return <p className="p-8 text-center text-red-600">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="mb-8 text-4xl font-bold text-gray-800">Available Courses</h1>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <form onSubmit={handleSearchSubmit}
                    className="w-full sm:w-1/2 md:w-1/3">
                    <input
                        type="text"
                        placeholder="Search by title or instructor..."
                        value={searchValue}
                        onChange={handleSearchChange}
                        className="w-full rounded-md border border-gray-300 p-2 shadow-sm"
                    />
                </form>

                <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="rounded-md border border-gray-300 p-2 shadow-sm"
                >
                    <option value="">Sort By</option>
                    <option value="asc">Price: Low to High</option>
                    <option value="desc">Price: High to Low</option>
                </select>

                <select
                    value={categoryFilter}
                    onChange={handleCategoryChange}
                    className="rounded-md border border-gray-300 p-2 shadow-sm"
                >
                    <option value="">All Categories</option>
                    {/* TODO: Dynamically load categories from API */}
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                </select>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.length === 0 ? (
                    <p className="col-span-full text-center text-gray-600">No courses found.</p>
                ) : (
                    courses.map((course) => (
                        <CourseCard key={course._id} course={course} />
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <div className="mt-8 flex justify-center space-x-2">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="scnd-btn disabled:opacity-50"
                    >
                        Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`rounded-md border border-gray-300 px-4 py-2 ${page === index + 1 ? "prm-btn" : "scnd-btn"
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="scnd-btn disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}