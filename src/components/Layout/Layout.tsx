import {PropsWithChildren} from "react";

const Layout = (props: PropsWithChildren) => {
  const { children } = props;

  return (
    <div className={'flex flex-col h-screen'}>
      <header className={'flex-shrink-0'}></header>
      <main className={'flex-1'}>{children}</main>
      <footer className={'flex-shrink-0'}></footer>
    </div>
  );
}

export default Layout