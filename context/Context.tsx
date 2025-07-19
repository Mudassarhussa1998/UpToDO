import { createContext } from 'react';

export type Todo = {
    id: string;
    title: string;
    completed: boolean;
};

type TodoContextType = {
    todos: Todo[];
    addTodo: (title: string) => void;
    toggleTodo: (id: string) => void;
    removeTodo: (id: string) => void;
};

const TodoContext = createContext<TodoContextType>({
    todos: [],
    addTodo: () => {},
    toggleTodo: () => {},
    removeTodo: () => {},
});

export default TodoContext;
