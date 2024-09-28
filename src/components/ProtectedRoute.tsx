"use client";
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
    title: string,
    children: React.ReactNode,
    navUpdate: boolean,
    isFavorite?: boolean,
    threedots?: boolean,
    onFavoriteToggle: () => void;
    onDeleteClick: () => void;
}

const ProtectedRoute: React.FC<LayoutProps> = ({ children, navUpdate, onDeleteClick, onFavoriteToggle, title, isFavorite, threedots}) => {

    const sidebar: boolean = localStorage.getItem('notescape-sidebar') === "false" && window.innerWidth > 1024 ? true : false;

    useEffect(() => {
        if (localStorage.getItem('email-notescape') == null) {
            window.location.href = "/SignIn";
        }
    }, []);

    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(sidebar);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        localStorage.setItem('notescape-sidebar', JSON.stringify(isSidebarOpen));
    };

    return <div className='bg-secondary flex w-full h-screen'>
            <Sidebar navUpdate={navUpdate} sidebar={isSidebarOpen} toggleSidebar={toggleSidebar}/>
            <div className="w-full flex flex-col overflow-hidden items-center bg-background shadow rounded-xl m-3">
                <Header onDeleteClick={onDeleteClick} onFavoriteToggle={onFavoriteToggle} sidebar={!sidebar} toggleSidebar={toggleSidebar} title={title} isFavorite={isFavorite} threedots={threedots}/>
                {children}
            </div>
            </div>;
};

export default ProtectedRoute;
