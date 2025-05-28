import IsAuthenticated from '@/auth/IsAuthenticated';
import { RootState } from '@/store/store';
import { login, logout } from '@/store/userSlice';
import { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import ContentShimmer from './loaders/shimmers/ContentShimmer';
import AuthShimmer from './loaders/shimmers/AuthShimmer';
import ChatShimmer from './loaders/shimmers/ChatShimmer';

type Props = {
  children: ReactNode;
  isProtected: boolean;
};

function ProtectRoutes({ children, isProtected }: Props) {
  const user = useSelector((store: RootState) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      setLoading(true);

      const res = await IsAuthenticated();

      if (res?.status === 'success') {
        dispatch(login(res?.user));
      } else {
        dispatch(logout());
      }

      setAuthChecked(true);
      setLoading(false);
    };

    checkAuthentication();
  }, [dispatch]);

  useEffect(() => {
    if (authChecked && isProtected && !user.status && location.pathname !== '/auth') {
      navigate('/auth');
    }
  }, [authChecked, user.status, isProtected, navigate, location.pathname]);


  if (isProtected && loading) {
    if (location.pathname.startsWith('/conversations')) {
      return <ChatShimmer />;
    }

    if (location.pathname === '/auth') {
      return <AuthShimmer />;
    }

    return <ContentShimmer />;
  }

  return <>{children}</>;
}

export default ProtectRoutes;
