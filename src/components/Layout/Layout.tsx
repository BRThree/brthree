import {PropsWithChildren} from "react";
import Header from "./Header.tsx";

const Layout = (props: PropsWithChildren) => {
  const { children } = props;

  return (
    <div className={'flex flex-col h-screen'}>
      <header className={'h-fit flex-shrink-0'}>
        <Header/>
      </header>
      <main className={'flex-1'}>{children}</main>
      <footer className={'size-fit flex-shrink-0'}></footer>
    </div>
  );
}

export default Layout