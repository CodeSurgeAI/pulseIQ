'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Move } from 'lucide-react';
import { cn } from '@/utils';

interface DraggableWidgetProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  showHandle?: boolean;
}

export function DraggableWidget({ 
  id, 
  children, 
  className,
  disabled = false,
  showHandle = true 
}: DraggableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group transition-all duration-200',
        isDragging && 'opacity-50 scale-105 z-50 shadow-2xl',
        isOver && !isDragging && 'scale-102 shadow-lg',
        disabled && 'cursor-not-allowed opacity-75',
        className
      )}
    >
      {/* Drag Handle */}
      {showHandle && !disabled && (
        <div
          {...attributes}
          {...listeners}
          className={cn(
            'absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100',
            'transition-all duration-200 cursor-grab active:cursor-grabbing',
            'p-2 rounded-lg bg-white shadow-md border border-gray-200',
            'hover:bg-gray-50 hover:shadow-lg',
            'flex items-center justify-center'
          )}
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4 text-gray-500" />
        </div>
      )}

      {/* Dragging Indicator */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-blue-500 border-dashed rounded-lg flex items-center justify-center">
          <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
            <Move className="h-4 w-4" />
            <span>Moving Widget</span>
          </div>
        </div>
      )}

      {/* Widget Content */}
      <div className={cn(
        'h-full',
        isDragging && 'invisible'
      )}>
        {children}
      </div>
    </div>
  );
}

// Draggable widget wrapper for cards specifically
export function DraggableCard({ 
  id, 
  children, 
  disabled = false,
  className 
}: DraggableWidgetProps) {
  return (
    <DraggableWidget
      id={id}
      disabled={disabled}
      className={cn('h-full', className)}
      showHandle={true}
    >
      {children}
    </DraggableWidget>
  );
}