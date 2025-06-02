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
        <div className='fixed bottom-0 w-full bg-white py-3'>
            <div className="flex justify-around">
                <Link to="/" className='flex flex-col items-center text-2xl'>
                    {tab === "/" ? <AiFillHome /> : <AiOutlineHome />}
                </Link>
                <Link to="/reels" className='flex flex-col items-center text-2xl'>
                    {tab === "/reels" ? <BsFillCameraReelsFill /> : <BsCameraReels />}
                </Link>
                <Link to="/search" className='flex flex-col items-center text-2xl'>
                    {tab === "/search" ? <IoSearchCircle /> : <IoSearchCircleOutline />}
                </Link>
                <Link to="/chat" className='flex flex-col items-center text-2xl'>
                    {tab === "/chat" ? <IoChatbubbleEllipses /> : <IoChatbubbleEllipsesOutline />}
                </Link>
                <Link to="/account" className='flex flex-col items-center text-2xl'>
                    {tab === "/account" ? <RiAccountCircleFill /> : <RiAccountCircleLine />}
                </Link>
            </div>
        </div>
    );
};

export default NavigationBar;
