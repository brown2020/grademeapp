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
  const [isMobile, setIsMobile] = useState(false)
  const stepsRef = useRef<CustomStep[]>([])
  const { setIsOpen } = useMobileMenuStore()
  const [stepIndex, setStepIndex] = useState(0)

  const isElementVisible = (el: Element | null) => {
    if (!el) return false;
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

  const mobileSteps: CustomStep[] = [
    {
      target: 'body',
      content: 'Welcome to Grade.me! Let\'s take a tour of the mobile interface.',
      title: 'Welcome!',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '.grademe-link-desktop',
      content: 'This is the main Grade.me logo. Click it to return to the home page.',
      title: 'Home',
      placement: 'bottom',
    },
    {
      target: '.back-button-mobile',
      content: 'Use this button to go back to the previous page.',
      title: 'Back Button',
      placement: 'auto',
    },
    {
      target: '.rubrics-link-mobile',
      content: 'Start by selecting a rubric for your assignment.',
      title: 'Rubrics',
      placement: 'auto',
    },
    {
      target: '.grader-link-mobile',
      content: 'After selecting a rubric, you can submit your assignment here.',
      title: 'Grader',
      placement: 'auto',
    },
    {
      target: '.assignments-link-mobile',
      content: 'View your graded assignments here.',
      title: 'Assignments',
      placement: 'auto',
    },
    {
      target: '.forward-button-mobile',
      content: 'Use this button to go to the next page you were just viewing.',
      title: 'Forward Button',
      placement: 'auto',
    },
    {
      target: '.mobile-menu',
      content: 'Access your profile settings and other info here.',
      title: 'Mobile Menu',
      placement: 'auto',
      action: () => setIsOpen(true),
    },
    {
      target: '.profile-link-mobile',
      content: 'Update your profile settings here.',
      title: 'Profile',
      placement: 'auto',
    },
    {
      target: '.mobile-menu-about',
      content: 'This is the About page.',
      title: 'About',
      placement: 'auto',
    },
    {
      target: '.mobile-menu-support',
      content: 'You can request support here.',
      title: 'Support',
      placement: 'auto'
    },
    {
      target: '.mobile-menu-terms',
      content: 'View the terms of service here.',
      title: 'Terms',
      placement: 'auto'
    },
    {
      target: '.mobile-menu-privacy',
      content: 'View the privacy policy here.',
      title: 'Privacy',
      placement: 'auto'
    },
    {
      target: '.mobile-menu-logout',
      content: 'Logout of your account here.',
      title: 'Logout',
      placement: 'auto'
    }
  ]

  const desktopSteps: CustomStep[] = [
    {
      target: 'body',
      content: 'Welcome to Grade.me! Let\'s take a tour of the desktop interface.',
      title: 'Welcome!',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '.grademe-link-desktop',
      content: 'This is the main Grade.me logo. Click it to return to the home page.',
      title: 'Home',
      placement: 'bottom',
    },
    {
      target: '.rubrics-link-desktop',
      content: 'Start by selecting a rubric for your assignment.',
      title: 'Rubrics',
      placement: 'bottom',
    },
    {
      target: '.grader-link-desktop',
      content: 'After selecting a rubric, you can submit your assignment here.',
      title: 'Grader',
      placement: 'bottom',
    },
    {
      target: '.assignments-link-desktop',
      content: 'View your graded assignments here.',
      title: 'Assignments',
      placement: 'bottom',
    },
    {
      target: '.profile-link-desktop',
      content: 'Update your profile settings and access other options here.',
      title: 'Profile',
      placement: 'bottom',
    }
  ]

  const updateSteps = useCallback(() => {
    const steps = isMobile ? mobileSteps : desktopSteps;
    stepsRef.current = steps.map((step, index) => ({
      ...step,
      isAvailable: () => {
        if (index === 0) return true;
        const el = document.querySelector(step.target as string);
        return isElementVisible(el);
      },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, setIsOpen])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    updateSteps();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateSteps]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index, action } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      console.log('Tour finished or skipped');
      setRun(false);
      setIsOpen(false);
      setStepIndex(0);
    } else if (type === 'step:before') {
      const currentStep = stepsRef.current[index];
      if (currentStep.action) {
        currentStep.action();
      }
    } else if (type === 'step:after') {
      if (action === 'next' && index < stepsRef.current.length - 1) {
        setStepIndex(index + 1);
      } else if (index === stepsRef.current.length - 1) {
        setRun(false);
        setIsOpen(false);
        setStepIndex(0);
      }
    }
  }

  return (
    <>
      <CustomButton
        className="btn btn-shiny flex items-center bg-secondary-97 border-2 border-primary-40 text-primary-40 rounded-full p-1.5 place-self-center"
        onClick={() => {
          setRun(true);
          setStepIndex(0);
          updateSteps();
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
        steps={stepsRef.current}
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

