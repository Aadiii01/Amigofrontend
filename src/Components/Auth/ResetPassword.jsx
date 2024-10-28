import React from 'react'
import { Link } from 'react-router-dom'
import SmallFooter from './SmallFooter'
import { Button } from "@/Components/ui/button"
import { Logo } from '@/Utils/Data'
import ResetPassForm from './ResetPassForm'
import "../../Styles/CreateAccount.css"

const ResetPassword = () => {
  return (
    <div className='basicLayout notMobile modernInApp hasLargeTypography signupSimplicity-registration simplicity'>
    <div className='nfHeader noBorderHeader signupBasicHeader onboarding-header'>
      <Link className='svg-nfLogo signupBasicHeader onboarding-header'>
        <img className='svg-icon svg-icon-netflix-logo' src={Logo}/>
      </Link>
      <Link className='authLinks signupBasicHeader onboarding-header]'>
      <Button className="h-[30px] sm:h-[40px] border-1 border-solid border-white bg-[#e50914] hover:bg-[#e64e4e] font-[NetflixR]">Sign In</Button>
      </Link>
    </div>
    <div className='simpleContainer gradd'>
      <div className='centerContainer'>
        <ResetPassForm/>
      </div>
    </div>
    <SmallFooter colorfooter={"bg-[#f3f3f3]"} coptextcol={"text-black"} acol={"text-[#888]"}  hacol={"hover:text-[#111]"}/>
  </div>
  )
}

export default ResetPassword