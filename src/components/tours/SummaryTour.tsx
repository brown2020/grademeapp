'use client'

import { useState, useCallback } from 'react'
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride'
import { ShipWheel } from 'lucide-react'
import CustomButton from '@/components/ui/CustomButton'

export default function SummaryTour() {
  const [run, setRun] = useState(false)

  const steps: Step[] = [
    {
      target: 'body',
      content: 'Welcome to the Summary page! This page shows details about your assignment submission and feedback. Let\'s take a tour of the main features.',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '.summary-title',
      content: 'This is the title of your assignment.',
      placement: 'bottom',
    },
    {
      target: '.summary-topic',
      content: 'Here you can see or set the topic of your assignment.',
      placement: 'bottom',
    },
    {
      target: '.summary-download-original',
      content: 'Click here to download your original submission file.',
      placement: 'top',
    },
    {
      target: '.summary-rubric',
      content: 'This section displays the rubric used to grade your assignment.',
      placement: 'bottom',
    },
    {
      target: '.summary-submissions',
      content: 'Here you can see all your submissions for this assignment. Click on each submission to view details.',
      placement: 'top',
    },
    {
      target: '.summary-submission-item',
      content: 'Each submission shows the date, grade, and options to view details or revise your work.',
      placement: 'bottom',
    },
    {
      target: '.summary-revise-edit',
      content: 'Click here to revise and edit your submission.',
      placement: 'left',
    },
  ]

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { status } = data
    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setRun(false)
    }
  }, [])

  return (
    <>
      <CustomButton
        className="btn btn-shiny flex items-center bg-secondary-97 border-2 border-primary-40 text-primary-40 rounded-full p-0.5 place-self-center"
        onClick={() => setRun(true)}
        aria-label="Start Summary Tour"
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