import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";

const KanbanBoard = ({
  tasks,
  users,
  onEditTask,
  onDeleteTask,
  onSmartAssign,
  onUpdateTask,
  editingTask,
  setEditingTask,
}) => {
  const columns = ["Todo", "In Progress", "Done"];

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {columns.map((column) => {
        const { setNodeRef } = useDroppable({
          id: column,
          data: { type: "container" },
        });
        const columnTasks = getTasksByStatus(column);

        return (
          <div
            key={column}
            ref={setNodeRef}
            className="bg-white rounded-xl shadow-lg p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">{column}</h3>
              <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs">
                {columnTasks.length}
              </span>
            </div>

            <SortableContext
              id={column}
              items={columnTasks.map((task) => task._id)}
            >
              <div className="space-y-3 min-h-[200px] p-2 rounded-lg overflow-y-auto max-h-[65vh]">
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    users={users}
                    onEdit={() => onEditTask(task)}
                    onDelete={() => onDeleteTask(task._id)}
                    onSmartAssign={() => onSmartAssign(task._id)}
                    onUpdate={onUpdateTask}
                    isEditing={editingTask?._id === task._id}
                    setEditingTask={setEditingTask}
                  />
                ))}
                {columnTasks.length === 0 && (
                  <div className="text-center text-gray-500 py-6">
                    Drag tasks here or create new ones
                  </div>
                )}
              </div>
            </SortableContext>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
