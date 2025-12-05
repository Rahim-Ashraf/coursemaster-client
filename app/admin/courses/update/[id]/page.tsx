"use client"

import api from "@/src/lib/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

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

export default function UpdateCourse() {
    const params = useParams()
    const { id } = params;

    const [course, setCourse] = useState<Course>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, isSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm<Course>()

    const { fields, append, remove } = useFieldArray({
        control,
        name: "syllabus",
    });

    useEffect(() => {
        if (id) {
            const fetchCourseDetails = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await api.get(`/courses/${id}`);
                    setCourse(response.data);
                    setLoading(false);
                    reset(response.data)
                } catch (err: any) {
                    setError(err.response?.data?.message || "Failed to fetch course details")
                    setLoading(false);
                }
            };
            fetchCourseDetails();
        }
    }, [id, reset]);

    const handleUpdate = async (data: Course) => {
        setError(null);
        isSubmitting(true)
        try {
            await api.put(`/courses/${course?._id}`, data);
            alert("Course updated successfully!");
            reset();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to save course");
        }
        finally {
            isSubmitting(false)
        }
    };

    if (loading) return (<div className="text-center">Item loading</div>)
    if (error) return (<div className="text-red text-center">{error}</div>)
    return (

        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
            {course &&
                <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            {...register("title", { required: true })}
                            className="mt-1 p-2 block w-full rounded-md border border-gray-300"
                        />
                        {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            {...register("description", { required: true })}
                            rows={3}
                            className="mt-1 block w-full rounded-md border border-gray-300"
                        ></textarea>
                        {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Instructor</label>
                        <input
                            type="text"
                            {...register("instructor", { required: true })}
                            className="mt-1 p-2 block w-full rounded-md border border-gray-300"
                        />
                        {errors.instructor && <p className="text-red-600 text-sm">{errors.instructor.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                            type="number"
                            step="0.01"
                            {...register("price", { valueAsNumber: true, required: true })}
                            className="mt-1 p-2 block w-full rounded-md border border-gray-300"
                        />
                        {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            {...register("category", { required: true })}
                            className="rounded-md border border-gray-300 p-2 shadow-sm"
                        >
                            <option value="Programming">Programming</option>
                            <option value="Design">Design</option>
                            <option value="Marketing">Marketing</option>
                        </select>
                        {errors.category && <p className="text-red-600 text-sm">{errors.category.message}</p>}
                    </div>


                    <div className="mb-8">
                        <label className="text-gray-700">Syllabus (each item on new line)</label>
                        <div className="flex justify-evenly font-semibold">
                            <label>Module</label>
                            <label>Content</label>
                        </div>
                        {fields.map((field, idx) => (
                            <div key={field.id} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    {...register(`syllabus.${idx}.module` as const)}
                                    className="mt-1 p-2 w-full rounded-md border border-gray-300"
                                />

                                <input
                                    type="text"
                                    {...register(`syllabus.${idx}.content` as const)}
                                    className="mt-1 p-2 w-full rounded-md border border-gray-300"
                                />

                                <button
                                    type="button"
                                    onClick={() => remove(idx)}
                                    className="bg-rose-500 p-2 w-60 rounded text-white font-semibold cursor-pointer"
                                >
                                    Remove item
                                </button>
                            </div>
                        ))}

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() =>
                                    append({
                                        id: crypto.randomUUID(),
                                        module: "",
                                        content: "",
                                    })
                                }
                                className="bg-emerald-500 p-2 w-30 rounded text-white font-semibold cursor-pointer"
                            >
                                Add item
                            </button>
                        </div>
                        {errors.syllabus && <p className="text-red-600 text-sm">{errors.syllabus.message}</p>}
                    </div>


                    <div className="flex justify-end space-x-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="prm-btn w-full"
                        >
                            {submitting ? "Updating..." : "Update Course"}
                        </button>
                    </div>
                </form>
            }
        </div>
    )
}
