'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Joyride, { ACTIONS, CallBackProps, EVENTS, Events, STATUS, Step as JoyrideStep, Placement } from 'react-joyride'
import { usePathname } from 'next/navigation'
import CustomButton from '@/components/ui/CustomButton'

interface Step extends JoyrideStep {
  isAvailable?: () => boolean;
  placement?: Placement | 'center' | 'auto' | undefined;
}

export default function TourGuide() {
  const [rubricHelperOpen, setRubricHelperOpen] = useState(false)
  const [{ run, stepIndex }, setState] = useState({
    run: false,
    stepIndex: 0,
  })
  const stepsRef = useRef<Step[]>([])

  const pathname = usePathname()

  const checkRubricHelperOpen = useCallback(() => {
    const rubricHelperElement = document.querySelector('.rubric-helper-modal')
    const isOpen = rubricHelperElement?.classList.contains('rubric-helper-open')
    console.log('Checking RubricHelper open:', isOpen, rubricHelperElement?.classList)
    setRubricHelperOpen(!!isOpen)
  }, [])

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

  const updateSteps = useCallback(() => {
    const newSteps: Step[] = [
      {
        target: '.rubrics-link-desktop, .rubrics-link-mobile',
        content: 'Start by selecting a rubric for your assignment.',
        title: 'Select Rubric',
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
        hideFooter: true,
        placement: 'auto' as Placement,
        spotlightClicks: true,
      },
      {
        target: '.rubric-helper',
        content: 'The Rubric Helper helps you choose the right rubric. Click to open it now.',
        title: 'Rubric Helper',
        placement: 'auto' as Placement,
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
        hideFooter: true,
        spotlightClicks: true,
      },
      {
        target: '.rubric-helper-identity',
        content: 'Are you a student, a teacher, etc?',
        title: 'User Type',
        placement: 'top' as Placement,
        disableOverlay: true,
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: '.rubric-helper-identity-level',
        content: 'What is your grade or level of experience?',
        title: 'Level of Experience',
        placement: 'top' as Placement,
        disableOverlay: true,
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: '.rubric-helper-assigner',
        content: 'Who gave you the assignment?',
        title: 'Assigner',
        placement: 'top' as Placement,
        disableOverlay: true,
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: '.rubric-helper-action',
        content: 'What were you asked to do?',
        title: 'Action',
        placement: 'top' as Placement,
        disableOverlay: true,
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: '.rubric-helper-assignment-topic',
        content: 'What is the topic of the assignment?',
        title: 'Topic',
        placement: 'top' as Placement,
        disableOverlay: true,
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: '.rubric-helper-text-type',
        content: 'What is the type of text you were assigned to write?',
        title: 'Text Type',
        placement: 'top' as Placement,
        disableOverlay: true,
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: '.rubric-helper-audience',
        content: 'Who is the intended audience of the assignment?',
        title: 'Audience',
        placement: 'top' as Placement,
        disableOverlay: true,
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: '.rubric-helper-word-limit',
        content: 'What is the word limit for your assignment?',
        title: 'Word Limit',
        placement: 'top' as Placement,
        disableOverlay: true,
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: '.rubric-helper-reset',
        content: 'Reset the Rubric Helper.',
        title: 'Reset',
        placement: 'top' as Placement,
        disableOverlay: true,
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: '.rubric-helper-done',
        content: 'Close the Rubric Helper when you\'re done.',
        title: 'Done',
        placement: 'top' as Placement,
        hideCloseButton: true,
        hideFooter: true,
        disableBeacon: true,
        spotlightClicks: true,
        disableOverlayClose: true,
      },
      {
        target: '.rubric-search',
        content: 'Search for a rubric.',
        title: 'Search and Select',
        placement: 'top' as Placement,
        disableBeacon: true,
        spotlightClicks: true,
        disableOverlayClose: true,
      },
      {
        target: '.rubric-search-select',
        content: 'Select a rubric from the search results.',
        title: 'Search and Select',
        placement: 'top' as Placement,
        disableOverlay: false,
        disableBeacon: true,
        spotlightClicks: true,
        disableOverlayClose: true,
      },
      {
        target: '.rubric-display',
        content: 'This is the rubric display. You can view the rubric here.',
        title: 'Rubric Display',
        placement: 'auto' as Placement,
        disableOverlay: false,
        disableBeacon: true,
        spotlightClicks: true,
        disableOverlayClose: true,
      },
      {
        target: '.grader-link-desktop, .grader-link-mobile',
        content: 'Now that you\'ve selected a rubric, let\'s submit your first assignment.',
        title: 'Tools',
        placement: 'auto' as Placement,
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
        hideFooter: true,
        spotlightClicks: true,
      },
      {
        target: '.grader-selected-rubric',
        content: 'This is the rubric you chose earlier.',
        title: 'Selected Rubric',
        placement: 'auto' as Placement,
        disableOverlay: false,
        disableBeacon: true,
        spotlightClicks: true,
        disableOverlayClose: true,
      },
      {
        target: '.grader-title',
        content: 'Give your text a title.',
        title: 'Selected Rubric',
        placement: 'auto' as Placement,
        disableOverlay: false,
        disableBeacon: true,
        spotlightClicks: true,
        disableOverlayClose: true,
      },
      {
        target: '.grader-text',
        content: 'Paste or type your text here. You can also use the formatting tools. If you want to upload a file there is a button for it we\'ll look at next.',
        title: 'Selected Rubric',
        placement: 'auto' as Placement,
        disableOverlay: false,
        disableBeacon: true,
        spotlightClicks: true,
        disableOverlayClose: true,
      },
      {
        target: '.grader-file-upload',
        content: 'Upload your assignment file here.',
        title: 'File Upload',
        placement: 'auto' as Placement,
        disableOverlay: false,
        disableBeacon: true,
        spotlightClicks: true,
        disableOverlayClose: true,
      },
      {
        target: '.grader-grademe-button',
        content: 'Once you\'ve uploaded your file, click here to submit it for grading.',
        title: 'Submit for Grading',
        placement: 'auto' as Placement,
        disableOverlay: false,
        disableBeacon: true,
        spotlightClicks: true,
        disableOverlayClose: true,
      },
      {
        target: '.grader-reset-button',
        content: 'You can clear the title and text with this button.',
        title: 'Reset',
        placement: 'auto' as Placement,
        disableOverlay: false,
        disableBeacon: true,
        spotlightClicks: true,
        disableOverlayClose: true,
      },
      {
        target: '.assignments-link-desktop, .assignments-link-mobile',
        content: 'After submission, you can find your graded assignment here.',
        title: 'View Assignments',
        placement: 'auto' as Placement,
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
        hideFooter: true,
        spotlightClicks: true,
      },
      {
        target: '.edit-assignment',
        content: 'You can edit your assignment if needed.',
        title: 'Edit Assignment',
        placement: 'auto' as Placement,
      },
      {
        target: '.resubmit-button',
        content: 'After editing, you can resubmit your assignment for grading.',
        title: 'Resubmit Assignment',
        placement: 'auto' as Placement,
      },
    ].map((step, index) => ({
      ...step,
      isAvailable: () => {
        const targets = step.target.split(',').map(t => t.trim())
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
  }, [])

  useEffect(() => {
    const initializeTour = () => {
      updateSteps()
      checkRubricHelperOpen()
    }

    initializeTour()

    const debouncedResize = debounce(() => {
      initializeTour()
    }, 250)

    window.addEventListener('resize', debouncedResize)

    const observerCallback = (mutations: MutationRecord[]) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          console.log('Class mutation detected:', mutation.target)
          checkRubricHelperOpen()
        }
      }
    }

    const observer = new MutationObserver(observerCallback)

    const observeRubricHelper = () => {
      const rubricHelperElement = document.querySelector('.rubric-helper-modal')
      if (rubricHelperElement) {
        observer.observe(rubricHelperElement, { attributes: true, attributeFilter: ['class'], subtree: true })
        console.log('Observer set up for:', rubricHelperElement)
      } else {
        setTimeout(observeRubricHelper, 1000)
      }
    }

    observeRubricHelper()

    const handleInteraction = () => {
      console.log('Touch or click event detected')
      setTimeout(checkRubricHelperOpen, 100)
    }

    document.addEventListener('touchstart', handleInteraction)
    document.addEventListener('click', handleInteraction)

    return () => {
      window.removeEventListener('resize', debouncedResize)
      observer.disconnect()
      document.removeEventListener('touchstart', handleInteraction)
      document.removeEventListener('click', handleInteraction)
    }
  }, [checkRubricHelperOpen, updateSteps])

  useEffect(() => {
    console.log('State update - pathname:', pathname, 'stepIndex:', stepIndex, 'rubricHelperOpen:', rubricHelperOpen)

    if (pathname === '/rubrics' && stepIndex === 0) {
      setState(prevState => ({ ...prevState, stepIndex: 1 }))
    }

    if (stepIndex === 1 && rubricHelperOpen) {
      setState(prevState => ({ ...prevState, stepIndex: 2 }))
    }

    if (stepIndex === 11 && !rubricHelperOpen) {
      setState(prevState => ({ ...prevState, stepIndex: 12 }))
    }

    if (pathname === '/grader' && stepIndex === 15) {
      setState(prevState => ({ ...prevState, stepIndex: 16 }))
    }

    if (pathname === '/assignments' && stepIndex === 22) {
      setState(prevState => ({ ...prevState, stepIndex: 23 }))
    }

  }, [pathname, stepIndex, rubricHelperOpen])

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data
    console.log('Joyride callback:', { action, index, status, type })

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setState(prevState => ({ ...prevState, run: false, stepIndex: 0 }))
    } else if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as Events[]).includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1)

      updateSteps() // Refresh step availability before moving to the next step

      // Check if the current step is available
      if (stepsRef.current[nextStepIndex] && !stepsRef.current[nextStepIndex].isAvailable?.()) {
        console.log(`Step ${nextStepIndex} not available, waiting...`)
        return // Don't advance if the current step is not available
      }

      if (nextStepIndex >= stepsRef.current.length || nextStepIndex < 0) {
        setState(prevState => ({ ...prevState, run: false, stepIndex: 0 }))
      } else {
        console.log('Advancing to step:', nextStepIndex)
        setState(prevState => ({ ...prevState, stepIndex: nextStepIndex }))
      }
    }
  }

  const startTour = () => {
    console.log('Starting tour...')
    setTimeout(() => {
      updateSteps() // Ensure steps are up-to-date before starting the tour
      setState(prevState => ({ ...prevState, run: true, stepIndex: 0 }))
    }, 1500) // Increased delay to allow for any pending DOM updates
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

  return (
    <>
      <CustomButton
        onClick={startTour}
        className="z-[9999] fixed top-2 left-[45%] bg-blue-500 text-white rounded-full p-3 shadow-lg"
      >
        Start Guided Tour
      </CustomButton>

      <Joyride
        callback={handleJoyrideCallback}
        continuous
        run={run}
        scrollToFirstStep
        showProgress
        showSkipButton
        hideCloseButton
        spotlightPadding={10}
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
            primaryColor: '#000',
            textColor: '#004a14',
            width: 250,
            zIndex: 1000,
          },
          tooltip: {
            padding: '5px',
            backgroundColor: '#e3ffeb',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
          tooltipContainer: {
            textAlign: 'left',
            paddingTop: 0,
            paddingBottom: 0,
            margin: 0,
          },
          tooltipTitle: {
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '0px',
            padding: 0,
            textAlign: 'center',
          },
          tooltipContent: {
            fontSize: '12px',
            lineHeight: '1.5',
            padding: 5,
          },
          tooltipFooter: {
            margin: 0,
            padding: 0,
          },
          tooltipFooterSpacer: {
            display: 'flex',
            paddingTop: '0px',
          }
        }}
        floaterProps={{
          // disableAnimation: false,
          offset: -20, // Reduce this value to bring the tooltip closer
          styles: {
            floater: {
              padding: 0, // Remove any padding around the tooltip
              margin: 0,
            },
          },
        }}
      />
    </>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: unknown[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}