export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">Privacy Policy</h1>
      <div className="bg-white shadow-md rounded-lg p-8">
        <p className="mb-2 font-semibold">Last Updated: July 6, 2025</p>
        <p className="mb-4">
          At CleanModo, your privacy is our top priority. This policy explains what types of information we collect, how we use it, and how we protect it.
        </p>
        <h2 className="text-xl font-bold mt-6 mb-2">1. Information We Collect:</h2>
        <ul className="list-disc pl-6 mb-4 space-y-1 text-gray-700">
          <li>
            <b>Account Information:</b> When you create an account, we collect your email address and encrypted password.
          </li>
          <li>
            <b>Task Data:</b> We store the tasks you create, edit, delete, and their completion status. This data is linked to your private account to provide you with the service.
          </li>
          <li>
            <b>Usage Data:</b> We may collect non-personal information about how you interact with our site to improve the service.
          </li>
        </ul>
        <h2 className="text-xl font-bold mt-6 mb-2">2. How We Use Your Information:</h2>
        <ul className="list-disc pl-6 mb-4 space-y-1 text-gray-700">
          <li>To provide, operate, and maintain our services.</li>
          <li>To improve and personalize your experience on the site.</li>
          <li>To communicate with you, including sending service updates and responding to your inquiries.</li>
          <li>We do not sell, rent, or share your personal information with any third party for marketing purposes.</li>
        </ul>
        <h2 className="text-xl font-bold mt-6 mb-2">3. Data Security:</h2>
        <p className="mb-4">
          We use security best practices, relying on the secure infrastructure of Supabase, to protect your data. All communications are encrypted, and we take strict measures to protect your information from unauthorized access.
        </p>
        <h2 className="text-xl font-bold mt-6 mb-2">4. Your Rights:</h2>
        <p>
          You have the right to access, correct, or request the deletion of your personal data at any time by contacting us.
        </p>
      </div>
    </div>
  );
}
