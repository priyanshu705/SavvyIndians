'use client';

import { motion } from 'framer-motion';

export default function TermsAndConditions() {
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
              Terms and Conditions
            </motion.h1>

            <motion.div 
              className="prose prose-lg prose-invert max-w-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <p className="text-xl text-gray-300 mb-8">
                Welcome to SavvyIndians.com!
              </p>

              <p className="text-gray-300 mb-6">
                These terms and conditions outline the rules and regulations for the use of SavvyIndians&apos;s Website, located at https://savvyindians.com.
              </p>

              <p className="text-gray-300 mb-8">
                By accessing this website, we assume you accept these terms and conditions. Do not continue to use SavvyIndians.com if you do not agree to take all of the terms and conditions stated on this page.
              </p>

              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Cookies:</h2>
              <p className="text-gray-300 mb-4">
                The website uses cookies to help personalize your online experience. By accessing SavvyIndians.com, you agreed to use the required cookies.
              </p>
              <p className="text-gray-300 mb-6">
                A cookie is a text file that is placed on your hard disk by a web page server. Cookies cannot be used to run programs or deliver viruses to your computer. Cookies are uniquely assigned to you and can only be read by a web server in the domain that issued the cookie to you.
              </p>
              <p className="text-gray-300 mb-8">
                We may use cookies to collect, store, and track information for statistical or marketing purposes to operate our website. You have the ability to accept or decline optional Cookies. There are some required Cookies that are necessary for the operation of our website. These cookies do not require your consent as they always work. Please keep in mind that by accepting required Cookies, you also accept third-party Cookies, which might be used via third-party provided services if you use such services on our website, for example, a video display window provided by third parties and integrated into our website.
              </p>

              <h2 className="text-2xl font-bold text-cyan-400 mb-4">License:</h2>
              <p className="text-gray-300 mb-4">
                Unless otherwise stated, SavvyIndians and/or its licensors own the intellectual property rights for all material on SavvyIndians.com. All intellectual property rights are reserved. You may access this from SavvyIndians.com for your own personal use subjected to restrictions set in these terms and conditions.
              </p>
              <p className="text-gray-300 mb-4">You must not:</p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Copy or republish material from SavvyIndians.com</li>
                <li>Sell, rent, or sub-license material from SavvyIndians.com</li>
                <li>Reproduce, duplicate or copy material from SavvyIndians.com</li>
                <li>Redistribute content from SavvyIndians.com</li>
              </ul>
              <p className="text-gray-300 mb-8">This Agreement shall begin on the date hereof.</p>

              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Comments:</h2>
              <p className="text-gray-300 mb-4">
                Parts of this website offer users an opportunity to post and exchange opinions and information in certain areas of the website. SavvyIndians does not filter, edit, publish or review Comments before their presence on the website. Comments do not reflect the views and opinions of SavvyIndians, its agents, and/or affiliates. Comments reflect the views and opinions of the person who posts their views and opinions.
              </p>
              <p className="text-gray-300 mb-6">
                To the extent permitted by applicable laws, SavvyIndians shall not be liable for the Comments or any liability, damages, or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.
              </p>
              <p className="text-gray-300 mb-4">
                SavvyIndians reserves the right to monitor all Comments and remove any Comments that can be considered inappropriate, offensive, or causes breach of these Terms and Conditions.
              </p>
              <p className="text-gray-300 mb-4">You warrant and represent that:</p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>You are entitled to post the Comments on our website and have all necessary licenses and consents to do so;</li>
                <li>The Comments do not invade any intellectual property right, including without limitation copyright, patent, or trademark of any third party;</li>
                <li>The Comments do not contain any defamatory, libelous, offensive, indecent, or otherwise unlawful material, which is an invasion of privacy.</li>
                <li>The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.</li>
              </ul>
              <p className="text-gray-300 mb-8">
                You hereby grant SavvyIndians a non-exclusive license to use, reproduce, edit and authorize others to use, reproduce and edit any of your Comments in any and all forms, formats, or media.
              </p>

              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Hyperlinking to our Content:</h2>
              <p className="text-gray-300 mb-4">The following organizations may link to our Website without prior written approval:</p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Government agencies;</li>
                <li>Search engines;</li>
                <li>News organizations;</li>
                <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and</li>
                <li>System-wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.</li>
              </ul>

              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Content Liability:</h2>
              <p className="text-gray-300 mb-8">
                We shall not be held responsible for any content that appears on your Website. You agree to protect and defend us against all claims that are raised on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene, or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
              </p>

              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Reservation of Rights:</h2>
              <p className="text-gray-300 mb-8">
                We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amend these terms and conditions and its linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
              </p>

              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Disclaimer:</h2>
              <p className="text-gray-300 mb-4">
                To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Limit or exclude our or your liability for death or personal injury;</li>
                <li>Limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
                <li>Limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
                <li>Exclude any of our or your liabilities that may not be excluded under applicable law.</li>
              </ul>
              <p className="text-gray-300 mb-8">
                As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
              </p>

              <div className="mt-12 pt-8 border-t border-gray-700">
                <p className="text-gray-400 text-center">
                  For questions about these Terms and Conditions, please contact us at: <br />
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