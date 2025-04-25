import { Card } from "../../../components/Card"
import { SuspectContactForm } from "../components/SuspectContactForm"
import { SuspectContacts } from "../components/SuspectContacts"
import { SuspectDetail } from "../components/SuspectDetail"
import { SuspectInteractionForm } from "../components/SuspectInteractionForm"
import { SuspectInteractions } from "../components/SuspectInteractions"

export const SuspectsShowPage = () => {
    return (
        <>
            <SuspectDetail />
            <Card>
                <div className="p-5">
                    <SuspectContacts />
                </div>
            </Card>

            <div className="p-5">
                <SuspectContactForm />
            </div>
            <Card>
                <div className="p-5">
                    <SuspectInteractions />
                </div>
            </Card>

            <div className="p-5">
                <SuspectInteractionForm />
            </div>

        </>
    )
}