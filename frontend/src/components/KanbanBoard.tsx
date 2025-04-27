import React, { useEffect, useMemo, useRef, useState } from "react";
import TaskCard from "./TaskCard";
import { STATUSES, STATUS_BG_COLORS } from "../constants/taskStatuses";
import { Task } from "../pages/TasksPage";

interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: number, newStatus: string) => void;
  onTaskClick: (taskId: number) => void;
  onEdit: (task: Task, e: React.MouseEvent) => void;
  onDelete: (task: Task, e: React.MouseEvent) => void;
  onScrollEndChange?: (isAtEnd: boolean) => void;
}

const KanbanBoard = ({
  tasks,
  onTaskMove,
  onTaskClick,
  onEdit,
  onDelete,
  onScrollEndChange,
}: KanbanBoardProps) => {
  const tasksByStatus = useMemo(() => {
    return STATUSES.reduce((acc, status) => {
      acc[status] = tasks.filter((task) => task.status === status);
      return acc;
    }, {} as Record<string, Task[]>);
  }, [tasks]);

  const boardRef = useRef<HTMLDivElement>(null);
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (boardRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = boardRef.current;
        const atEnd = scrollLeft + clientWidth >= scrollWidth;
        setIsScrolledToEnd(atEnd);
        if (onScrollEndChange) {
          onScrollEndChange(atEnd)
        } else return
      }
    };

    const board = boardRef.current;
    if (board) {
      board.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
      handleScroll();
    }
  
    return () => {
      if (board) {
        board.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      }
    };
  }, [onScrollEndChange]);

  const handleDropOnColumn = async (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData("taskId"));
    try {
      await onTaskMove(taskId, status);
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const EmptyDropZone = ({ status }: { status: string }) => (
    <div
      className="h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleDropOnColumn(e, status)}
    >
      Перетащите сюда
    </div>
  );

  return (
    <div className="overflow-x-auto flex-1" ref={boardRef}>
      <div
        className="grid gap-4 mb-4"
        style={{
          gridTemplateColumns: `repeat(${STATUSES.length}, minmax(300px, 1fr))`,
          minWidth: `${STATUSES.length * 300}px`,
        }}
      >
        {STATUSES.map((status) => (
          <div
            key={status}
            className={`text font-semibold text-center px-10 py-2 rounded-md ${STATUS_BG_COLORS[status]} text-gray-700`}
          >
            {status}
          </div>
        ))}
      </div>

      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${STATUSES.length}, minmax(300px, 1fr))`,
          minWidth: `${STATUSES.length * 300}px`,
        }}
      >
        {STATUSES.map((status) => (
          <div
            key={status}
            className="min-h-[200px]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDropOnColumn(e, status)}
          >
            {tasksByStatus[status].map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDoubleClick={() => onTaskClick(task.id)}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}

            {tasksByStatus[status].length === 0 && (
              <EmptyDropZone status={status} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;