'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Joyride, { CallBackProps, STATUS, Placement, Step as JoyrideStep } from 'react-joyride'
import { ShipWheel } from 'lucide-react'
import CustomButton from '@/components/ui/CustomButton'
import { useMobileMenuStore } from '@/zustand/useMobileMenuStore'

interface CustomStep extends JoyrideStep {
  isAvailable?: () => boolean;
  placement?: Placement | 'center' | 'auto' | undefined;
  action?: () => void;
}

export function HomeTour() {
  const [run, setRun] = useState(false)
  const stepsRef = useRef<CustomStep[]>([])
  const { setIsOpen } = useMobileMenuStore()
  const [stepIndex, setStepIndex] = useState(0)

  const isElementVisible = (el: Element) => {
    const style = window.getComputedStyle(el)
    const rect = el.getBoundingClientRect()
    return style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0' &&
      rect.width > 0 &&
      rect.height > 0 &&
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0
  }

  const getVisibleTarget = (desktopSelector: string, mobileSelector: string) => {
    const desktopElement = document.querySelector(desktopSelector)
    const mobileElement = document.querySelector(mobileSelector)

    if (desktopElement && isElementVisible(desktopElement)) {
      return desktopSelector
    } else if (mobileElement && isElementVisible(mobileElement)) {
      return mobileSelector
    }

    return `${desktopSelector}, ${mobileSelector}`
  }

  const updateSteps = useCallback(() => {
    const newSteps: CustomStep[] = [

      {
        target: 'body',
        content: 'Welcome to Grade.me! You will find tour buttons like this throughout the app. Use them to help you learn your way around. Let\'s look at the main features.',
        title: 'Welcome!',
        placement: 'center' as Placement,
        disableBeacon: true,
      },
      {
        target: '.back-button',
        content: 'You can use this button to go back to the previous page.',
        title: 'Back Button',
        placement: 'auto' as Placement,
      },
      {
        target: '.rubrics-link-desktop, .rubrics-link-mobile',
        content: 'Start by selecting a rubric for your assignment.',
        title: 'Rubrics',
        placement: 'auto' as Placement,
      },
      {
        target: '.grader-link-desktop, .grader-link-mobile',
        content: 'After selecting a rubric, you can submit your assignment here.',
        title: 'Grader',
        placement: 'auto' as Placement,
      },
      {
        target: '.assignments-link-desktop, .assignments-link-mobile',
        content: 'View your graded assignments here.',
        title: 'Assignments',
        placement: 'auto' as Placement,
      },
      {
        target: '.forward-button',
        content: 'You can use this button to go to the next page you were just viewing.',
        title: 'Forward Button',
        placement: 'auto' as Placement,
      },
      {
        target: '.mobile-menu',
        content: 'Access your profile settings and other info here.',
        title: 'Mobile Menu',
        placement: 'auto' as Placement,
        action: () => setIsOpen(true),
      },
      {
        target: '.profile-link-desktop, .profile-link-mobile',
        content: 'Update your profile settings here.',
        title: 'Profile',
        placement: 'auto' as Placement,
      },
      {
        target: '.mobile-menu-about',
        content: 'This is the About page.',
        title: 'About',
        placement: 'auto' as Placement,
      },
      {
        target: '.mobile-menu-support',
        content: 'You can request support here.',
        title: 'Support',
        placement: 'auto' as Placement
      },
      {
        target: '.mobile-menu-terms',
        content: 'View the terms of service here.',
        title: 'Terms',
        placement: 'auto' as Placement
      },
      {
        target: '.mobile-menu-privacy',
        content: 'View the privacy policy here.',
        title: 'Privacy',
        placement: 'auto' as Placement
      },
      {
        target: '.mobile-menu-logout',
        content: 'Logout of your account here.',
        title: 'Logout',
        placement: 'auto' as Placement
      }
    ].map((step, index) => ({
      ...step,
      isAvailable: () => {
        if (index === 0) return true;
        const targets = (step.target as string).split(',').map(t => t.trim())
        const elements = targets.map(t => document.querySelector(t)).filter(Boolean)

        const isVisible = elements.some(el => el && isElementVisible(el))

        console.log(`Step ${index} (${step.title}) availability:`, isVisible, 'Elements:', elements)
        if (!isVisible) {
          console.log(`Step ${index} elements details:`, elements.map(el => ({
            classList: el?.classList,
            style: el ? window.getComputedStyle(el) : null,
            rect: el?.getBoundingClientRect()
          })))
        }
        return isVisible
      },
    }))

    stepsRef.current = newSteps
  }, [setIsOpen])

  useEffect(() => {
    updateSteps()
    const handleResize = () => {
      updateSteps()
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [updateSteps])

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index, action } = data
    console.log('Joyride callback:', { status, type, index, action })

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      console.log('Tour finished or skipped')
      setRun(false)
      setIsOpen(false) // Close the mobile menu when the tour ends
      setStepIndex(0)
    } else if (type === 'step:before') {
      console.log('Before step:', index)
      const currentStep = stepsRef.current[index]
      if (currentStep.action) {
        currentStep.action()
      }
    } else if (type === 'step:after') {
      console.log('After step:', index)
      if (action === 'next' && index < stepsRef.current.length - 1) {
        const nextStepIndex = index + 1
        setStepIndex(nextStepIndex)
        console.log('Next step index:', nextStepIndex)
        if (stepsRef.current[nextStepIndex] && !stepsRef.current[nextStepIndex].isAvailable?.()) {
          console.log(`Step ${nextStepIndex} not available, waiting...`)
          return
        }
      } else if (index === stepsRef.current.length - 1) {
        console.log('Last step completed')
        setRun(false)
        setIsOpen(false)
        setStepIndex(0)
      }
    }
  }

  return (
    <>
      <CustomButton
        className="btn btn-shiny flex items-center bg-secondary-97 border-2 border-primary-40 text-primary-40 rounded-full p-1.5 place-self-center"
        onClick={() => {
          setRun(true)
          setStepIndex(0)
        }}
        aria-label="Start Home Tour"
      >
        <ShipWheel className="size-8 text-primary-40" /> <span className='text-xl'>Home Tour</span>
      </CustomButton>
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        hideCloseButton
        run={run}
        scrollToFirstStep
        showProgress
        showSkipButton
        stepIndex={stepIndex}
        steps={stepsRef.current.map(step => ({
          ...step,
          target: typeof step.target === 'string' && step.target.includes(',')
            ? getVisibleTarget(...(step.target.split(',').map(s => s.trim()) as [string, string]))
            : step.target
        }))}
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