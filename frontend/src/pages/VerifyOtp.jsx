import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UserData } from '../context/UserContext';
import { FaEnvelope, FaSpinner } from 'react-icons/fa';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser, setIsAuth } = UserData();

    const handleVerify = async () => {
        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        setIsLoading(true);
        const data = JSON.parse(sessionStorage.getItem("registerData"));
        const profileImage = sessionStorage.getItem("profileImage");
        
        try {
            // First verify OTP
            const response = await axios.post("/api/auth/verify-otp", { 
                email: data.email, 
                otp: Number(otp)
            });

            // Convert base64 image to file
            const base64Response = await fetch(profileImage);
            const blob = await base64Response.blob();
            const file = new File([blob], "profile.jpg", { type: "image/jpeg" });

            // Create FormData with all fields including the file
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => formData.append(key, value));
            formData.append("file", file);

            // Register user with complete data
            const registerResponse = await axios.post("/api/auth/register", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            // Clear session storage
            sessionStorage.removeItem("registerData");
            sessionStorage.removeItem("profileImage");
            
            // Set authentication state and user data
            setUser(registerResponse.data.user);
            setIsAuth(true);
            
            toast.success("Welcome to Connectify! Your account has been created successfully.");
            navigate("/");
        } catch (err) {
            console.error("OTP verification error:", err.response?.data || err);
            toast.error(err.response?.data?.message || "Invalid OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <div className="flex justify-center">
                        <FaEnvelope className="h-12 w-12 text-blue-500" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Verify Your Email
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        We've sent a 6-digit verification code to your email address. 
                        Please enter it below to complete your registration.
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="otp" className="sr-only">Enter OTP</label>
                        <input
                            id="otp"
                            type="text"
                            maxLength="6"
                            value={otp}
                            onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="Enter 6-digit OTP"
                            className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        />
                    </div>

                    <div>
                        <button
                            onClick={handleVerify}
                            disabled={isLoading || otp.length !== 6}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                                isLoading || otp.length !== 6 
                                ? 'bg-blue-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                    Verifying...
                                </>
                            ) : (
                                'Verify OTP'
                            )}
                        </button>
                    </div>

                    <div className="text-center text-sm text-gray-600">
                        <p>Didn't receive the code?</p>
                        <button 
                            onClick={() => toast.success('A new OTP has been sent to your email')}
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Resend OTP
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
