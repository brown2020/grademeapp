'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Joyride, { CallBackProps, STATUS, Placement, Step as JoyrideStep } from 'react-joyride'
import { ShipWheel } from 'lucide-react'
import CustomButton from '@/components/ui/CustomButton'

interface CustomStep extends JoyrideStep {
  isAvailable?: () => boolean;
  placement?: Placement | 'center' | 'auto' | undefined;
}

export default function RubricHelperTour() {
  const [run, setRun] = useState(false)
  const stepsRef = useRef<CustomStep[]>([])

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
        content: 'Welcome to the Rubric Helper! This tool helps you provide detailed information about your assignment to select the most appropriate rubric. Let\'s explore its features.',
        title: 'Rubric Helper Tour',
        placement: 'center' as Placement,
        disableBeacon: true,
      },
      {
        target: '.rubric-helper-identity-level',
        content: 'Select your grade or level of experience here.',
        title: 'Identity Level',
        placement: 'bottom' as Placement,
      },
      {
        target: '.rubric-helper-identity',
        content: 'Choose your role (e.g., student, teacher) here.',
        title: 'Identity',
        placement: 'bottom' as Placement,
      },
      {
        target: '.rubric-helper-assigner',
        content: 'Select who assigned the task to you.',
        title: 'Assigner',
        placement: 'bottom' as Placement,
      },
      {
        target: '.rubric-helper-action',
        content: 'Choose the type of assignment you\'re working on.',
        title: 'Assignment Type',
        placement: 'bottom' as Placement,
      },
      {
        target: '.rubric-helper-assignment-topic',
        content: 'Enter the topic of your assignment here.',
        title: 'Assignment Topic',
        placement: 'top' as Placement,
      },
      {
        target: '.rubric-helper-text-type',
        content: 'Select the specific type of text you\'re writing.',
        title: 'Text Type',
        placement: 'bottom' as Placement,
      },
      {
        target: '.rubric-helper-audience',
        content: 'Choose the intended audience for your assignment.',
        title: 'Audience',
        placement: 'bottom' as Placement,
      },
      {
        target: '.rubric-helper-word-limit',
        content: 'Set the word limit for your assignment here.',
        title: 'Word Limit',
        placement: 'top' as Placement,
      },
      {
        target: '.rubric-helper-done',
        content: 'Click here when you\'re finished setting up your assignment details.',
        title: 'Finish',
        placement: 'bottom' as Placement,
      },
      {
        target: '.rubric-helper-reset',
        content: 'Use this button to clear all fields and start over.',
        title: 'Reset',
        placement: 'bottom' as Placement,
      },
    ].map((step, index) => ({
      ...step,
      isAvailable: () => {
        if (index === 0) return true; // Always make the welcome step available
        const targets = (step.target as string).split(',').map(t => t.trim())
        const elements = targets.map(t => document.querySelector(t)).filter(Boolean)

        const isVisible = elements.some(el => el && isElementVisible(el))

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
  }, [])

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
    const { status, type, index } = data
    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setRun(false)
    } else if (type === 'step:after') {
      const nextStepIndex = index + 1
      if (stepsRef.current[nextStepIndex] && !stepsRef.current[nextStepIndex].isAvailable?.()) {
        console.log(`Step ${nextStepIndex} not available, waiting...`)
        return
      }
    }
  }

  return (
    <>
      <CustomButton
        className="btn btn-shiny absolute top-2 left-2 flex items-center bg-secondary-97 border-2 border-primary-40 text-primary-40 rounded-full p-0.5 place-self-center"
        onClick={() => setRun(true)}
        aria-label="Start Rubric Helper Tour"
      >
        <ShipWheel className="size-5 text-primary-40" />
      </CustomButton>
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        hideCloseButton
        run={run}
        scrollToFirstStep
        showProgress
        showSkipButton
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