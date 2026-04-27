import { useState } from "react";
import { Task } from "../../types";

export function RoadmapField({ onChange }: { onChange: React.Dispatch<React.SetStateAction<Task[]>> }) {
    const [tasks, setTasks] = useState<Task[]>([]);

    const update = (updated: Task[]) => {
        setTasks(updated);
        onChange(updated);
    };

    const addTask = () => {
        if (tasks.some(t => !t.task.length)) return;
        onChange(tasks);
        setTasks([...tasks, { task: "", done: false }])
    };
    const removeTask = (index: number) => update(tasks.filter((_t, i) => i !== index));
    const editTask = (index: number, value: string) => update(tasks.map((t, i) => i === index ? { ...t, task: value } : t));

    return (
        <div className="lg:w-2/3 mb-8 font-medium">
            <label className="block mb-2 font-medium">Roadmap</label>
            <div className="flex flex-col gap-4 w-2/3">
                {tasks.map((task, i) => (
                    <div key={i} className="flex gap-1">
                        <input
                            type="text"
                            value={task.task}
                            placeholder={`Etapa ${i + 1}…`}
                            onChange={(e) => editTask(i, e.target.value)}
                            className="p-2 w-full border border-gray-600 rounded-lg"
                        />
                        <button tabIndex={0} type="button" className="text-xl cursor-pointer" onClick={() => removeTask(i)}>×</button>
                    </div>
                ))}

                <button tabIndex={0} type="button" className="px-4 py-2 mb-4 border border-gray-400 rounded-lg hover:shadow-md cursor-pointer lg:w-1/2 lg:mb-0"
                    onClick={addTask}>+ Afegir una etapa</button>
            </div>
        </div>
    )
};