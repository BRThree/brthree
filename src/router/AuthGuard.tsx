import {PropsWithChildren, useCallback, useEffect} from 'react';
import { useRouter } from '@/hooks/useRouter.ts';

const WHITE_LIST = ['/login'];

export default function AuthGuard({ children }: PropsWithChildren) {
  const router = useRouter();
  const check = useCallback(() => {
    // 白名单放行
    if (WHITE_LIST.includes(router.getPathname())) return
    // TODO 检查TOKEN
  }, [router]);

  useEffect(() => {
    check();
  }, [check]);

  return children;
}
