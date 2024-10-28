import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkUser } from "./Store/userSlice";
import { Toaster } from "@/components/ui/toaster";
import "./cursor.css"
function App() {

  const { isAuthenticated, isProfileSetup, isLoading, user } = useSelector((state) => state.userData);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(checkUser());
  },[dispatch])

  useEffect(() => {
    // Select the elements with the classes .cursor and .cursor2 respectively.
    const cursor = document.querySelector(".cursor");
    const cursor2 = document.querySelector(".cursor2");

    // style.cssText is used to set the CSS text of the style attribute. handleMouseMove is a function that updates the left and top CSS properties of both cursor and cursor2 to the current mouse coordinates (e.clientX and e.clientY).
    const handleMouseMove = (e) => {
      cursor.style.cssText = cursor2.style.cssText = `left: ${e.clientX}px; top: ${e.clientY}px;`;
    };

    // Adds and Remove the large className when the mouse enters an element.
    const handleMouseEnter = () => {
      cursor2.classList.add("large");
    };
    const handleMouseLeave = () => {
      cursor2.classList.remove("large");
    };

    // An event listener for mousemove is added to the document,
    document.addEventListener("mousemove", handleMouseMove);
    // pointerElements selects all <a> and <button> elements
    const pointerElements = document.querySelectorAll("a, button");
    pointerElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    // Cleanup Function This prevents memory leaks and ensures that no unnecessary event listeners remain when the component is no longer in use.
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      pointerElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);


  return  (
    <>
      <div className="cursor"></div>
      <div className="cursor2"></div>
      <Toaster />
      <Outlet/>
    </>
  );
}

export default App;