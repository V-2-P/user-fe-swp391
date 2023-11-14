import React from 'react'
import LoginPage from './login'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
type HomeProps = object

const Login: React.FC<HomeProps> = () => {
  return (
    <div className=" min-h-screen  lg:min-h-screen flex lg:justify-center lg:p-8 bg-[url('/background.jpg')] bg-[30%] bg-cover bg-no-repeat lg:bg-center">
      <div className='lg:w-[60%]'></div>
      <div className='flex flex-col lg:rounded-xl p-[2%] bg-white bg-opacity-80 shadow-[0_20px_25px_-15px_rgba(0,0,0,0.4)] w-full lg:w-[30%] my-auto'>
        <div className='w-full border-solid border-black'>
          <LoginPage />
        </div>

        <br />

        <div className='w-full text-center space-y-3'>
          <div className='border border-b-2 border-white w-[80%] mx-auto'></div>
          <h1 className='font-semibold text-lg lg:text-xl'> Chưa có tài khoản? </h1>
          <Link to='/register'>
            <Button type='primary' htmlType='submit' className='w-[78%] '>
              Đăng ký ngay
            </Button>
          </Link>
        </div>
      </div>
      <div className='lg:w-[10%]'></div>
    </div>
  )
}

export default Login
