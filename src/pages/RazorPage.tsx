import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import conf from "@/conf/conf";
import callApiPost from "@/utils/callApiPost";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOrderResponse {
  keyId: string;
  amount: number;
  currency: string;
  orderID: string;
  data : any;
  notes: {
    name: string;
    emailId: string;
  };
}

function RazorPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const startPayment = async () => {
      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded. Please try again.");
        return;
      }

      try {
        const res = await callApiPost(`${conf.backendUrl}/payment/razor/create`, {
          projectId
        }) as RazorpayOrderResponse | null;

        const order = res?.data;

        const options = {
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: "TaskNet",
          description: "Project Upgrade",
          image: "https://task-net.s3.eu-north-1.amazonaws.com/1751279529406-logo.png",
          order_id: order.orderID,
          prefill: {
            name: order.notes.name,
            email: order.notes.emailId,
          },
          notes: {
            projectId,
            name: order.notes.name,
            email: order.notes.emailId,
          },
          theme: {
            color: "#1f2937",
          },
          handler: function (response : any) {
            console.log("Payment Success:", response);
            navigate(`/projects/${projectId}`);
          },
          modal: {
            escape: false,
            ondismiss: function () {
              console.log("Payment dismissed by user");
              navigate(`/upgrade/${projectId}`);
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (err) {
        console.error("Payment error:", err);
        navigate(`/projects/${projectId}?payment=error`);
      }
    };

    startPayment();
  }, [projectId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
      <div className="text-center animate-pulse">
        <h1 className="text-2xl font-semibold mb-2">Processing Payment...</h1>
        <p className="text-sm text-gray-400">Please do not refresh or close this window.</p>
      </div>
    </div>
  );
}

export default RazorPage;
