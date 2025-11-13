"use client";
import { use } from "react";
import toast, { Toaster } from "react-hot-toast";

const notify = () => toast.success("Here is your toast.");

const App = () => {
  return (
    <div>
      <button className="bg-red-500 mt-160" onClick={notify}>
        Make me a toast
      </button>
      <Toaster />
    </div>
  );
};

export default App;
