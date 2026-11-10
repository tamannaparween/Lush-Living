import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/")({
  component: RouteComponent,
});

// After clicking on pay, Open a modal with a success message and Icon with order details and a button to go back to home page.
// The modal will have a loading state (use setTimeout) of 3 seconds before showing the success message.
function RouteComponent() {
  return (
    <div className="flex justify-between w-full">
      {/* Form for Address */}
      <div>Address Field</div>
      {/* Order Details + Pay Button */}
      <div>Order Details</div>
    </div>
  );
}