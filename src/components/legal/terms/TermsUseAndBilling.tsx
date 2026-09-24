import Link from "next/link";
import { LEGAL } from "@/components/legal/legalInfo";

/** Terms: introduction, access, responsibilities, payment and subscriptions. */
export function TermsUseAndBilling() {
  const { companyName, companyEmail, privacyLink } = LEGAL;
  return (
    <>
      <p>
        Welcome and thank you for your interest in {companyName} services and
        mobile apps! These Terms of Use (the “Agreement”) describe the terms and
        conditions applicable to your use of {companyName} (the “Sites”) and the
        related mobile applications (the “Mobile Apps”) (collectively, the
        “Services”). The Sites and Mobile Apps are owned and operated by{" "}
        {companyName}, and its affiliates and subsidiaries (collectively “
        {companyName}”).
      </p>
      <p>
        In this Agreement, we refer to ourselves as {companyName} or “us” or
        “we”; we refer to you as “you” or “Customer.” {companyName} and Customer
        are referred to in this Agreement individually as a “Party” and
        collectively as the “Parties.”
      </p>
      <p>
        By accessing or using the Services, including access to the Sites, you
        intend and expressly agree to be bound by all the terms and conditions
        of this Agreement and the Privacy Policy (available at <Link href={privacyLink}>{privacyLink}</Link>),
        which is incorporated by reference. If you do not agree to these terms
        and conditions, you may not use the Services.
      </p>
      <h2>Access and Use</h2>
      <p>
        {companyName} grants you a limited license to access the Sites subject
        to this Agreement. If you choose to subscribe to and use the Mobile
        Apps, {companyName} further grants you a license to access and use the
        Services, subject to and conditioned upon your compliance with this
        Agreement, the Privacy Policy, and any other rules and requirements
        communicated to you by {companyName}, including your payment of any
        applicable fees. You acknowledge and agree that
        {companyName} may modify, update, and otherwise change the Services at
        any time and in its sole discretion.
      </p>
      <p>
        You represent and warrant that you are at least 18 years of age and have
        the legal authority to accept this Agreement on your behalf or on behalf
        of any party you represent. You alone are responsible for your
        activities and interaction with the Services.
      </p>
      <p>
        You shall not use the Services for any purposes beyond the scope of the
        access granted in this Agreement. You shall not at any time, directly or
        indirectly, and shall not permit any third-party to: (i) copy, modify,
        or create derivative works of the Services, in whole or in part; (ii)
        reverse engineer, disassemble, decompile, decode, adapt, or otherwise
        attempt to derive or gain access to any Mobile Apps component of the
        Services, in whole or in part; or (iii) use the Services in any manner
        or for any purpose that infringes, misappropriates, or otherwise
        violates any intellectual property right or other right of any person
        (including but not limited to web scraping), or that otherwise violates
        any law, regulation, or other legal requirement.
      </p>
      <p>
        Except for the limited license to access the Sites and Mobile Apps
        identified above, you acknowledge that nothing contained in this
        Agreement shall be construed as granting or conferring, by implication,
        estoppel, or otherwise, any right, title, or interest to any
        intellectual property, including any (i) inventions (whether patentable
        or not in any country), patents, patent applications, invention
        disclosures, improvements, trade secrets, proprietary information, know
        how, information, or technical data; (ii) copyright protected works,
        copyright registrations, mask works, mask work registrations, or
        applications in the United States or any foreign country; (iii)
        trademarks, trademark registrations, service marks, logos, or
        applications therefor in the United States or any foreign country; (iv)
        trade secrets; or (v) any other tangible or intangible proprietary
        rights anywhere in the world.
      </p>
      <p>
        You acknowledge and agree that at times the Services may be inaccessible
        or inoperable for any reason whatsoever, including, without limitation:
        (i) equipment malfunctions; (ii) periodic maintenance procedures or
        repairs which {companyName} may undertake from time to time without
        notice to you; or (iii) causes which are beyond the control of
        {companyName} or which are not reasonably foreseeable.
      </p>
      <p>
        Notwithstanding anything to the contrary in this Agreement,
        {companyName} may temporarily suspend access to the Services provided to
        you and any other third-party for security purposes, to prevent illegal
        or fraudulent activity, to comply with the requests of any legal agency
        or government entity, or if you violate the Agreement or the Privacy
        Policy.
      </p>
      <p>
        {companyName} may from time to time and in its sole discretion engage
        other service providers to assist in the performance of the Services,
        such as web hosting providers, payment processors, and other
        third-parties. You shall abide by the terms of use and other
        requirements associated with the services provided by such third-parties
        in connection with the Services.
      </p>
      <h2>Customer Responsibilities</h2>
      <p>
        You acknowledge that you are solely responsible and liable for your use
        of the Services, directly or indirectly, including understanding whether
        such access or use is permitted by or in violation of this Agreement.
        You are further solely responsible for compliance with all applicable
        laws relating to your use of the Services. You shall further use the
        Services solely for lawful purposes, and shall conduct all business
        through the Services in accordance with all applicable laws and
        regulations, including but not limited to all applicable federal and
        state laws and regulations governing the offer and sale of securities,
        money laundering, and counter-terrorism.
      </p>
      <p>
        You alone are responsible for ensuring and maintaining that you are able
        to access and use the Services, including by securing your own
        compatible hardware, Mobile Apps, internet access, security Mobile Apps,
        backup devices or services, and any other requirements.
        {companyName} shall have no responsibility to provide any additional
        Mobile Apps or hardware. You further agree that
        {companyName} shall have no responsibility for any data loss or other
        damage or loss suffered in connection with your use of the Services,
        including any failure to provide adequate security or backup devices or
        services.
      </p>
      <p>
        You are responsible for ensuring {companyName} has accurate and current
        information for your Customer account, including current contact and
        payment information. You are further responsible for regularly reviewing
        the associated Customer email account for any communications from{" "}
        {companyName}.
      </p>
      <p>
        If you are provided with a username, password, credentials file, or any
        other piece of information as part of any security procedure
        (“Credentials”), you must treat such information as confidential, and
        must not disclose Credentials to any other person or entity. You
        acknowledge that your account and Credentials are personal to you, and
        further agree not to provide any other person with access to the
        Services or portions of the Services using your username, password, or
        other security information. You shall notify {companyName}
        immediately of any unauthorized access to or use of your Credentials or
        any other breach of security. {companyName} has the right to disable any
        username, password, credentials file, or other identifier at any time,
        whether chosen by you or provided by {companyName}.
      </p>
      <p>
        {companyName} shall make commercially reasonable efforts to provide
        adequate support services for the Services. Notwithstanding the
        foregoing, this Agreement does not entitle you to any guaranteed level,
        availability, or turnaround time of support services for the Services.
      </p>
      <h2>Payment and Fees</h2>
      <p>
        Paid Services include the Services, which may be one-time purchases or
        automatically renewing subscription services (“Paid Services”),
        including our Sites and Mobile Apps (“Subscriptions”). We may make
        changes to, suspend, or discontinue Paid Services at any time for any
        reason, and {companyName} reserves the sole discretion to determine
        which Services or portions thereof require payment.
      </p>
      <p>
        Paid Services may include pre-ordered products that will be produced for
        you in the future (“Pre-Order”). You will be charged a Pre-Order fee
        when placing your Pre-Order. The actual date for shipping any accepted
        Pre-Order will depend on a variety of factors, including but not limited
        to, the date of payment of your Pre-Order fee and {companyName}’s
        production schedule. There is no shipping date guarantee for Pre-Orders.
      </p>
      <p>
        You agree to pay all applicable fees for Paid Services including,
        without exclusion, any monthly subscription fees, user fees, and
        offering fees and any other fees, charges, or costs that you agree to
        purchase as part of the Paid Services during the checkout process
        (“Fees”). You agree to pay all Fees and all applicable taxes incurred
        prior to termination or cancellation of the Agreement.
      </p>
      <p>
        You authorize {companyName} to charge your designated payment method for
        Paid Services. By providing an acceptable payment method, you represent
        and warrant that you are authorized to use the designated payment method
        and that you authorize us or our third-party payment processor to charge
        your payment method for the total amount of your purchase, including any
        applicable taxes and other charges. If the payment method cannot be
        verified, is invalid, or is otherwise not acceptable, your Paid Service
        may be suspended or canceled. You must resolve any problem we encounter
        in relation to the payment method you provide in order to proceed with
        your use of the Service. If you accept a promotional offer or make
        changes to your Paid Services, the Fees, taxes, and amounts billed may
        vary. Billing amounts may also vary due to changes in applicable taxes
        or currency exchange rates. You authorize us or our third-party payment
        processor to charge your payment method for the corresponding amount.
        Refunds will not be issued unless required by law. This payment
        obligation shall survive termination or cancellation of this Agreement
        for any reason whatsoever.
      </p>
      <p>
        If you choose to finance a purchase through our third-party payment
        processor and one or more items in your order has an extended ship date,
        your loan payment(s), including interest, may be due before we ship all
        of the items. Please note that you may not receive a rebate of any
        interest that may have already accrued on an amount that is later
        refunded.
      </p>
      <h2>Subscriptions</h2>
      <p>
        Certain Paid Services are subscription-based purchases, to which the
        following terms apply:
      </p>
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
    </>
  );
}
