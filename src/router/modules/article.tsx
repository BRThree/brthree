import { Outlet, RouteObject } from "react-router-dom";
import Article from "@/pages/Article/Article.tsx";

const article: RouteObject = {
    path: '/article',
    element: <Outlet />,
    children: [
        {
            index: true,
            element: <Article />
        }
    ]
};

export default article;