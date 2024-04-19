import {PropsWithChildren, useCallback, useEffect} from 'react';
import { useRouter } from '@/hooks/useRouter.ts';

const WHITE_LIST = ['/login', '/home'];

export default function AuthGuard({ children }: PropsWithChildren) {
  const router = useRouter();
  const check = useCallback(() => {
    // 白名单放行
    if (WHITE_LIST.includes(router.getPathname())) return
    // TODO 检查TOKEN拉起登录提示弹窗
  }, [router]);

  useEffect(() => {
    check();
  }, [check]);

  return children;
}
