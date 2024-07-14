import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

export default function Options() {
  if (
    localStorage.theme === "dark" ||
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  return (
    <div className="relative flex">
      <Sidebar />
      <div className="grid min-h-screen flex-1 grid-rows-[min-content_minmax(0,1fr)_min-content] lg:pl-72">
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}
