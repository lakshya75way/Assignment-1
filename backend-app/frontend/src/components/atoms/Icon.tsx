import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconProps {
    icon: LucideIcon;
    size?: number;
    color?: string;
    className?: string;
}

const Icon: React.FC<IconProps> = ({ icon: LucideIcon, size = 24, color, className = '' }) => {
    return <LucideIcon size={size} color={color} className={className} />;
};

export default Icon;
