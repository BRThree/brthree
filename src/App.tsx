 // 要留一个APP入口组件，方便抽离组件的公共代码，不在main.tsx中堆逻辑、
// 并且在添加全局的导航栏时，可以有很棒的开发体验
import Layout from "./components/Layout/Layout.tsx";

 const App = () => {
   return (
    <Layout>
    </Layout>
  )
}

export default App
