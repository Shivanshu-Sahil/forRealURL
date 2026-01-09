/**
 * =============================================================================
 * LINKS MANAGER COMPONENT
 * =============================================================================
 * Manages the list of links in the linktree editor.
 * Displays links with auto-detected icons and provides edit/delete actions.
 */

import React from 'react';
import { Link as LinkIcon, Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { renderIcon, detectIconFromUrl } from '@/lib/iconUtils.jsx';

const LinksManager = ({
    linktree,
    links,
    openAddDialog,
    openEditDialog,
    handleDeleteLink,
    deletingLink
}) => {
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

            {/* Links List */}
            <div className="space-y-3">
                {links.map((link, index) => (
                    <div
                        key={link.id}
                        className={`${index % 2 === 0 ? "bg-[#2a2a2a]" : "bg-[#1f1f1f]"
                            } border-3 border-white p-4 flex items-center gap-3 hover:shadow-[4px_4px_0px_#ffe500] transition-all`}
                    >
                        <div className="cursor-grab text-gray-400">
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
                ))}
            </div>
        </div>
    );
};

export default LinksManager;
