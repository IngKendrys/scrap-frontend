"use client";
import { useSelector } from "react-redux";

export default function HomePage() {
    const {user} = useSelector((state) => state.auth);
    return (
        <div>
            <h1>Welcome to the Home Page {user?.nombre_negocio}</h1>
        </div>
    );
}