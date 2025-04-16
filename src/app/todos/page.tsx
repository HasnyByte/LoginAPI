"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Bounce, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import API from "@/app/utils/API";
import "react-toastify/dist/ReactToastify.css";

const Todos = () => {
    const router = useRouter();
    const [todos, setTodos] = useState<any[]>([]);
    const [newTodo, setNewTodo] = useState("");
    const [editingTodo, setEditingTodo] = useState<string | null>(null);
    const [editText, setEditText] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            API.get("/todos")
                .then((res) => setTodos(res.data.data))
                .catch(() => toast.error("Failed to load todos"));
        }
    }, []);

    const addTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.trim()) return;

        try {
            const res = await API.post("/todos", { title: newTodo });
            setTodos((prev) => [...prev, res.data.data]);
            setNewTodo("");
            toast.success("Todo added", { transition: Bounce });
        } catch {
            toast.error("Failed to add todo");
        }
    };

    const toggleTodo = async (id: string, completed: boolean) => {
        try {
            await API.put(`/todos/${id}`, { completed: !completed });
            setTodos((prev) =>
                prev.map((todo) =>
                    todo.id === id ? { ...todo, completed: !completed } : todo
                )
            );
        } catch {
            toast.error("Failed to update todo");
        }
    };

    const startEditing = (id: string, title: string) => {
        setEditingTodo(id);
        setEditText(title);
    };

    const saveEdit = async (id: string) => {
        if (!editText.trim()) return;

        try {
            await API.put(`/todos/${id}`, { title: editText.trim() });
            setTodos((prev) =>
                prev.map((todo) =>
                    todo.id === id ? { ...todo, title: editText.trim() } : todo
                )
            );
            setEditingTodo(null);
            setEditText("");
        } catch {
            toast.error("Failed to update todo");
        }
    };

    const cancelEdit = () => {
        setEditingTodo(null);
        setEditText("");
    };

    const deleteTodo = async (id: string) => {
        try {
            await API.delete(`/todos/${id}`);
            setTodos((prev) => prev.filter((todo) => todo.id !== id));
        } catch {
            toast.error("Failed to delete todo");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/auth/login");
        toast.success("Logged out successfully");
    };

    return (
        <div className="min-h-screen bg-background p-4">
            <nav className="fixed w-full top-0 left-0 z-50 border-b bg-white/90 backdrop-blur">
                <div className="container flex h-16 items-center justify-between px-4">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent">Livere</h1>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                            <FontAwesomeIcon icon={faUser} size="lg" />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow p-3 text-sm z-50">
                                <p className="mb-2">Login sebagai: <strong>User</strong></p>
                                <button
                                    onClick={handleLogout}
                                    className="text-red-600 hover:underline"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div className="mt-24 max-w-2xl mx-auto">
                <div className="bg-white p-4 rounded-md shadow-md">
                    <form onSubmit={addTodo} className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            placeholder="Add a new todo"
                            className="flex-1 p-2 border rounded"
                        />
                        <button type="submit" className="bg-blue-500 text-white px-4 rounded">
                            Add
                        </button>
                    </form>

                    <div className="space-y-2">
                        {todos.map((todo) => (
                            <div
                                key={todo.id}
                                className="flex justify-between items-center border p-3 rounded"
                            >
                                <div className="flex items-center gap-2 flex-1">
                                    <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => toggleTodo(todo.id, todo.completed)}
                                    />
                                    {editingTodo === todo.id ? (
                                        <input
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") saveEdit(todo.id);
                                                else if (e.key === "Escape") cancelEdit();
                                            }}
                                            className="flex-1 p-2 border rounded"
                                            autoFocus
                                        />
                                    ) : (
                                        <span
                                            className={todo.completed ? "line-through text-gray-400" : ""}
                                        >
                      {todo.title}
                    </span>
                                    )}
                                </div>
                                <div className="flex gap-1">
                                    {editingTodo === todo.id ? (
                                        <>
                                            <button
                                                onClick={() => saveEdit(todo.id)}
                                                className="bg-green-500 text-white p-2 rounded"
                                            >
                                                ✓
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="bg-gray-500 text-white p-2 rounded"
                                            >
                                                ✕
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => startEditing(todo.id, todo.title)}
                                                className="bg-yellow-500 text-white p-2 rounded"
                                            >
                                                <FontAwesomeIcon icon={faPen} />
                                            </button>
                                            <button
                                                onClick={() => deleteTodo(todo.id)}
                                                className="bg-red-500 text-white p-2 rounded"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
};

export default Todos;
