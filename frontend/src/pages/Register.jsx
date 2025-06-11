import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [file, setFile] = useState("");
    const [filePrev, setFilePrev] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            console.log("Sending OTP request for email:", email); // Debug log

            // Send OTP to user's email
            const { data } = await axios.post('/api/auth/send-otp', { email });
            console.log("OTP response:", data); // Debug log
            toast.success(data.message || "OTP sent to your email");

            // Save form data to localStorage temporarily
            const formDataToStore = {
                name,
                email,
                password,
                gender,
            };

            sessionStorage.setItem("registerData", JSON.stringify(formDataToStore));
            sessionStorage.setItem("profileImage", filePrev);

            navigate("/verify-otp");
        } catch (error) {
            console.error("Error in submitHandler:", error.response || error); // Debug log
            toast.error(error?.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    }

    const changeFileHandler = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setFilePrev(reader.result);
            setFile(file);
        }
    }

    return (
        <>
            {
                loading ? <h1>Loading....</h1> :
                    <div className="flex justify-center items-center min-h-screen px-4 py-8">
                        <div className="flex flex-col justify-center items-center md:flex-row shadow-lg rounded-xl w-full max-w-4xl bg-white overflow-hidden">
                            <div className="w-full md:w-3/4 p-4 sm:p-6 md:p-8">
                                <div className="text-center mb-6 md:mb-8">
                                    <h1 className="font-semibold text-2xl sm:text-3xl text-gray-700">
                                        Create Your Account
                                    </h1>
                                </div>

                                <form onSubmit={submitHandler} className="w-full max-w-sm mx-auto">
                                    <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                                        {filePrev && (
                                            <div className="relative group">
                                                <img 
                                                    src={filePrev} 
                                                    alt="profile preview" 
                                                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-gray-300 shadow-md transition-transform duration-200 group-hover:scale-105" 
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <span className="text-white text-xs">Change Photo</span>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="w-full">
                                            <input 
                                                type="file" 
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                                                required 
                                                onChange={changeFileHandler} 
                                                accept='image/*' 
                                            />
                                        </div>

                                        <input 
                                            type="text" 
                                            placeholder="Full Name" 
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base" 
                                            required 
                                            value={name} 
                                            onChange={e => setName(e.target.value)} 
                                        />

                                        <input 
                                            type="email" 
                                            placeholder="Email Address" 
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base" 
                                            required 
                                            value={email} 
                                            onChange={e => setEmail(e.target.value)} 
                                        />

                                        <input 
                                            type="password" 
                                            placeholder="Password" 
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base" 
                                            required 
                                            value={password} 
                                            onChange={e => setPassword(e.target.value)} 
                                        />

                                        <select 
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-white" 
                                            value={gender} 
                                            onChange={e => setGender(e.target.value)}
                                            required
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>

                                        <button 
                                            type="submit"
                                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 text-sm sm:text-base mt-2"
                                        >
                                            Send OTP
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="w-full md:w-1/3 bg-gradient-to-l from-blue-400 to-yellow-400 p-6 sm:p-8 flex items-center justify-center">
                                <div className="text-white text-center space-y-4">
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Already have an account?</h1>
                                    <p className="text-sm sm:text-base">Welcome back!</p>
                                    <Link 
                                        to="/login" 
                                        className="inline-block bg-white text-blue-500 font-medium px-6 py-2 rounded-full hover:bg-gray-100 transition duration-200 text-sm sm:text-base"
                                    >
                                        Login Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default Register;
