/**
 * =============================================================================
 * LINKS MANAGER COMPONENT
 * =============================================================================
 * Manages the list of links in the linktree editor.
 * Displays links with auto-detected icons and provides edit/delete actions.
 * Supports drag-and-drop reordering via @dnd-kit.
 */

import React from 'react';
import { Link as LinkIcon, Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { renderIcon, detectIconFromUrl } from '@/lib/iconUtils.jsx';

// Drag-and-drop imports
import {
    DndContext,
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
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// =============================================================================
// SORTABLE LINK ITEM
// =============================================================================

const SortableLink = ({ link, index, openEditDialog, handleDeleteLink, deletingLink }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: link.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`${index % 2 === 0 ? "bg-[#2a2a2a]" : "bg-[#1f1f1f]"
                } border-3 border-white p-4 flex items-center gap-3 hover:shadow-[4px_4px_0px_#ffe500] transition-all ${isDragging ? 'shadow-[6px_6px_0px_#00d4aa]' : ''
                }`}
        >
            {/* Drag handle — only this element is draggable */}
            <div
                className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white transition-colors touch-none"
                {...attributes}
                {...listeners}
            >
                <GripVertical className="w-5 h-5" />
            </div>

            {/* Auto-detected icon - re-detect from URL if saved icon is default "link" */}
            <div
                className="w-10 h-10 border-2 border-white flex items-center justify-center"
                style={{ backgroundColor: "#ffe500" }}
            >
                {renderIcon(
                    (link.icon && link.icon !== "link") ? link.icon : detectIconFromUrl(link.url),
                    "w-5 h-5 text-black"
                )}
            </div>

            <div className="flex-1 min-w-0">
                <p className="font-bold text-white truncate">{link.title}</p>
                <p className="text-sm text-gray-400 truncate">{link.url}</p>
            </div>

            <div className="flex gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(link)}
                    className="h-9 w-9 border-2 border-white bg-neo-blue hover:bg-neo-blue/80"
                >
                    <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteLink(link.id)}
                    disabled={deletingLink}
                    className="h-9 w-9 border-2 border-white bg-red-500 hover:bg-red-600"
                >
                    <Trash2 className="w-4 h-4 text-white" />
                </Button>
            </div>
        </div>
    );
};

// =============================================================================
// LINKS MANAGER
// =============================================================================

const LinksManager = ({
    linktree,
    links,
    openAddDialog,
    openEditDialog,
    handleDeleteLink,
    deletingLink,
    onReorder,
}) => {
    // Sensors with activation constraint to distinguish click from drag
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px movement before drag starts
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = links.findIndex((link) => link.id === active.id);
            const newIndex = links.findIndex((link) => link.id === over.id);
            const reordered = arrayMove(links, oldIndex, newIndex);
            onReorder(reordered);
        }
    };

    return (
        <div className="bg-[#1a1a1a] border-3 border-white shadow-[6px_6px_0px_#00d4aa] p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <div className="w-8 h-8 bg-neo-pink border-2 border-white flex items-center justify-center">
                        <LinkIcon className="w-4 h-4 text-black" />
                    </div>
                    Links
                </h2>
                <Button
                    onClick={openAddDialog}
                    className="neo-button bg-neo-green text-black border-white gap-2"
                    disabled={!linktree}
                >
                    <Plus className="w-4 h-4" />
                    Add
                </Button>
            </div>

            {!linktree && (
                <div className="text-center py-8 text-gray-400">
                    <p className="font-medium">Save your linktree first to add links</p>
                </div>
            )}

            {linktree && links.length === 0 && (
                <div className="text-center py-12 border-3 border-dashed border-white/30">
                    <div className="w-16 h-16 bg-[#2a2a2a] border-3 border-white mx-auto mb-4 flex items-center justify-center">
                        <LinkIcon className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-bold text-white mb-2">No links yet</p>
                    <p className="text-sm text-gray-400">
                        Add your first link to get started
                    </p>
                </div>
            )}

            {/* Links List — Sortable via drag-and-drop */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={links.map((link) => link.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-3">
                        {links.map((link, index) => (
                            <SortableLink
                                key={link.id}
                                link={link}
                                index={index}
                                openEditDialog={openEditDialog}
                                handleDeleteLink={handleDeleteLink}
                                deletingLink={deletingLink}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default LinksManager;
