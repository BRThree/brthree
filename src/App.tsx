// 要留一个APP入口组件，方便抽离组件的公共代码，不在main.tsx中堆逻辑
import Router from "@/router/Router.tsx";
import Live2D from "@/components/Live2D/Live2D.tsx";

const App = () => {
    return (
        <>
            <Router />
            <Live2D />
        </>
    );
};

export default App;
