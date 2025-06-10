import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import { BsFillCameraReelsFill, BsCameraReels } from "react-icons/bs";
import { IoChatbubbleEllipsesOutline, IoChatbubbleEllipses, IoSearchCircle, IoSearchCircleOutline } from "react-icons/io5";
import { RiAccountCircleFill, RiAccountCircleLine } from "react-icons/ri";

const NavigationBar = () => {
    const location = useLocation();
    const tab = location.pathname;

    return (
        <div className='fixed bottom-0 w-full bg-white py-2 sm:py-3 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]'>
            <div className="flex justify-around max-w-md mx-auto">
                <Link to="/" className='flex flex-col items-center text-xl sm:text-2xl hover:scale-110 transition-transform'>
                    {tab === "/" ? <AiFillHome className="text-blue-500" /> : <AiOutlineHome />}
                </Link>
                <Link to="/reels" className='flex flex-col items-center text-xl sm:text-2xl hover:scale-110 transition-transform'>
                    {tab === "/reels" ? <BsFillCameraReelsFill className="text-blue-500" /> : <BsCameraReels />}
                </Link>
                <Link to="/search" className='flex flex-col items-center text-xl sm:text-2xl hover:scale-110 transition-transform'>
                    {tab === "/search" ? <IoSearchCircle className="text-blue-500" /> : <IoSearchCircleOutline />}
                </Link>
                <Link to="/chat" className='flex flex-col items-center text-xl sm:text-2xl hover:scale-110 transition-transform'>
                    {tab === "/chat" ? <IoChatbubbleEllipses className="text-blue-500" /> : <IoChatbubbleEllipsesOutline />}
                </Link>
                <Link to="/account" className='flex flex-col items-center text-xl sm:text-2xl hover:scale-110 transition-transform'>
                    {tab === "/account" ? <RiAccountCircleFill className="text-blue-500" /> : <RiAccountCircleLine />}
                </Link>
            </div>
        </div>
    );
};

export default NavigationBar;
