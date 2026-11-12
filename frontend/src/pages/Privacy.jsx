import { useSite } from '../context/SiteContext'
import PageHeader from '../components/PageHeader'

export default function Privacy() {
  const { pages, settings } = useSite()
  const p = pages?.privacy || {}
  const contactEmail = settings?.email || 'deephysioclinic@gmail.com'

  return (
    <>
      <PageHeader title={p.title || 'Privacy Policy'} image={pages?.about?.headerImage} />
      <div className="shell mt-10 max-w-4xl pb-16">
        <div className="glass space-y-8 rounded-3xl p-6 text-[16px] leading-relaxed text-slate-800 sm:p-10 sm:text-[17px]">
          {/* Header Title */}
          <div className="border-b border-slate-200/80 pb-6">
            <h1 className="font-glass text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              PRIVACY POLICY AND TERMS OF SERVICE — DEEPHYSIO LIMITED
            </h1>
          </div>

          {/* Background */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-sky-900">Background:</h2>
            <p>
              DeePhysio Limited understands that your privacy is important to you and that you care about how your
              information is used and shared online. We respect and value the privacy of everyone who visits Our Site
              and will only collect and use information in ways that are useful to you and in a manner consistent with
              your rights and Our obligations under the law.
            </p>
            <p>
              This Policy applies to Our use of any and all data collected by us in relation to your use of Our Site.
              Please read this Privacy Policy carefully and ensure that you understand it. Your acceptance of Our Privacy
              Policy is deemed to occur upon your first use of Our Site AND/OR You will be required to read and accept
              this Privacy Policy when signing up for an Account. If you do not accept and agree with this Privacy
              Policy, you must stop using Our Site immediately.
            </p>
          </section>

          {/* 1. Definitions and Interpretation */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-sky-900">1. Definitions and Interpretation</h2>
            <p>In this Policy the following terms shall have the following meanings:</p>
            <ul className="list-disc space-y-2 pl-6 marker:text-sky-700">
              <li>
                <strong className="text-slate-900">“Account”</strong> means an account required to access and/or use certain
                areas and features of Our Site;
              </li>
              <li>
                <strong className="text-slate-900">“Cookie”</strong> means a small text file placed on your computer or device
                by Our Site when you visit certain parts of Our Site and/or when you use certain features of Our Site;
              </li>
              <li>
                <strong className="text-slate-900">“Our Site”</strong> means this website, deephysio.co.uk;
              </li>
              <li>
                <strong className="text-slate-900">“UK and EU Cookie Law”</strong> means the relevant parts of the Privacy and
                Electronic Communications (EC Directive) Regulations 2003 as amended in 2004, 2011, and 2015; and
              </li>
              <li>
                <strong className="text-slate-900">“UK GDPR”</strong> means the United Kingdom General Data Protection
                Regulation.
              </li>
            </ul>
          </section>

          {/* 2. Information About Us */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-sky-900">2. Information About Us</h2>
            <p>
              Our Site, deephysio.co.uk, is owned and operated by DeePhysio Limited, registered in England and Wales
              under company number 12086022.
            </p>
          </section>

          {/* 3. Scope – What Does This Policy Cover? */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-sky-900">3. Scope – What Does This Policy Cover?</h2>
            <p>
              This Privacy Policy applies only to your use of Our Site. It does not extend to any websites that are
              linked to from Our Site (whether We provide those links or whether they are shared by other users). We have
              no control over how your data is collected, stored, or used by other websites and We advise you to check the
              privacy policies of any such websites before providing any data to them.
            </p>
          </section>

          {/* 4. What Data Do We Collect? */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-sky-900">4. What Data Do We Collect?</h2>
            <p>
              Some data will be collected automatically by Our Site (for further details, please see section 10 on Our
              use of Cookies), other data will only be collected if you voluntarily submit it and consent to Us using it
              for the purposes set out in section 5, for example, when signing up for an Account. Depending upon your use
              of Our Site, We may collect some or all of the following data:
            </p>
            <ul className="list-disc space-y-1.5 pl-6 marker:text-sky-700">
              <li>4.1 Name</li>
              <li>4.2 Contact information such as email addresses and telephone numbers</li>
              <li>4.3 Financial information such as credit / debit card numbers</li>
              <li>4.4 IP address (automatically collected)</li>
              <li>4.5 Web browser type and version (automatically collected)</li>
              <li>4.6 Operating system (automatically collected)</li>
              <li>
                4.7 A list of URLs starting with a referring site, your activity on Our Site, and the site you exit to
                (automatically collected)
              </li>
              <li>
                4.8 Special category health data (such as physiotherapy treatment notes and clinical records required for
                patient care)
              </li>
            </ul>
          </section>

          {/* 5. How Do We Use Your Data? */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-sky-900">5. How Do We Use Your Data?</h2>
            <ul className="list-disc space-y-3 pl-6 marker:text-sky-700">
              <li>
                <strong className="text-slate-900">5.1</strong> All personal data is stored securely in accordance with the UK
                General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. For more details on security
                see section 6, below.
              </li>
              <li>
                <strong className="text-slate-900">5.2</strong> We use your data to provide the best possible services to you.
                This includes:
                <ul className="mt-2 list-circle space-y-1.5 pl-6">
                  <li>5.2.1 Providing and managing your Account</li>
                  <li>5.2.2 Providing and managing your access to Our Site</li>
                  <li>5.2.3 Responding to communications from you</li>
                  <li>
                    5.2.4 Supplying you with newsletters, health tips, and service updates that you have subscribed to
                    (you may unsubscribe or opt-out at any time by clicking the &ldquo;Unsubscribe&rdquo; link at the bottom
                    of our emails or by contacting us at{' '}
                    <a href="mailto:info@deephysio.co.uk" className="text-sky-700 underline hover:text-sky-900">
                      info@deephysio.co.uk
                    </a>
                    )
                  </li>
                  <li>5.2.5 Market research</li>
                  <li>
                    5.2.6 Analysing your use of Our Site and gathering feedback to enable Us to continually improve Our Site
                    and your user experience
                  </li>
                </ul>
              </li>
              <li>
                <strong className="text-slate-900">5.3</strong> In some cases, the collection of data may be a statutory or
                contractual requirement, and We will be limited in the services We can provide you without your consent
                for Us to be able to use such data.
              </li>
              <li>
                <strong className="text-slate-900">5.4</strong> With your permission and/or where permitted by law, We may
                also use your data for marketing purposes which may include contacting you by email with information, news,
                and offers on Our services. We will not, however, send you any unsolicited marketing or spam and will take
                all reasonable steps to ensure that We fully protect your rights and comply with Our obligations under the
                UK GDPR and the Privacy and Electronic Communications (EC Directive) Regulations 2003, as amended.
              </li>
              <li>
                <strong className="text-slate-900">5.5</strong> Under the UK GDPR, we will ensure that your personal data is
                processed lawfully, fairly, and transparently, without adversely affecting your rights. We will only process
                your personal data if at least one of the following bases applies:
                <ul className="mt-2 list-circle space-y-1.5 pl-6">
                  <li>a) You have given consent to the processing of your personal data for one or more specific purposes;</li>
                  <li>
                    b) Processing is necessary for the performance of a contract to which you are a party or in order to
                    take steps at your request prior to entering into a contract;
                  </li>
                  <li>c) Processing is necessary for compliance with a legal obligation to which we are subject;</li>
                  <li>d) Processing is necessary to protect your vital interests or those of another natural person;</li>
                  <li>
                    e) Processing is necessary for the performance of a task carried out in the public interest or in the
                    exercise of official authority vested in the controller; and/or
                  </li>
                  <li>
                    f) Processing is necessary for the purposes of legitimate interests pursued by us or by a third party.
                  </li>
                </ul>
              </li>
              <li>
                <strong className="text-slate-900">5.6</strong> Where we process special category data relating to your health
                or medical history (such as physiotherapy assessment and treatment records), we do so on the basis that it
                is necessary for the provision of health or social care or treatment, managed under appropriate professional
                confidentiality obligations.
              </li>
            </ul>
          </section>

          {/* 6. How and Where Do We Store Your Data? */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-sky-900">6. How and Where Do We Store Your Data?</h2>
            <ul className="list-disc space-y-2.5 pl-6 marker:text-sky-700">
              <li>
                <strong className="text-slate-900">6.1</strong> We only keep your data for as long as We need to in order to
                use it as described above in section 5, and/or for as long as We have your permission to keep it. Your data
                will be deleted if we no longer need it in accordance with the terms of our Data Retention Policy (general
                records retained for up to 6 years, and clinical records retained in accordance with medical malpractice
                and clinical governance guidelines).
              </li>
              <li>
                <strong className="text-slate-900">6.2</strong> Some or all of your data may be stored or transferred outside
                of the United Kingdom or the European Economic Area (&ldquo;the EEA&rdquo;). If We store or transfer data
                outside the UK or EEA, We will take all reasonable steps to ensure that your data is treated as safely and
                securely as it would be within the UK and under the UK GDPR, using appropriate safeguards such as
                UK-approved International Data Transfer Agreements (IDTAs).
              </li>
              <li>
                <strong className="text-slate-900">6.3</strong> Data security is of great importance to Us, and to protect
                your data We have put in place suitable physical, electronic, and managerial procedures to safeguard and
                secure data collected through Our Site.
              </li>
              <li>
                <strong className="text-slate-900">6.4</strong> Notwithstanding the security measures that We take, it is
                important to remember that the transmission of data via the internet may not be completely secure and that
                you are advised to take suitable precautions when transmitting data to Us via the internet.
              </li>
            </ul>
          </section>

          {/* 7. Do We Share Your Data? */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-sky-900">7. Do We Share Your Data?</h2>
            <ul className="list-disc space-y-2.5 pl-6 marker:text-sky-700">
              <li>
                <strong className="text-slate-900">7.1</strong> We may share your data with other companies in Our group
                (including our subsidiaries and/or our holding company and its subsidiaries).
              </li>
              <li>
                <strong className="text-slate-900">7.2</strong> We may contract with third parties to supply services to you on
                Our behalf (such as payment processing, IT support, and practice management tools). Where any of your data
                is required for such a purpose, We will take all reasonable steps to ensure that your data will be handled
                safely, securely, and in accordance with your rights and the law.
              </li>
              <li>
                <strong className="text-slate-900">7.3</strong> We may compile statistics about the use of Our Site including
                data on traffic, usage patterns, user numbers, sales, and other information. All such data will be
                anonymised.
              </li>
              <li>
                <strong className="text-slate-900">7.4</strong> In certain circumstances We may be legally required to share
                certain data held by Us, such as where We are involved in legal proceedings or complying with a court order
                or governmental authority.
              </li>
            </ul>
          </section>

          {/* 8. What Happens If Our Business Changes Hands? */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-sky-900">8. What Happens If Our Business Changes Hands?</h2>
            <p>
              We may, from time to time, expand or reduce Our business and this may involve the sale and/or the transfer
              of control of all or part of Our business. Data provided by users will, where it is relevant to any part of
              Our business so transferred, be transferred along with that part and the new owner or newly controlling party
              will be permitted to use the data for the purposes for which it was originally collected.
            </p>
          </section>

          {/* 9. How Can You Access Your Data? */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-sky-900">9. How Can You Access Your Data?</h2>
            <p>
              You have the legal right to ask for a copy of any of your personal data held by Us. Please contact Us for
              more details at{' '}
              <a href={`mailto:${contactEmail}`} className="text-sky-700 underline hover:text-sky-900">
                {contactEmail}
              </a>{' '}
              or using the contact details in section 12.
            </p>
          </section>

          {/* 10. What Cookies Do We Use and What For? */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-sky-900">10. What Cookies Do We Use and What For?</h2>
            <ul className="list-disc space-y-2 pl-6 marker:text-sky-700">
              <li>
                <strong className="text-slate-900">10.1</strong> Our Site places and accesses certain first-party Cookies on
                your computer or device to facilitate and improve your experience of Our Site.
              </li>
              <li>
                <strong className="text-slate-900">10.2</strong> You may also receive certain third-party Cookies on your
                computer or device placed by trusted partners.
              </li>
              <li>
                <strong className="text-slate-900">10.3</strong> All Cookies used by and on Our Site are used in accordance
                with current UK and EU Cookie Law.
              </li>
              <li>
                <strong className="text-slate-900">10.4</strong> Before Cookies are placed, you will be shown a message bar
                requesting consent. You may deny consent, though certain features may not function fully.
              </li>
              <li>
                <strong className="text-slate-900">10.5</strong> Strictly necessary cookies are essential for the website to
                function (such as session cookies used to remember if you are logged into the system). Your prior consent
                is not required for these, though you can block them via browser settings.
              </li>
              <li>
                <strong className="text-slate-900">10.6</strong> Our Site uses analytics services provided by Google Analytics
                to track pages browsed and help us improve user experience.
              </li>
              <li>
                <strong className="text-slate-900">10.7</strong> You can choose to enable, disable, or delete cookies at any
                time through your internet browser settings.
              </li>
            </ul>
          </section>

          {/* 11. Summary of Your Rights under the UK GDPR */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-sky-900">11. Summary of Your Rights under the UK GDPR</h2>
            <p>Under the UK GDPR, you have:</p>
            <ul className="list-disc space-y-1.5 pl-6 marker:text-sky-700">
              <li>
                <strong className="text-slate-900">11.1</strong> The right to request access to, deletion of, or correction
                of your personal data held by Us;
              </li>
              <li>
                <strong className="text-slate-900">11.2</strong> The right to complain to a supervisory authority (the
                Information Commissioner&apos;s Office - ICO);
              </li>
              <li>
                <strong className="text-slate-900">11.3</strong> The right to be informed of what data processing is taking
                place;
              </li>
              <li>
                <strong className="text-slate-900">11.4</strong> The right to restrict processing;
              </li>
              <li>
                <strong className="text-slate-900">11.5</strong> The right to data portability;
              </li>
              <li>
                <strong className="text-slate-900">11.6</strong> The right to object to processing of your personal data; and
              </li>
              <li>
                <strong className="text-slate-900">11.7</strong> Rights with respect to automated decision-making and profiling.
              </li>
            </ul>
          </section>

          {/* 12. Contacting Us */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-sky-900">12. Contacting Us</h2>
            <p>
              If you have any questions about Our Site or this Privacy Policy, please contact Us by email at{' '}
              <a href={`mailto:${contactEmail}`} className="text-sky-700 underline hover:text-sky-900">
                {contactEmail}
              </a>
            </p>
          </section>

          {/* 13. Changes to Our Privacy Policy */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-sky-900">13. Changes to Our Privacy Policy</h2>
            <p>
              We may change this Privacy Policy from time to time as required by law or business needs. Any changes will
              be posted immediately on Our Site, and you will be deemed to have accepted the terms on your first use
              following the alterations.
            </p>
          </section>

          {/* DATA RETENTION POLICY */}
          <div className="my-6 border-t border-slate-200/80 pt-6">
            <h2 className="font-glass text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              DATA RETENTION POLICY
            </h2>
          </div>

          <section className="space-y-3">
            <h3 className="text-xl font-bold text-sky-900">Introduction</h3>
            <p>
              This data retention policy sets out the obligations of DeePhysio Limited and the basis upon which we shall
              retain, review, and destroy data held by us, or within our custody or control. This policy applies to our
              entire organisation including our officers, employees, agents, and sub-contractors.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-bold text-sky-900">Security and Storage</h3>
            <p>
              All data and records are stored securely to avoid misuse or loss. We maintain data security by protecting
              the confidentiality, integrity, and availability of personal data in accordance with our IT security
              protocols and UK GDPR requirements.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-bold text-sky-900">Retention Periods</h3>
            <ul className="list-disc space-y-2 pl-6 marker:text-sky-700">
              <li>
                <strong className="text-slate-900">General Data:</strong> Our general data retention period for administrative
                and financial records shall be for a period of 6 years, in alignment with statutory limitation periods.
              </li>
              <li>
                <strong className="text-slate-900">Clinical Records:</strong> Patient medical and physiotherapy records are
                retained securely in accordance with professional guidelines (typically 8 years for adults, or until a
                child reaches 25/26 years of age).
              </li>
              <li>
                <strong className="text-slate-900">Destruction:</strong> Upon expiry of retention periods, confidential or
                sensitive records are securely destroyed electronically or via cross-cut shredding. Non-confidential
                records are recycled.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-bold text-sky-900">Use of Medical Images</h3>
            <p>
              All images on the site are fully anonymised and use of these images is in accordance with paragraphs 10–12
              of the General Medical Council’s guidance document entitled{' '}
              <em className="text-slate-900 font-medium">Making and using visual and audio recordings of patients</em>.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-bold text-sky-900">Originality of Content</h3>
            <p>
              All questions and material available on DeePhysio Limited are original content created by our team.
            </p>
          </section>

          {/* Bottom Copyright and Company House Info */}
          <div className="mt-10 border-t border-slate-200/90 pt-6 text-sm text-slate-600">
            <p className="font-semibold text-slate-800">Copyright © 2026 DeePhysio. All rights reserved.</p>
            <p className="mt-1 text-slate-500">Company House Number: 12086022</p>
          </div>
        </div>
      </div>
    </>
  )
}
