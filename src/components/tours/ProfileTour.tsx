'use client'

import { useState, useCallback, useEffect } from 'react'
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride'
import { ShipWheel } from 'lucide-react'
import CustomButton from '@/components/ui/CustomButton'

export default function ProfileTour() {
  const [run, setRun] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const steps: Step[] = [
    {
      target: 'body',
      content: 'Welcome to your Profile page! Here you can view and manage your personal information and settings. Let\'s take a tour.',
      title: 'Profile Tour',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '.profile-image, .profile-image-placeholder',
      content: 'This is your profile image. If you haven\'t uploaded one, you\'ll see a default icon.',
      title: 'Profile Image',
    },
    {
      target: '.profile-display-name',
      content: 'Your display name is shown here. This is how other users will see you on the platform.',
      title: 'Display Name',
    },
    {
      target: '.profile-email',
      content: 'This is the email address associated with your account.',
      title: 'Email Address',
    },
    {
      target: '.profile-identity-settings',
      content: 'In this section, you can set your identity and level, which helps personalize your experience.',
      title: 'Identity Settings',
    },
    {
      target: '.profile-identity-selection',
      content: 'Use these dropdowns to select your identity (e.g., student, teacher) and level (e.g., 3rd grade, high school).',
      title: 'Identity Selection',
    },
    {
      target: '.profile-component',
      content: 'This section contains various profile settings and options. Let\'s explore them in detail.',
      title: 'Profile Component',
    },
    {
      target: '.profile-component-available-credits',
      content: 'Here you can see your available credits and purchase more if needed. Credits are used for various actions on the platform.',
      title: 'Credits Management',
    },
    {
      target: '.profile-component-buy-credits',
      content: 'Click here to purchase more credits. You can buy credits in bundles of 10,000.',
      title: 'Buy Credits',
    },
    {
      target: '.profile-component-keys',
      content: 'In this section, you can input your own API keys for Fireworks and OpenAI. This allows you to use your own resources if preferred.',
      title: 'API Key Management',
    },
    {
      target: '.profile-component-settings',
      content: 'Here you can find additional settings, including the option to delete your account. Please use this option carefully.',
      title: 'Account Settings',
    },
    {
      target: '.profile-component-use-keys-credits',
      content: 'This toggle allows you to choose between using your credits or your own API keys for platform actions.',
      title: 'Usage Preference',
    },
    {
      target: '.profile-payments',
      content: 'In this section, you can view your payment history and manage your subscription details.',
      title: 'Payment Information',
    },
  ]

  const scrollDown = useCallback(() => {
    const container = document.querySelector('.profile')
    if (container && container instanceof HTMLElement) {
      const scrollDownAmount = 200
      container.scrollTo({
        top: container.scrollTop + scrollDownAmount,
        behavior: 'smooth'
      })
    }
  }, [])

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setRun(false)
      setStepIndex(0)
    } else if (type === 'step:after' && index === 6) {
      // Pause the tour after step 3
      setIsPaused(true)
      setRun(false)
      // Scroll down
      scrollDown()
      // Resume the tour after a short delay
      setTimeout(() => {
        setIsPaused(false)
        setRun(true)
        setStepIndex(7)
      }, 100) // Adjust this delay as needed
    } else if (type === 'step:after' && action === 'next') {
      setStepIndex(index + 1)
    }
  }

  useEffect(() => {
    if (isPaused) {
      setRun(false)
    }
  }, [isPaused])

  return (
    <>
      <CustomButton
        className="btn btn-shiny flex items-center bg-secondary-97 border-2 border-primary-40 text-primary-40 rounded-full p-0.5 place-self-center"
        onClick={() => {
          setRun(true)
          setStepIndex(0)
          setIsPaused(false)
        }}
        aria-label="Start Profile Tour"
      >
        <ShipWheel className="size-5 text-primary-40" />
      </CustomButton>
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        hideCloseButton
        run={run && !isPaused}
        scrollToFirstStep={false}
        // disableScrolling={stepIndex !== 6}
        disableOverlayClose
        showProgress
        showSkipButton
        stepIndex={stepIndex}
        steps={steps}
        styles={{
          options: {
            arrowColor: '#e3ffeb',
            backgroundColor: '#e3ffeb',
            primaryColor: '#59ca02',
            textColor: '#004a14',
            width: 300,
            zIndex: 1000,
          },
          tooltipContent: {
            textAlign: 'left',
            padding: '5px'
          },
        }}
      />
    </>
  )
}