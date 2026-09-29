export default function WorkflowSection() {
  const steps = [
    {
      title: "Create your RFQ",
      description:
        "Add your items, lots, quantities, and specifications using a structured, standardized format.",
    },
    {
      title: "Bring your own vendors",
      description:
        "Privately invite your existing suppliers via a secure email link. Suppliers join and submit quotes with zero onboarding friction.",
    },
    {
      title: "Collect bids or run an auction",
      description:
        "Choose a standard RFQ process or trigger a live reverse auction to drive competitive pricing.",
    },
    {
      title: "Award the best offer",
      description:
        "Compare final quotations and select your winner. You always make the final award decision based on your own criteria.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 bg-background border-b border-border px-6"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-primary mb-16">
          The logical next step for your procurement workflow.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="border border-border p-6 bg-white relative shadow-sm"
            >
              <div className="text-3xl font-bold text-slate-500 mb-4 font-mono">
                0{index + 1}
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
