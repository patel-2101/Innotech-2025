import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    ASSIGNED: 'bg-blue-100 text-blue-800 border-blue-200',
    IN_PROGRESS: 'bg-purple-100 text-purple-800 border-purple-200',
    RESOLVED: 'bg-green-100 text-green-800 border-green-200',
    REJECTED: 'bg-red-100 text-red-800 border-red-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    LOW: 'bg-gray-100 text-gray-800 border-gray-200',
    MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
    URGENT: 'bg-red-100 text-red-800 border-red-200',
  };
  return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    WATER: '💧',
    ELECTRICITY: '⚡',
    ROAD: '🛣️',
    GARBAGE: '🗑️',
    OTHERS: '📋',
  };
  return icons[category] || '📋';
}
