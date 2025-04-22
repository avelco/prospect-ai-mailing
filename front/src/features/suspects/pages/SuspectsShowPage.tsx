import { SuspectCommentForm } from "../components/SuspectCommentForm"
import { SuspectComments } from "../components/SuspectComments"
import { SuspectContactForm } from "../components/SuspectContactForm"
import { SuspectContacts } from "../components/SuspectContacts"
import { SuspectDetail } from "../components/SuspectDetail"

export const SuspectsShowPage = () => {
    return (
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white shadow p-0 sm:col-span-2 lg:col-span-4">
            <div className="flex flex-col items-center justify-between gap-4 border-b border-neutral-100 p-5 text-center sm:flex-row sm:text-start">
                <div>
                    <h2 className="mb-0.5 font-semibold text-lg">Suspect</h2>
                </div>
            </div>
            <div className="p-5">
                <SuspectDetail />
            </div>
            <div className="p-5">
                <SuspectContacts />  
                <SuspectContactForm />
            </div>
            <div className="p-5">
                <SuspectComments /> 
                <SuspectCommentForm /> 
            </div>
        </div>
    )
}