"use client";
import { useEffect } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<LayoutProps> = ({ children }) => {

    useEffect(() => {
        if (localStorage.getItem('email-notescape') == null) {
            window.location.href = "/SignIn";
        }
    }, []);

    return <>
            <Navbar />
            <div className="w-full">
                {children}
            </div>
        </>;
};

export default ProtectedRoute;
