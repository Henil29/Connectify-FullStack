import React from 'react';

const SimpleModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-gray-100 rounded-xl p-6 w-[90%] max-w-sm shadow-2xl relative animate-fadeIn">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default SimpleModal;
