"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import API from "@/app/utils/API";
import Auth from "@/app/utils/Auth";
import "react-toastify/dist/ReactToastify.css";

// Define proper types for our Todo items
interface Todo {
    id: string;
    title: string;
    completed: boolean;
    createdAt?: string;
    updatedAt?: string;
}

const Todos = () => {
    const router = useRouter();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState("");
    const [editingTodo, setEditingTodo] = useState<string | null>(null);
    const [editText, setEditText] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log("Todos component mounted");

        // Check if user is authenticated
        if (!Auth.isAuthenticated()) {
            console.log("User not authenticated, redirecting to login");
            router.push("/auth/login");
            return;
        }

        // Get user data and token
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        console.log("User data exists:", !!userData);

        if (userData?.token) {
            // Add token to request headers
            API.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
            fetchTodos();
        } else {
            console.log("No token found in user data");
            toast.error("Authentication error");
            Auth.logout();
            router.push("/auth/login");
        }
    }, [router]);

    // Separate function to fetch todos for better reusability
    const fetchTodos = async () => {
        setIsLoading(true);
        try {
            console.log("Fetching todos...");
            const response = await API.get("/todos");
            console.log("API /todos response:", response.data); // Debug response

            // Handle different API response structures and ensure completed property exists
            const todosData = response.data.data || response.data || [];
            const normalizedTodos = Array.isArray(todosData)
                ? todosData.map(todo => ({
                    ...todo,
                    id: todo.id || `temp-${Math.random().toString(36).substring(2, 9)}`, // Ensure unique ID
                    title: todo.title || "",
                    completed: todo.completed === undefined ? false : todo.completed
                }))
                : [];

            console.log("Normalized todos:", normalizedTodos);
            setTodos(normalizedTodos);
        } catch (error) {
            console.error("Failed to fetch todos:", error);

            // Check if it's an authentication error
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again.");
                Auth.logout();
                router.push("/auth/login");
                return;
            }

            toast.error("Failed to load todos");
        } finally {
            setIsLoading(false);
        }
    };

    const addTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.trim()) return;

        try {
            console.log("Attempting to add todo with title:", newTodo);

            // Create the payload with all possible required fields
            const todoPayload = {
                title: newTodo.trim(),
                completed: false
            };

            console.log("Todo payload:", todoPayload);

            // Get the token to verify it's valid
            const userData = JSON.parse(localStorage.getItem("user") || "{}");
            console.log("Using auth token:", userData?.token ? "Token exists" : "No token");

            // Set the authorization header explicitly for this request
            const config = {
                headers: {
                    'Authorization': `Bearer ${userData?.token}`,
                    'Content-Type': 'application/json'
                }
            };

            // Make the API call with explicit headers
            const res = await API.post("/todos", todoPayload, config);
            console.log("API response for add todo:", res.data);

            // Extract the new todo data, handling different API response formats
            let newTodoData;
            if (res.data.data) {
                newTodoData = res.data.data;
            } else {
                newTodoData = res.data;
            }

            // Ensure the new todo has all required properties
            const newTodoWithDefaults = {
                id: newTodoData.id || `temp-${Math.random().toString(36).substring(2, 9)}`,
                title: newTodoData.title || newTodo.trim(), // Use input if API didn't return title
                completed: newTodoData.completed !== undefined ? newTodoData.completed : false
            };

            console.log("Adding todo to state:", newTodoWithDefaults);

            // Update state with the new todo
            setTodos(prevTodos => [...prevTodos, newTodoWithDefaults]);
            setNewTodo("");
            toast.success("Todo added successfully");
        } catch (error) {
            console.error("Failed to add todo. Error details:", error);
            console.error("Error response:", error.response?.data);

            // Check status code for better error handling
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again.");
                Auth.logout();
                router.push("/auth/login");
                return;
            } else if (error.response?.status === 400) {
                toast.error(`Bad request: ${error.response?.data?.message || "Invalid data"}`);
            } else if (error.response?.status === 422) {
                toast.error(`Validation error: ${error.response?.data?.message || "Invalid data"}`);
            } else {
                toast.error(`Failed to add todo: ${error.message || "Unknown error"}`);
            }
        }
    };

    const toggleTodo = async (id: string, completed: boolean) => {
        try {
            console.log(`Toggling todo ${id} from ${completed} to ${!completed}`);

            // Use the current state to determine the new state
            const updated = !completed;

            // Make sure headers are set properly
            const userData = JSON.parse(localStorage.getItem("user") || "{}");
            const config = {
                headers: {
                    'Authorization': `Bearer ${userData?.token}`,
                    'Content-Type': 'application/json'
                }
            };

            // Send the update request
            const response = await API.put(`/todos/${id}`, { completed: updated }, config);
            console.log("Toggle response:", response.data);

            // Update the local state
            setTodos(prev =>
                prev.map(todo =>
                    todo.id === id ? { ...todo, completed: updated } : todo
                )
            );
        } catch (error) {
            console.error("Failed to update todo:", error);
            console.error("Error response:", error.response?.data);

            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again.");
                Auth.logout();
                router.push("/auth/login");
                return;
            }

            toast.error("Failed to update todo status");
        }
    };

    const startEditing = (id: string, title: string) => {
        setEditingTodo(id);
        setEditText(title);
    };

    const saveEdit = async (id: string) => {
        if (!editText.trim()) return;

        try {
            console.log(`Saving edit for todo ${id}: "${editText}"`);

            // Make sure headers are set properly
            const userData = JSON.parse(localStorage.getItem("user") || "{}");
            const config = {
                headers: {
                    'Authorization': `Bearer ${userData?.token}`,
                    'Content-Type': 'application/json'
                }
            };

            // Send the update request
            const response = await API.put(`/todos/${id}`, { title: editText.trim() }, config);
            console.log("Edit response:", response.data);

            // Update the local state
            setTodos(prev =>
                prev.map(todo =>
                    todo.id === id ? { ...todo, title: editText.trim() } : todo
                )
            );
            setEditingTodo(null);
            setEditText("");
            toast.success("Todo updated successfully");
        } catch (error) {
            console.error("Failed to update todo:", error);
            console.error("Error response:", error.response?.data);

            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again.");
                Auth.logout();
                router.push("/auth/login");
                return;
            }

            toast.error("Failed to update todo");
        }
    };

    const cancelEdit = () => {
        setEditingTodo(null);
        setEditText("");
    };

    const deleteTodo = async (id: string) => {
        try {
            console.log(`Deleting todo ${id}`);

            // Make sure headers are set properly
            const userData = JSON.parse(localStorage.getItem("user") || "{}");
            const config = {
                headers: {
                    'Authorization': `Bearer ${userData?.token}`
                }
            };

            // Send the delete request
            await API.delete(`/todos/${id}`, config);

            // Update the local state
            setTodos(prev => prev.filter(todo => todo.id !== id));
            toast.success("Todo deleted successfully");
        } catch (error) {
            console.error("Failed to delete todo:", error);
            console.error("Error response:", error.response?.data);

            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again.");
                Auth.logout();
                router.push("/auth/login");
                return;
            }

            toast.error("Failed to delete todo");
        }
    };

    const handleLogout = () => {
        Auth.logout();
        API.defaults.headers.common["Authorization"] = "";
        router.push("/auth/login");
        toast.success("Logged out successfully");
    };

    return (
        <div className="min-h-screen bg-background p-4">
            <nav className="fixed w-full top-0 left-0 z-50 border-b bg-white/90 backdrop-blur">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent">Livere</h1>
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="p-2 rounded-full hover:bg-gray-100"
                        >
                            <FontAwesomeIcon icon={faUser} size="lg" />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow p-3 text-sm z-50">
                                <button
                                    onClick={handleLogout}
                                    className="text-red-600 hover:underline w-full text-left py-1"
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
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 transition"
                            disabled={!newTodo.trim()}
                        >
                            Add
                        </button>
                    </form>

                    {isLoading ? (
                        <div className="text-center py-10">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                            <p className="mt-2 text-gray-600">Loading your todos...</p>
                        </div>
                    ) : todos.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <p>You dont have any todos yet. Add one to get started!</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {todos.map((todo) => (
                                <div
                                    key={todo.id}
                                    className="flex justify-between items-center border p-3 rounded"
                                >
                                    <div className="flex items-center gap-2 flex-1">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(todo.completed)}
                                            onChange={() => toggleTodo(todo.id, Boolean(todo.completed))}
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
                                            <span className={todo.completed ? "line-through text-gray-400" : ""}>
                                                {todo.title}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-1">
                                        {editingTodo === todo.id ? (
                                            <>
                                                <button
                                                    onClick={() => saveEdit(todo.id)}
                                                    className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
                                                >
                                                    ✕
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => startEditing(todo.id, todo.title)}
                                                    className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition"
                                                >
                                                    <FontAwesomeIcon icon={faPen} />
                                                </button>
                                                <button
                                                    onClick={() => deleteTodo(todo.id)}
                                                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default Todos;