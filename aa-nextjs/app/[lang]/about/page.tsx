export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">About Us</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground text-xl mb-6">
              Welcome to Aurora Adriatic - your gateway to premium yacht charter
              experiences and luxury adventures in the beautiful Adriatic Sea.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Our Mission
                </h2>
                <p className="text-muted-foreground">
                  We are dedicated to providing exceptional yacht charter
                  services, combining luxury, comfort, and adventure to create
                  unforgettable experiences on the crystal-clear waters of the
                  Adriatic.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Our Vision
                </h2>
                <p className="text-muted-foreground">
                  To be the premier choice for discerning travelers seeking
                  authentic Adriatic experiences, delivered with unparalleled
                  service and attention to detail.
                </p>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Why Choose Aurora Adriatic?
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  Premium fleet of luxury yachts
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  Experienced and professional crew
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  Customized itineraries for every preference
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  24/7 concierge service
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  Sustainable and eco-friendly practices
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
