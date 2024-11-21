'use client'

import { useState, useCallback, useEffect } from 'react'
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride'
import { ShipWheel } from 'lucide-react'
import CustomButton from '@/components/ui/CustomButton'

export default function RubricBuilderTour() {
  const [run, setRun] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const steps: Step[] = [
    {
      target: 'body',
      content: 'Welcome to the Rubric Builder! This tool allows you to create custom rubrics for your assignments. Let\'s explore its features.',
      title: 'Rubric Builder Tour',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '.rubric-builder-type-selector',
      content: 'Here you can select the type of rubric you want to create. The Analytical rubric is loaded by default.',
      title: 'Rubric Type Selection',
    },
    {
      target: '.rubric-builder-name',
      content: 'Enter a name for your rubric here.',
      title: 'Rubric Name',
    },
    {
      target: '.rubric-builder-description',
      content: 'Provide a brief description of your rubric.',
      title: 'Rubric Description',
    },
    {
      target: '.rubric-builder-create-criterion-section',
      content: 'This is the section where you can create criteria for your rubric.',
      title: 'Create Criterion',
    },
    {
      target: '.rubric-builder-criterion-name',
      content: 'Enter the name of your criterion here.',
      title: 'Criterion Name',
    },
    {
      target: '.rubric-builder-criterion-levels',
      content: 'Define the performance levels for your criterion. For an Analytical rubric, you typically have Excellent, Proficient, Developing, and Beginning levels.',
      title: 'Performance Levels',
    },
    {
      target: '.rubric-builder-add-criterion',
      content: 'Click here to add the criterion to your rubric.',
      title: 'Add Criterion',
    },
    {
      target: '.rubric-builder-saved-criteria',
      content: 'Your saved criteria will appear here. You can edit or delete them as needed.',
      title: 'Saved Criteria',
    },
    {
      target: '.rubric-builder-cancel',
      content: 'You can cancel the rubric creation process by clicking here.',
      title: 'Cancel Rubric',
    },
    {
      target: '.rubric-builder-save',
      content: 'Once you\'re satisfied with your rubric, click here to save it.',
      title: 'Save Rubric',
    },
  ]

  const scrollDown = useCallback(() => {
    const container = document.querySelector('.rubric-builder')
    if (container && container instanceof HTMLElement) {
      const scrollDownAmount = 100
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
    } else if (type === 'step:after' && index === 4) {
      // Pause the tour after step 3
      setIsPaused(true)
      setRun(false)
      // Scroll down
      scrollDown()
      // Resume the tour after a short delay
      setTimeout(() => {
        setIsPaused(false)
        setRun(true)
        setStepIndex(4)
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
        className="absolute left-2 btn btn-shiny flex items-center bg-secondary-97 border-2 border-primary-40 text-primary-40 rounded-full p-0.5 place-self-center"
        onClick={() => {
          setRun(true)
          setStepIndex(0)
          setIsPaused(false)
        }}
        aria-label="Start Rubric Builder Tour"
      >
        <ShipWheel className="size-5 text-primary-40" />
      </CustomButton>
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        hideCloseButton
        run={run && !isPaused}
        scrollToFirstStep={false}
        disableScrolling={stepIndex !== 5}
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