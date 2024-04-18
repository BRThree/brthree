import {createBrowserRouter, Outlet, RouteObject, RouterProvider} from "react-router-dom"
import {lazy} from "react"
import Layout from "@/components/Layout/Layout.tsx"
import {AppRouteObject} from "@/types/route.ts";
import modules from "@/router/modules";
import AuthGuard from "@/router/AuthGuard.tsx";

const Home = lazy(() => import('@/pages/Home/Home.tsx'))

const Router = () => {
  const routes: AppRouteObject[] = [
    {
      path: '/',
      element: <AuthGuard><Layout><Outlet/></Layout></AuthGuard>,
      children: [
        // 主页
        {
          index: true,
          element: <Home/>,
        },
        ...modules
      ]
    }
  ]

  const router = createBrowserRouter(routes as RouteObject[])

  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default Router