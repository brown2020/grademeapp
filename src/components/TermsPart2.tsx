type Props = {
  companyName: string;
  companyEmail: string;
  privacyLink: string;
  updatedAt: string;
};

export default function TermsPart2({
  companyName,
  companyEmail,
  privacyLink,
  updatedAt,
}: Props) {
  return (
    <>
      <p>
        Your Subscription term may vary as a continuous, monthly, or annual term
        (“Subscription Term(s)”), as described in the course of purchasing the
        Paid Services. Your Subscription will auto-renew for additional
        Subscription Terms until your Subscription is canceled by you, or
        suspended or terminated by {companyName}. Unless otherwise indicated by
        us, your designated payment method will be charged prior to, or at the
        beginning of, each Subscription Term for the Subscription fee plus any
        applicable taxes and other charges. Before charging you for a
        Subscription Term, we will notify you of the applicable fees, and the
        renewal will occur at the price then in effect for the Paid Service.
      </p>
      <p>
        You may cancel your Subscription at any time. Your cancellation will
        take effect at the end of the current Subscription Term. To cancel your
        subscription and automatic payment, click on the “View Subscription”
        button from your account screen to go to the Stripe customer portal
        where you can manage or cancel your subscription, or email us at{" "}
        {companyEmail}. Cancellation does not entitle you to the refund of any
        previously paid Fees and you will not receive a prorated refund for the
        remainder of the Subscription Term. In the event you cancel your
        Subscription, note that we may still send you promotional
        communications, unless you opt out of receiving those communications by
        following the unsubscribe instructions provided in the communications.
      </p>
      <p>
        When you cancel a Subscription, you cancel only future charges for your
        Subscription. You will not receive a refund for the current Subscription
        Term you paid for, but you will continue to have full access to that
        Subscription until the end of that current Subscription Term. At any
        time for any reason, we may provide a refund, discount, or other
        consideration (“credits”) to some or all of our users. The amount and
        form of such credits, and the decision to provide them, are at our sole
        and absolute discretion. The provision of credits in one instance does
        not entitle you to credits in the future for similar instances, nor does
        it obligate us to provide credits in the future.
      </p>
      <p>
        If you reside outside the United States and change your mind about your
        purchase, you may be entitled to receive a full refund within fourteen
        (14) days (the “Cooling-Off Period”), provided that you have not logged
        in or otherwise redeemed or started to use the Services as a subscriber
        during the Cooling-Off Period.
      </p>
      <p>
        From time to time, we may offer free trials of certain Subscriptions for
        specified periods of time without payment. Prior to starting your free
        trial we will notify you of the applicable Subscription fees that will
        be charged at the expiration of your free trial. Unless you cancel your
        Subscription prior to the end of your free trial by taking the steps
        outlined above, when your free trial ends, we or our third-party payment
        processor will bill your designated payment method on a recurring basis
        for your Subscription fee, plus any applicable taxes and other charges,
        for as long as your Subscription continues. You must cancel your
        Subscription before the end of your free trial period to avoid any
        charges. Instructions for canceling your Subscription are described
        above.
      </p>
      <p>
        Your payment information will be processed and stored through a
        third-party payment processor. All paid account holders must maintain at
        least one valid payment method for payment of Fees, which are described
        in more detail during checkout. All Fees are calculated and billed to
        you on a monthly or annual basis depending upon your choice, and are due
        immediately upon receipt and are subject to change. You acknowledge that
        Fees have a recurring payment feature and you accept responsibility for
        all recurring charges prior to cancellation. Fees shall be charged or
        debited from the saved, designated payment method you provide one day
        prior to the monthly or yearly anniversary of the initial purchase date.
      </p>
      <p>
        In the event that you have not logged in or otherwise used the Services
        for six (6) months, we reserve the right to terminate your subscription
        and cancel any pending purchase(s). You will not be entitled to a refund
        for the value of the Subscription during the free trial.
      </p>
      <p>
        {companyName} reserves the right to adjust the Fees for our Paid
        Services, or any features or parts of our Paid Services, at any time.
        You acknowledge that {companyName} may change the Fees for Paid Services
        at any time. In the event of such a change, {companyName}
        will provide notice to you via the email address associated with your
        account at least thirty (30) days in advance of the effective date of
        the change. Your continued use of the Services indicates your acceptance
        of any changes to the Fees. You are solely responsible for all
        applicable taxes, and will be charged for taxes when required by law.
      </p>
      <h4>Data and Communications</h4>
      <p>
        {companyName} may collect and process information regarding your usage
        of the Services. You consent to {companyName}’s collection and use of
        such information, as well as the sharing of such information with
        third-party service providers for purposes of providing, marketing, and
        improving the Services, and any other reason described in the Privacy
        Policy. All personal information collected by
        {companyName} is treated in accordance with the{" "}
        <a href={privacyLink}>Privacy Policy</a>.
      </p>
      <p>
        By agreeing to the terms and conditions in this Agreement and providing
        your contact information to {companyName}, you give your express consent
        to allow {companyName}, its affiliates, and agents to contact you from
        time to time at any mailing address, phone number, or email address you
        provide to {companyName}. Your consent means you agree to be contacted
        by {companyName} and its service providers via phone, email, text
        message, or other means for any purpose, including but not limited to
        notifications related to the Services and your account, subscriptions,
        purchases, available upgrades, billing and payment processing issues,
        and telemarketing communications. Such authorized communications may
        include use of automated dialing technology or the use of pre-recorded
        messages. You are responsible for any charges that may be billed to you
        by your service provider(s) when we contact you. You further acknowledge
        that your consent to the foregoing is not a condition of using the{" "}
        {companyName} Services, and if you do not wish to consent, you may
        contact us and request to be placed on a do not contact list, or you may
        opt out any time using the opt-out mechanism provided in any such
        communications.
      </p>
      <p>
        {companyName} disclaims all liability under this Agreement for any
        information you provide to {companyName} that may constitute electronic
        patient health records or similar information supplied by you or an end
        user, notwithstanding anything to the contrary in this Agreement or as
        otherwise required by any applicable federal, state, or international
        laws, rules, or regulations.
      </p>
      <h4>Intellectual Property Rights</h4>
      <p>
        {companyName} is a trademark of {companyName}.{companyName} Content,{" "}
        {companyName} products,
        {companyName} features and Services, and our underlying technology are
        protected by copyright, trademark, patent, intellectual property, and
        other laws of the United States and foreign countries. All rights
        reserved. You are not granted, by implication or otherwise, any license
        or right to use any marks appearing on, or used or displayed in
        connection with, the Services (“Trademarks”). The Services may also
        contain or refer to third-party trademarks, trade names, product names,
        and logos that may be registered trademarks of their respective owners.
        Under no circumstances may you use or copy any of the Trademarks.
        Nothing herein should be construed as granting any license or right to
        use any Trademarks displayed in connection with the Services without
        {companyName}’s express written permission.
      </p>
      <p>
        All content provided in association with the Services and this
        Agreement, including, but not limited to, the Sites, the Mobile Apps,
        all text, graphics, user interfaces, visual interfaces, photographs,
        images/video, electronic art, sounds/audio, data, communications
        programs, executable code, computer code, and data (collectively,
        “Content”) formatted, organized, and collected in a variety of forms,
        including design, structure, selection, coordination, expression, “look
        and feel,” arrangement, layouts, pages, screens, and databases of such
        Content, contained in the Content, Services, and underlying technology,
        and any and all other copyright-protected work associated with the
        Services (“Copyrighted Works”), are exclusively owned, controlled, or
        licensed by or to {companyName} and are protected by U.S. and
        international copyright laws. You agree you will not directly or
        indirectly copy, reproduce, modify, create derivative works from,
        distribute, or publicly display the Copyrighted Works without the prior
        express written permission of {companyName}.
      </p>
      <p>
        If you provide any communications or materials to {companyName} by mail,
        email, telephone, or otherwise, suggesting or recommending changes to
        the Services, including without limitation, new features or
        functionality relating thereto, or any comments, questions, suggestions,
        or the like (“Feedback”), {companyName} is free to use such Feedback
        irrespective of any other obligation or limitation between the Parties
        governing such Feedback. {companyName} is free to use, without any
        attribution or compensation to any party, any ideas, know-how, concepts,
        techniques, or other intellectual property rights contained in the
        Feedback, for any purpose whatsoever, although
        {companyName} is not required to use any Feedback.
      </p>
      <p>
        {companyName} respects the intellectual property rights of others and it
        is our policy to expeditiously process and review notices of claimed
        infringement of copyright or other applicable intellectual property
        laws. Any notices of claimed infringement should be sent to
        {companyName}’s Designated Agent at {companyEmail}, and must contain all
        of the following: (i) a signature (physical or electronic) of the
        copyright owner or a person authorized to act on behalf of the copyright
        owner; (ii) a description of the copyrighted work that you claim has
        been infringed; (iii) a description of the material that you claim is
        infringing and is to be removed or have access to same disabled, and
        information sufficient to permit {companyName}’s administrators to
        locate the material; (iv) information sufficient for us to contact you,
        such as address, telephone number, and email address; (v) a statement
        that you have a good faith belief that use of the material in the manner
        complained of is not authorized by the copyright owner, its agent, or
        the law; and (vi) a statement that the information in the notification
        is accurate and, under penalty of perjury, that you are the copyright
        owner or are authorized to act on behalf of the owner of a copyright
        that is allegedly infringed.
      </p>
      <h4>Warranty Disclaimer</h4>
      <p className="uppercase">
        THE SERVICES ARE PROVIDED TO YOU “AS IS WITH ALL FAULTS” AND “AS
        AVAILABLE” WITHOUT WARRANTY OF ANY KIND, AND {companyName} AND ITS
        SUBSIDIARIES, AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES,
        REPRESENTATIVES, AGENTS, PARTNERS, AND LICENSORS HEREBY DISCLAIM ALL
        WARRANTIES AND CONDITIONS WITH RESPECT TO THE SERVICES WHETHER EXPRESS
        OR IMPLIED AND EXPRESSLY DISCLAIMS ANY IMPLIED WARRANTIES OF TITLE,
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, SATISFACTORY QUALITY,
        AND NON-INFRINGEMENT. {companyName} DOES NOT WARRANT AGAINST
        INTERFERENCE WITH YOUR ENJOYMENT OF THE SERVICES, THE AVAILABILITY OF
        CONTENT, THAT THE FUNCTIONS CONTAINED IN THE SERVICES WILL MEET YOUR
        REQUIREMENTS, THAT THE SERVICES WILL BE FREE OF VIRUSES OR OTHER HARMFUL
        COMPONENTS, THAT THE OPERATION OF THE SERVICES WILL BE UNINTERRUPTED OR
        ERROR-FREE, THAT DEFECTS IN THE SERVICES WILL BE CORRECTED, OR THAT THE
        FUNCTIONS CONTAINED IN THE SERVICES WILL FUNCTION WITH OTHER MOBILE APPS
        OR HARDWARE, OR WITHIN A SYSTEM. NO ORAL OR WRITTEN INFORMATION OR
        ADVICE GIVEN BY {companyName} OR AN {companyName} AUTHORIZED
        REPRESENTATIVE SHALL CREATE A WARRANTY. SOME JURISDICTIONS DO NOT ALLOW
        THE EXCLUSION OF IMPLIED WARRANTIES OR LIMITATIONS ON APPLICABLE
        STATUTORY RIGHTS OF A CONSUMER, SO THE ABOVE EXCLUSION MAY NOT APPLY.
      </p>
      <h4>Limitation of Liability</h4>
      <p className="uppercase">
        IN NO EVENT WILL {companyName}, ITS SUBSIDIARIES, AFFILIATES, OFFICERS,
        DIRECTORS, EMPLOYEES, REPRESENTATIVES, AGENTS, PARTNERS, AND LICENSORS
        BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT
        OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE SERVICES OR
        ANY CONTENT ASSOCIATED WITH THE SERVICES, OR SUCH OTHER SITES OR ANY
        SERVICES OR ITEMS OBTAINED THROUGH THE SERVICES, INCLUDING ANY DIRECT,
        INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
        INCLUDING BUT NOT LIMITED TO, PERSONAL INJURY, PAIN AND SUFFERING,
        EMOTIONAL DISTRESS, LOSS OF REVENUE, LOSS OF PROFITS, LOSS OF BUSINESS
        OR ANTICIPATED SAVINGS, LOSS OF BUSINESS OPPORTUNITY, BUSINESS
        INTERRUPTION, LOSS OF USE, LOSS OF GOODWILL, LOSS OF DATA, AND WHETHER
        CAUSED BY TORT (INCLUDING NEGLIGENCE), BREACH OF CONTRACT, OR OTHERWISE,
        EVEN IF FORESEEABLE. THESE EXCLUSIONS OR LIMITATIONS WILL APPLY
        REGARDLESS OF WHETHER OR NOT {companyName} HAS BEEN WARNED OF THE
        POSSIBILITY OF SUCH DAMAGES.
      </p>
      <p className="uppercase">
        THE FOREGOING DOES NOT AFFECT ANY LIABILITY WHICH CANNOT BE EXCLUDED OR
        LIMITED UNDER APPLICABLE LAW. TO THE EXTENT LIABILITY CANNOT BE EXCLUDED
        OR LIMITED AS SET FORTH ABOVE, IN NO EVENT SHALL {companyName} BE LIABLE
        FOR ANY CLAIM, WHETHER IN CONTRACT, TORT, OR UNDER ANY OTHER THEORY OF
        LIABILITY, IN EXCESS OF $100.
      </p>
      <h4>Precautions</h4>
      <p className="uppercase">
        THE SERVICES ARE NOT A MEDICAL DEVICE AND YOU EXPRESSLY AGREE THAT THE
        SERVICES DO NOT INVOLVE THE PROVISION OF MEDICAL ADVICE BY
        {companyName}. THE SERVICES ARE NOT INTENDED TO DIAGNOSE, TREAT, CURE,
        OR PREVENT ANY DISEASE OR MEDICAL CONDITION. THE SERVICES ARE FOR
        INFORMATIONAL PURPOSES ONLY AND CANNOT REPLACE THE SERVICES OF
        PHYSICIANS OR MEDICAL PROFESSIONALS.
      </p>
      <p className="uppercase">
        THE SERVICES, INCLUDING ALL INFORMATION, TEXT, PHOTOGRAPHS, IMAGES,
        ILLUSTRATIONS, GRAPHICS, AUDIO, VIDEO, AND AUDIO-VIDEO CLIPS, AND OTHER
        MATERIALS, WHETHER PROVIDED BY US OR THIRD PARTIES, IS NOT INTENDED TO
        BE AND SHOULD NOT BE USED IN PLACE OF (a) THE ADVICE OF YOUR PHYSICIAN
        OR OTHER MEDICAL PROFESSIONALS, (b) A VISIT, CALL, OR CONSULTATION WITH
        YOUR PHYSICIAN OR OTHER MEDICAL PROFESSIONALS, OR (c) INFORMATION
        CONTAINED ON OR IN ANY PRODUCT PACKAGING OR LABEL.
      </p>
      <p className="uppercase">
        SHOULD YOU HAVE ANY HEALTH-RELATED QUESTIONS, PLEASE CALL OR SEE YOUR
        PHYSICIAN OR OTHER MEDICAL PROVIDER PROMPTLY. SHOULD YOU HAVE AN
        EMERGENCY, CALL YOUR PHYSICIAN OR 911 IMMEDIATELY. YOU SHOULD NEVER
        DISREGARD MEDICAL ADVICE OR DELAY IN SEEKING MEDICAL ADVICE BECAUSE OF
        ANY INFORMATION PRESENTED ON THE SERVICES, AND YOU SHOULD NOT USE THE
        SERVICES OR ANY INFORMATION PROVIDED IN THE SERVICES FOR DIAGNOSING OR
        TREATING A HEALTH PROBLEM. THE TRANSMISSION AND RECEIPT OF SERVICES, IN
        WHOLE OR IN PART, OR COMMUNICATION VIA THE INTERNET, EMAIL, OR OTHER
        MEANS DOES NOT CONSTITUTE OR CREATE A DOCTOR-PATIENT, THERAPIST-PATIENT,
        OR OTHER HEALTHCARE PROFESSIONAL RELATIONSHIP BETWEEN YOU AND
        {companyName}.
      </p>
      <p>
        You should always consult a physician before making any changes to your
        sleep or activity based on information provided through the Services, or
        if you have any questions regarding a medical condition.
        {companyName} is not responsible for any health problems that may result
        from information you learn about through the Services. If you make any
        change to your sleep or activity based on the Services, you agree that
        you do so fully at your own risk. It is important to be sensitive to
        your body&apos;s responses. For example, if you feel unexpected,
        repeating, or long-term pain, or fatigue or discomfort due to having
        made changes to your sleep or activity, it is recommended that you
        consult a physician before continuing with such changes. The information
        in the Services may be misleading if your physiological functions and
        responses differ significantly from population averages due to medical
        conditions or rare natural differences.
      </p>
    </>
  );
}
