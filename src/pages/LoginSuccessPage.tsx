import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '@/redux/hooks';
import { handleGoogleCallback } from '@/redux/slices/auth.slice';
import { Loading } from '@/components/Loading';

const LoginSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            dispatch(handleGoogleCallback(token))
                .unwrap()
                .then(() => {
                    navigate('/');
                })
                .catch(() => {
                    navigate('/login');
                });
        } else {
            navigate('/login');
        }
    }, [searchParams, dispatch, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loading />
        </div>
    );
};

export default LoginSuccessPage;
