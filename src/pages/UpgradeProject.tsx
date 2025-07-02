import { useNavigate, useParams } from "react-router-dom";

export default function PaymentOptionsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const paymentMethods = [
    {
      id: "razorpay",
      name: "Razorpay",
      description: "Pay using UPI, Cards, Wallets and more.",
      icon: <img src="https://play-lh.googleusercontent.com/2BQu8Y7Ah9Gh9CZvmaMSYIcZvdO4KfdJ26EZ1WGyaOG_xxeDxNn-AZYxOtQJvyQQPFY=w600-h300-pc0xffffff-pd" alt="" />,
      available: true,
    },
  ];

  const handleSelect = (id: string) => {
    if (id === "razorpay") {
      navigate(`/payment/razorpay/${projectId}`);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0e0f11] text-neutral-800 dark:text-white px-6 py-12">
      <div className="max-w-2xl mx-auto bg-white dark:bg-[#1a1c1f] rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
          Select a Payment Method
        </h1>
        <p className="text-sm mb-8 text-neutral-600 dark:text-neutral-400">
          Project ID:{" "}
          <span className="font-semibold text-black dark:text-white">
            {projectId}
          </span>
        </p>

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              disabled={!method.available}
              onClick={() => handleSelect(method.id)}
              className={`w-full flex items-center justify-between gap-4 p-4 rounded-md border transition-all duration-200
                ${
                  method.available
                    ? "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                    : "border-neutral-200 dark:border-neutral-800 opacity-50 cursor-not-allowed"
                }
              `}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
                  {method.icon}
                </div>
                <div className="text-left">
                  <h3 className="text-base font-semibold">{method.name}</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {method.description}
                  </p>
                </div>
              </div>
              <span className="text-sm text-indigo-500 font-medium">
                {method.available ? "Select" : "Coming Soon"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
