'use client';

import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { 
  restrictToVerticalAxis, 
  restrictToWindowEdges,
  restrictToFirstScrollableAncestor 
} from '@dnd-kit/modifiers';
import { RotateCcw, Save, Settings } from 'lucide-react';
import { DraggableWidget } from './draggable-widget';
import { Button } from './button';
import { useToast } from '@/components/ui/toast';

export interface DashboardWidget {
  id: string;
  title: string;
  component: React.ReactNode;
  order: number;
  enabled: boolean;
}

interface SortableDashboardProps {
  widgets: DashboardWidget[];
  onWidgetOrderChange: (newOrder: DashboardWidget[]) => void;
  onSaveOrder?: () => void;
  onResetOrder?: () => void;
  className?: string;
  gridCols?: number;
}

export function SortableDashboard({
  widgets,
  onWidgetOrderChange,
  onSaveOrder,
  onResetOrder,
  className = 'grid gap-6',
  gridCols = 2,
}: SortableDashboardProps) {
  const [activeWidget, setActiveWidget] = useState<DashboardWidget | null>(null);
  const [isDragModeEnabled, setIsDragModeEnabled] = useState(false);
  const { showSuccess, showInfo } = useToast();

  // Filter enabled widgets and sort by order
  const enabledWidgets = widgets
    .filter(widget => widget.enabled)
    .sort((a, b) => a.order - b.order);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const widget = enabledWidgets.find(w => w.id === active.id);
    setActiveWidget(widget || null);
    showInfo('Drag Active', 'Drag the widget to reorder your dashboard');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveWidget(null);

    if (over && active.id !== over.id) {
      const oldIndex = enabledWidgets.findIndex(widget => widget.id === active.id);
      const newIndex = enabledWidgets.findIndex(widget => widget.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedWidgets = arrayMove(enabledWidgets, oldIndex, newIndex);
        
        // Update order values
        const updatedWidgets = widgets.map(widget => {
          const reorderedIndex = reorderedWidgets.findIndex(w => w.id === widget.id);
          if (reorderedIndex !== -1) {
            return { ...widget, order: reorderedIndex };
          }
          return widget;
        });

        onWidgetOrderChange(updatedWidgets);
        showSuccess('Widget Moved', 'Dashboard layout updated successfully');
      }
    }
  };

  const toggleDragMode = () => {
    setIsDragModeEnabled(!isDragModeEnabled);
    showInfo(
      isDragModeEnabled ? 'Drag Mode Disabled' : 'Drag Mode Enabled',
      isDragModeEnabled 
        ? 'Widget reordering is now disabled' 
        : 'You can now drag widgets to reorder them'
    );
  };

  const handleSaveOrder = () => {
    if (onSaveOrder) {
      onSaveOrder();
      showSuccess('Layout Saved', 'Your dashboard layout has been saved');
    }
  };

  const handleResetOrder = () => {
    if (onResetOrder) {
      onResetOrder();
      showSuccess('Layout Reset', 'Dashboard layout reset to default order');
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-900">Dashboard Layout</h2>
          <span className="text-sm text-gray-500">
            ({enabledWidgets.length} widget{enabledWidgets.length !== 1 ? 's' : ''})
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={isDragModeEnabled ? "success" : "outline"}
            size="sm"
            onClick={toggleDragMode}
            icon={<Settings className="h-4 w-4" />}
          >
            {isDragModeEnabled ? 'Drag Mode On' : 'Enable Drag Mode'}
          </Button>
          
          {onSaveOrder && (
            <Button
              variant="info"
              size="sm"
              onClick={handleSaveOrder}
              icon={<Save className="h-4 w-4" />}
            >
              Save Layout
            </Button>
          )}
          
          {onResetOrder && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleResetOrder}
              icon={<RotateCcw className="h-4 w-4" />}
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Drag Mode Indicator */}
      {isDragModeEnabled && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-blue-900 font-medium">Drag Mode Active</p>
              <p className="text-blue-700 text-sm">
                Hover over widgets and use the drag handle (⋮⋮) to reorder them. Click &quot;Drag Mode On&quot; again to disable.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sortable Dashboard */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <SortableContext 
          items={enabledWidgets.map(w => w.id)}
          strategy={rectSortingStrategy}
        >
          <div className={`${className} ${
            gridCols === 1 ? 'grid-cols-1' :
            gridCols === 2 ? 'grid-cols-1 lg:grid-cols-2' :
            gridCols === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            {enabledWidgets.map((widget) => (
              <DraggableWidget
                key={widget.id}
                id={widget.id}
                showHandle={isDragModeEnabled}
                disabled={!isDragModeEnabled}
              >
                {widget.component}
              </DraggableWidget>
            ))}
          </div>
        </SortableContext>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeWidget ? (
            <div className="bg-white rounded-lg shadow-2xl border-2 border-blue-500 opacity-90">
              <div className="p-4 bg-blue-50 border-b border-blue-200">
                <h3 className="font-medium text-blue-900">{activeWidget.title}</h3>
              </div>
              <div className="p-4">
                <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-gray-500">Widget Preview</span>
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}