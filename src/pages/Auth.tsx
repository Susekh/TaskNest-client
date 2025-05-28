import SignInForm from '@/components/SignInForm';
import SignUpForm from '@/components/SignUpForm';
import { RootState } from '@/store/store';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Auth() {
  const user = useSelector((store: RootState) => store.user);
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);

  useEffect(() => {
    if(user.status) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <>
      <div className='flex items-center justify-center lg:p-12 p-4 dark:bg-neutral-800'>
        <div className='border-2 dark:border-none shadow-lg rounded-lg pt-8 pb-8 pl-12 pr-12 lg:w-96 md:w-3/5 w-10/12 bg-white dark:bg-neutral-900'>
          {isSignIn? <SignInForm setIsSignIn={setIsSignIn}/> : <SignUpForm setIsSignIn={setIsSignIn}/>}
        </div>
      </div>
    </>
  )
}

export default Auth