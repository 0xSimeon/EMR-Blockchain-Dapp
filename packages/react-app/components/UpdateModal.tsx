import React, {useState} from 'react'
import { addPatientReport } from '@/interact'
import { useCelo } from '@celo/react-celo'

interface Iparam{
  patientAddress: string
}
export default function UpdateModal(param : Iparam): JSX.Element {
  const [testResult, setTestResult] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>()
  const { kit, address } = useCelo()

  const handleTestResult = (e: React.FormEvent<HTMLInputElement>) => {
    setTestResult(e.currentTarget.value)
    console.log(e.currentTarget.value)
    e.preventDefault()
  }

  const handlePatientReport = async (patientAddress: string) => {
    setShowModal(true)
    setLoading(true)
    if (!testResult) {
      alert("field is required")
      return
   }
    await addPatientReport(address, kit, patientAddress, testResult)  
    setShowModal(false)
    setLoading(false)
  }

  return (
    <div>
      {showModal ? <div></div> :
        <div
          data-te-modal-init
          className="fixed top-0 left-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
          id="updateModal"
          aria-labelledby="exampleModalCenterTitle"
          aria-modal="true"
          tabIndex={+ 1}
          role="dialog">
          <div
            data-te-modal-dialog-ref
            className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:min-h-[calc(100%-3.5rem)] min-[576px]:max-w-[500px]">
            <div
              className="pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600">
              <div
                className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                <h5
                  className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200"
                  id="exampleModalScrollableLabel">
                  Patient Test Result
                </h5>
                <button
                  type="button"
                  className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                  data-te-modal-dismiss
                  aria-label="Close">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="h-6 w-6">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="relative p-4">
                <input type="text" placeholder='Enter test result' className='border-2 p-2 mt-2 rounded-md w-full' value={testResult} onChange={handleTestResult} />
              </div>
              <div
                className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                <button
                  type="button"
                  className="inline-block rounded bg-primary-100 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                  data-te-modal-dismiss
                  data-te-ripple-init
                  data-te-ripple-color="light">
                  Close
                </button>
                <button
                  onClick={() => handlePatientReport(param.patientAddress)}
                  type="button"
                  className="ml-1 inline-block rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                  data-te-ripple-init
                  data-te-ripple-color="light">
                  {loading ? "Loading..." : "Add Test Result"}
                </button>
              </div>
            </div>
          </div>
        </div>
      }
  </div>
  )
}
