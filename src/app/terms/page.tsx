export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">Terms of Service</h1>
      <div className="bg-white shadow-md rounded-lg p-8">
        <p className="mb-2 font-semibold">Last Updated: July 6, 2025</p>
        <h2 className="text-xl font-bold mb-2">Welcome to CleanModo. By using our website and services, you agree to be bound by these Terms.</h2>

        <h3 className="text-lg font-semibold mt-4 mb-2">1. Use of Service:</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1 text-gray-700">
          <li>You must be of legal age to create an account.</li>
          <li>You are responsible for maintaining the confidentiality of your account information and password.</li>
          <li>You agree not to use the service for any illegal or prohibited purpose.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2">2. Your Content:</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1 text-gray-700">
          <li>You retain ownership of all tasks and data you enter into your account ("Your Content").</li>
          <li>By creating tasks, you grant us only the necessary license to store and display them to you as part of providing the service.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2">3. Account Termination:</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1 text-gray-700">
          <li>We may suspend or terminate your account immediately, without prior notice, if you breach these Terms.</li>
          <li>You can terminate your account at any time by contacting us.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2">4. Disclaimer:</h3>
        <p className="mb-4">
          The service is provided "as is" without any warranties. We do not guarantee that the service will always be available or free of errors.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-2">5. Changes to Terms:</h3>
        <p>
          We reserve the right to modify these terms at any time. We will notify you of any material changes. Your continued use of the service after such changes constitutes your consent to the new terms.
        </p>
      </div>
    </div>
  );
}
