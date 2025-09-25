'use client';

import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-10" />
      
      {/* Content */}
      <div className="relative z-10 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glassmorphism rounded-2xl p-8 lg:p-12"
          >
            <motion.h1 
              className="text-4xl lg:text-5xl font-bold gradient-text mb-8 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Privacy Policy
            </motion.h1>

            <motion.div 
              className="prose prose-lg prose-invert max-w-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <p className="text-gray-300 mb-6">
                SavvyIndians.com website is owned by Savvyindian, which is a data controller of your personal data.
              </p>

              <p className="text-gray-300 mb-8">
                We have adopted this Privacy Policy, which determines how we are processing the information collected by SavvyIndians.com, which also provides the reasons why we must collect certain personal data about you. Therefore, you must read this Privacy Policy before using SavvyIndians.com website.
              </p>

              <p className="text-gray-300 mb-8">
                We take care of your personal data and undertake to guarantee its confidentiality and security.
              </p>

              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Personal information we collect:</h2>
              <p className="text-gray-300 mb-8">
                When you visit the SavvyIndians.com, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the installed cookies on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products you view, what websites or search terms referred you to the Site, and how you interact with the Site. We refer to this automatically-collected information as &quot;Device Information.&quot; Moreover, we might collect the personal data you provide to us (including but not limited to Name, Surname, Address, payment information, etc.) during registration to be able to fulfill the agreement.
              </p>

              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Why do we process your data?</h2>
              <p className="text-gray-300 mb-4">
                Our top priority is customer data security, and, as such, we may process only minimal user data, only as much as it is absolutely necessary to maintain the website. Information collected automatically is used only to identify potential cases of abuse and establish statistical information regarding website usage. This statistical information is not otherwise aggregated in such a way that it would identify any particular user of the system.
              </p>

              <p className="text-gray-300 mb-8">
                You can visit the website without telling us who you are or revealing any information, by which someone could identify you as a specific, identifiable individual. If, however, you wish to use some of the website&apos;s features, or you wish to receive our newsletter or provide other details by filling a form, you may provide personal data to us, such as your email, first name, last name, city of residence, organization, telephone number. You can choose not to provide us with your personal data, but then you may not be able to take advantage of some of the website&apos;s features. For example, you won&apos;t be able to receive our Newsletter or contact us directly from the website. Users who are uncertain about what information is mandatory are welcome to contact us via swapnilkumar2028@gmail.com.
              </p>

              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Your rights:</h2>
              <p className="text-gray-300 mb-4">
                If you are a European resident, you have the following rights related to your personal data:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>The right to be informed.</li>
                <li>The right of access.</li>
                <li>The right to rectification.</li>
                <li>The right to erasure.</li>
                <li>The right to restrict processing.</li>
                <li>The right to data portability.</li>
                <li>The right to object.</li>
                <li>Rights in relation to automated decision-making and profiling.</li>
              </ul>
              <p className="text-gray-300 mb-8">
                If you would like to exercise this right, please contact us through the contact information below.
              </p>

              <p className="text-gray-300 mb-8">
                Additionally, if you are a European resident, we note that we are processing your information in order to fulfill contracts we might have with you (for example, if you make an order through the Site), or otherwise to pursue our legitimate business interests listed above. Additionally, please note that your information might be transferred outside of Europe, including Canada and the United States.
              </p>

              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Links to other websites:</h2>
              <p className="text-gray-300 mb-8">
                Our website may contain links to other websites that are not owned or controlled by us. Please be aware that we are not responsible for such other websites or third parties&apos; privacy practices. We encourage you to be aware when you leave our website and read the privacy statements of each website that may collect personal information.
              </p>

              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Information security:</h2>
              <p className="text-gray-300 mb-8">
                We secure information you provide on computer servers in a controlled, secure environment, protected from unauthorized access, use, or disclosure. We keep reasonable administrative, technical, and physical safeguards to protect against unauthorized access, use, modification, and personal data disclosure in its control and custody. However, no data transmission over the Internet or wireless network can be guaranteed.
              </p>

              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Legal disclosure:</h2>
              <p className="text-gray-300 mb-8">
                We will disclose any information we collect, use or receive if required or permitted by law, such as to comply with a subpoena or similar legal process, and when we believe in good faith that disclosure is necessary to protect our rights, protect your safety or the safety of others, investigate fraud, or respond to a government request.
              </p>

              <div className="mt-12 pt-8 border-t border-gray-700">
                <p className="text-gray-400 text-center">
                  For questions about this Privacy Policy, please contact us at: <br />
                  <span className="text-cyan-400">swapnilkumar2028@gmail.com</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}