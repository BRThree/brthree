import { PropsWithChildren } from "react";

const Page = ({ children }: PropsWithChildren) => (
    <div className={'p-3'}>{children}</div>
);

export default Page;