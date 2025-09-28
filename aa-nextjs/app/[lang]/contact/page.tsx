export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">
            Contact Us
          </h1>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Get in Touch
              </h2>
              <p className="text-muted-foreground mb-6">
                Ready to start your Adriatic adventure? We&apos;re here to help
                you plan the perfect yacht charter experience. Contact us today!
              </p>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-primary text-xl">📧</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-muted-foreground">
                      info@auroraadriatic.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-primary text-xl">📞</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <p className="text-muted-foreground">+385 91 234 5678</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-primary text-xl">📍</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Address</p>
                    <p className="text-muted-foreground">
                      Marina Split
                      <br />
                      Split, Croatia 21000
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Send us a Message
              </h2>
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Tell us about your dream yacht charter..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Business Hours
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">Monday - Friday</p>
                <p>9:00 AM - 6:00 PM</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Saturday</p>
                <p>10:00 AM - 4:00 PM</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Sunday</p>
                <p>Closed</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Emergency</p>
                <p>24/7 for charter guests</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
