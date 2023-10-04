export default function Terms(props: {
    isOpen: boolean,
    handleCloseModal: Function
}) {
    return (
        <div
            className="fixed left-0 top-0 w-full h-[100vh] z-[10000] backdrop-blur-md flex-col bg-[#171649] grid place-content-center"
        >
            <div className="m-6 w-[calc(100%-48px)]">
                <h2 className="text-center text-xl font-bold text-[#fff] mb-2 m-6 w-[calc(100%-48px)]">Terms of service</h2>
                <div className="max-w-[500px] max-h-[600px] overflow-x-auto pointer-events-auto">
                    <p className="text-[#ffffffa7] text-sm pr-2">
                        Welcome to SlowRug, a PVP based gaming studio that allows users to go head to head in exclusive gaming. <br />
                        <br />
                        Eligibility: In order to use SlowRug, you must be at least 18 years old or of legal age in your jurisdiction. By using our platform, you confirm that you meet these requirements.<br />
                        <br />
                        Responsible Gambling: We take responsible gambling seriously and encourage all of our users to do the same. If you think that you may have a gambling problem, please seek help immediately. We offer self-exclusion and other tools to help you manage your gambling activity.<br />
                        <br />
                        Jurisdictional Restrictions: We comply with all applicable laws and regulations, and we do not allow the use of our platform in jurisdictions where online gambling is prohibited or restricted. It is your responsibility to ensure that you are legally allowed to use our platform before engaging in any gambling activities.<br />
                        <br />
                        Security and Privacy: We take the security and privacy of our users very seriously. We employ the latest security measures, including encryption, to protect your personal and financial information. However, we cannot guarantee the security of our platform or the information you provide to us.<br />
                        <br />
                        Fairness and Transparency: We use certified and verified random number generators to ensure that our games are fair and unbiased. We also provide transparency regarding the odds and payouts of our games.<br />
                        <br />
                        Intellectual Property: All content on our platform, including logos, graphics, and text, is protected by copyright and other intellectual property laws. You may not use our content without our express written permission.<br />
                        <br />
                        Termination of Account: We reserve the right to terminate your account if we believe that you have violated our terms of service or engaged in any fraudulent or illegal activity on our platform.<br />
                        <br />
                        By using SlowRug, you agree to abide by these terms of service. We reserve the right to modify our terms of service at any time and will notify users of any changes. If you have any questions or concerns, please contact our support team for assistance
                    </p>
                </div>
                <div className="text-center z-[2000] relative">
                    <button className="bg-orange-800 text-[#fff] px-5 py-2 rounded-sm mt-4 "
                        onClick={() => props.handleCloseModal()}
                    >Confirm</button>
                </div>
            </div>
        </div>
    )
}
