"use client";
import { useEffect } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
    children: React.ReactNode,
    navUpdate: boolean;
}

const ProtectedRoute: React.FC<LayoutProps> = ({ children, navUpdate }) => {

    useEffect(() => {
        if (localStorage.getItem('email-notescape') == null) {
            window.location.href = "/SignIn";
        }
    }, []);

    return <>
            <Navbar navUpdate={navUpdate}/>
            <div className="w-full">
                {children}
            </div>
        </>;
};

export default ProtectedRoute;
