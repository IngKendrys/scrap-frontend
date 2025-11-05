"use client";
import { useSelector, useDispatch } from "react-redux";

export default function HomePage() {
    const {user} = useSelector((state) => state.auth);
    console.log("User in HomePage:", user);
    const dispatch = useDispatch();
    return (
        <div>
            <h1>Welcome to the Home Page {user.nombre_negocio}</h1>
        </div>
    );

}