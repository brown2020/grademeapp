'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Joyride, { CallBackProps, STATUS, Placement, Step as JoyrideStep } from 'react-joyride'
import { ShipWheel } from 'lucide-react'
import CustomButton from '@/components/ui/CustomButton'

interface CustomStep extends JoyrideStep {
  isAvailable?: () => boolean;
  placement?: Placement | 'center' | 'auto' | undefined;
}

export default function RubricsTour() {
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
        content: 'Welcome to the Rubrics page! Here you can select or search for rubrics to use for your assignments. Let\'s explore the main features.',
        title: 'Rubrics Tour',
        placement: 'center' as Placement,
        disableBeacon: true,
      },
      {
        target: '.rubric-selected',
        content: 'This is the currently selected rubric.',
        title: 'Selected Rubric',
        placement: 'auto' as Placement,
      },
      {
        target: '.rubric-criteria',
        content: 'These are the criteria for the rubric. The criteria are used to evaluate the assignment.',
        title: 'Rubric Criteria',
        placement: 'auto' as Placement,
      },
      {
        target: '.rubric-helper',
        content: 'The Rubric Helper assists you in choosing the right rubric and gives extra info to Grade.me for better grading.',
        title: 'Rubric Helper',
        placement: 'auto' as Placement,
      },
      {
        target: '.rubric-builder',
        content: 'The Rubric Builder lets you create custom rubrics for your assignments.',
        title: 'Rubric Builder',
        placement: 'auto' as Placement,
      },
      {
        target: '.rubric-search',
        content: 'Search for a rubric.',
        title: 'Search and Select',
        placement: 'top' as Placement,
      },
      {
        target: '.rubric-search-select',
        content: 'Select a rubric from the search results. You can scroll through the list and click on a rubric to select it. Click the star on the left to add it to your favorites.',
        title: 'Search and Select',
        placement: 'top' as Placement,
      }

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
        aria-label="Start Rubrics Tour"
      >
        <ShipWheel className="size-5 text-primary-40" />
        {/* <span className='text-xl'>Rubrics Tour</span> */}
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
        floaterProps={{
          disableAnimation: true,
        }}
      />
    </>
  )
}