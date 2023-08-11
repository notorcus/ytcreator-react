import React from 'react';
import './PopoverBox.css';

interface PopoverBoxProps {
    content: string;
    // You can add more props as needed
}

const PopoverBox: React.FC<PopoverBoxProps> = ({ content }) => {
    return (
        <div className="popover-box">
            {content}
        </div>
    );
};

export default PopoverBox;
