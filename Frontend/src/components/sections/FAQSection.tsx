import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What is the Pomodoro Technique?',
    answer: 'The Pomodoro Technique is a time management method developed by Francesco Cirillo. It uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. After four pomodoros, you take a longer break of 15-30 minutes.',
  },
  {
    question: 'How do I use the keyboard shortcuts?',
    answer: 'Press "S" to start the timer, "P" to pause, "R" to reset, and "F" to toggle fullscreen mode. These shortcuts work anytime the page is focused, making it easy to control the timer without using your mouse.',
  },
  {
    question: 'Will I hear an alarm when the timer ends?',
    answer: 'Yes! When the countdown reaches zero, you\'ll hear a pleasant chime sound to notify you. Make sure your device\'s volume is turned on. The sound works even if the browser tab is in the background.',
  },
  {
    question: 'Can I customize the Pomodoro durations?',
    answer: 'Currently, the Pomodoro timer uses the traditional 25-minute work sessions with 5-minute short breaks and 15-minute long breaks. Future updates will include customizable durations.',
  },
  {
    question: 'Does the timer work offline?',
    answer: 'Yes! Once the page is loaded, the timer runs entirely in your browser and doesn\'t require an internet connection. Your preferences are also saved locally on your device.',
  },
  {
    question: 'Is my data saved?',
    answer: 'Your timer sessions and habits are securely stored in our database so you can access them from any device after logging in. Some simple display preferences (like theme or sound volume) may be saved locally in your browser for convenience.',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-muted-foreground">
            Find answers to common questions about TimerFlow.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border/50 rounded-xl px-6 bg-card/50 data-[state=open]:bg-card"
            >
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="font-medium">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
