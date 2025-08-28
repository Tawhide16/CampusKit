import { useState } from "react";
import { ChevronDown, User, Lock, Smartphone, Shield } from "lucide-react";

const faqs = [
  {
    question: "How do I create an account?",
    answer: "You can easily create an account by filling out our registration form with your email address and choosing a secure password. The process takes less than a minute, and you'll receive a confirmation email to verify your account.",
    icon: User
  },
  {
    question: "What should I do if I forget my password?",
    answer: "Simply click on 'Forgot Password?' on the login page and enter your registered email address. We'll send you a secure password reset link that will allow you to create a new password for your account.",
    icon: Lock
  },
  {
    question: "Can I log in from my mobile device?",
    answer: "Absolutely! Our platform is fully responsive and mobile-friendly. You can access your account seamlessly from any device - smartphone, tablet, or desktop - with the same great experience.",
    icon: Smartphone
  },
  {
    question: "How secure is my data?",
    answer: "Your data security is our top priority. We use industry-standard encryption, secure servers, and follow best practices for data protection. Your personal information is never shared with third parties without your explicit consent.",
    icon: Shield
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 mx-10 rounded-2xl py-8 shadow-lg">
        <div className="max-w-4xl mx-auto my-16 px-6 ">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Find answers to common questions about our platform. Can't find what you're looking for? Feel free to contact our support team.
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const Icon = faq.icon;
          const isOpen = openIndex === index;
          
          return (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-6 py-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-750"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white text-lg pr-4">
                      {faq.question}
                    </span>
                  </div>
                  <div className="flex-shrink-0">
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  isOpen 
                    ? 'max-h-96 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}
                style={{
                  overflow: 'hidden',
                }}
              >
                <div className="px-6 pb-5 pl-20">
                  <div className="border-l-4 border-gradient-to-b from-blue-500 to-purple-500 pl-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact Section */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Our support team is here to help you 24/7
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Contact Support
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default FAQ;