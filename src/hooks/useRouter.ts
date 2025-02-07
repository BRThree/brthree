import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useRouter() {
    const navigate = useNavigate();
    const location = useLocation();

    return useMemo(
        () => ({
            back: () => navigate(-1),
            forward: () => navigate(1),
            reload: () => window.location.reload(),
            push: (href: string) => navigate(href),
            replace: (href: string) => navigate(href, { replace: true }),
            getPathname: () => location.pathname,
        }),
        [location, navigate]
    );
}
