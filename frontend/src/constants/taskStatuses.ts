export const STATUSES = [
    "Черновик",
    "В очереди",
    "В процессе",
    "Тестирование",
    "Завершено",
  ] as const;
  
  export const STATUS_BG_COLORS: Record<string, string> = {
    Черновик: "bg-teal-200",
    "В очереди": "bg-blue-200",
    "В процессе": "bg-orange-200",
    Тестирование: "bg-purple-200",
    Завершено: "bg-green-200",
  };