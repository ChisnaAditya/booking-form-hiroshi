import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import FormEmail from "./FormEmail";

function App() {
  const myRouter = createBrowserRouter([
    {
      path: "/",
      element: <FormEmail />,
    },
  ]);
  return (
    <>
      <RouterProvider router={myRouter} />
    </>
  );
}

export default App;
