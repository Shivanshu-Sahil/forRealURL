
import React from 'react';
import { Image } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SidebarProfile = ({
    avatarUrl,
    handleAvatarUpload,
    title,
    setTitle,
    setHasChanges,
    bio,
    setBio
}) => {
    return (
        <div className="bg-[#1a1a1a] border-3 border-white shadow-[6px_6px_0px_#ffe500] p-3 sm:p-4">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-neo-yellow border-2 border-white flex items-center justify-center">
                    <Image className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                </div>
                Profile
            </h2>

            {/* Avatar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 border-3 border-white bg-[#2a2a2a] overflow-hidden flex-shrink-0">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl sm:text-2xl">
                            👤
                        </div>
                    )}
                </div>
                <label className="cursor-pointer">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                    />
                    <span className="px-3 sm:px-4 py-2 bg-neo-green border-3 border-white font-bold text-xs sm:text-sm text-black hover:shadow-neo transition-all inline-block">
                        Upload Avatar
                    </span>
                </label>
            </div>

            {/* Title */}
            <div className="mb-4">
                <label className="block text-sm font-bold text-white mb-2 uppercase">
                    Title
                </label>
                <Input
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        setHasChanges(true);
                    }}
                    placeholder="My Links"
                    className="bg-[#2a2a2a] border-white text-white"
                />
            </div>

            {/* Bio */}
            <div>
                <label className="block text-sm font-bold text-white mb-2 uppercase">
                    Bio
                </label>
                <textarea
                    value={bio}
                    onChange={(e) => {
                        setBio(e.target.value);
                        setHasChanges(true);
                    }}
                    placeholder="A short bio about yourself..."
                    rows={3}
                    className="w-full neo-input resize-none bg-[#2a2a2a] border-white text-white placeholder:text-gray-500"
                />
            </div>
        </div>
    );
};

export default SidebarProfile;
