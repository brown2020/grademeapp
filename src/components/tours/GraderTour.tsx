'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Joyride, { CallBackProps, STATUS, Placement, Step as JoyrideStep } from 'react-joyride'
import { ShipWheel } from 'lucide-react'
import CustomButton from '@/components/ui/CustomButton'

interface CustomStep extends JoyrideStep {
  isAvailable?: () => boolean;
  placement?: Placement | 'center' | 'auto' | undefined;
}

export default function GraderTour() {
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
        content: 'Welcome to the Grader page! Here you can submit your assignments for grading. Let\'s explore the main features.',
        title: 'Grader Tour',
        placement: 'center' as Placement,
        disableBeacon: true,
      },
      {
        target: '.grader-selected-rubric',
        content: 'This shows the currently selected rubric. If you haven\'t chosen one yet, you can click here to go to the Rubrics page.',
        title: 'Selected Rubric',
        placement: 'bottom' as Placement,
      },
      {
        target: '.grader-title',
        content: 'Enter the title of your assignment here.',
        title: 'Assignment Title',
        placement: 'bottom' as Placement,
      },
      {
        target: '.grader-text',
        content: 'This is where you can type or paste your assignment text. You can use the formatting tools provided.',
        title: 'Assignment Text',
        placement: 'top' as Placement,
      },
      {
        target: '.grader-grademe-button',
        content: 'Once you\'ve entered your assignment, click here to submit it for grading.',
        title: 'Grade Me',
        placement: 'top' as Placement,
      },
      {
        target: '.grader-plagiarism-button',
        content: 'Use this button to check your assignment for plagiarism and ai-content.',
        title: 'Plagiarism',
        placement: 'top' as Placement,
      },
      {
        target: '.grader-file-upload',
        content: 'If you prefer, you can upload your assignment as a file. Supported formats include docx, pdf, odt, rtf, and txt.',
        title: 'File Upload',
        placement: 'top' as Placement,
      },
      {
        target: '.grader-reset-button',
        content: 'Use this button to clear the title and text fields if you want to start over.',
        title: 'Reset',
        placement: 'top' as Placement,
      },
      {
        target: '.grader-settings',
        content: 'You can set the topic, assigner, text type, prose type, audience and word limit here. While not required, these settings can help the grader provide more accurate feedback.',
        title: 'Settings',
        placement: 'top' as Placement,
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
        return
      }
    }
  }

  return (
    <>
      <CustomButton
        className="btn btn-shiny flex items-center bg-secondary-97 border-2 border-primary-40 text-primary-40 rounded-full p-0.5 place-self-center"
        onClick={() => setRun(true)}
        aria-label="Start Tools Tour"
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
      // floaterProps={{
      //   disableAnimation: true,
      // }}
      />
    </>
  )
}