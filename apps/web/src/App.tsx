import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import ServiceSection from '@/components/ServiceSection';
import CaseStudySection from '@/components/CaseStudySection';
import CalendarWidget from '@/components/CalendarWidget';
import { ArrowRight, CheckCircle, Zap, Shield, Globe } from 'lucide-react';
import { ThemeProvider } from '@/hooks/use-theme';

function HeroSection() {
  return (
    <section className="min-h-screen flex items-center pt-16 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Trusted by 500+ Companies Worldwide
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Transform Your Business with{' '}
              <span className="text-primary">Intelligent IT Solutions</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              We deliver cutting-edge technology solutions that drive growth, enhance security, and streamline operations.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <Button size="lg" onClick={() => document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })}>
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.querySelector('#case-studies')?.scrollIntoView({ behavior: 'smooth' })}>
                View Our Work
              </Button>
            </div>
            <div className="flex flex-wrap gap-8">
              <div>
                <div className="text-3xl font-bold">98%</div>
                <div className="text-sm text-muted-foreground">Client Satisfaction</div>
              </div>
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm text-muted-foreground">Projects Delivered</div>
              </div>
              <div>
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-muted-foreground">Support Available</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl" />
            <div className="relative bg-card rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-6 rounded-2xl">
                  <Shield className="w-10 h-10 text-primary mb-3" />
                  <h3 className="font-semibold">Enterprise Security</h3>
                  <p className="text-sm text-muted-foreground mt-1">Bank-grade protection</p>
                </div>
                <div className="bg-muted/50 p-6 rounded-2xl">
                  <Zap className="w-10 h-10 text-primary mb-3" />
                  <h3 className="font-semibold">Lightning Fast</h3>
                  <p className="text-sm text-muted-foreground mt-1">Optimized performance</p>
                </div>
                <div className="bg-muted/50 p-6 rounded-2xl">
                  <Globe className="w-10 h-10 text-primary mb-3" />
                  <h3 className="font-semibold">Global Scale</h3>
                  <p className="text-sm text-muted-foreground mt-1">Worldwide presence</p>
                </div>
                <div className="bg-muted/50 p-6 rounded-2xl">
                  <CheckCircle className="w-10 h-10 text-primary mb-3" />
                  <h3 className="font-semibold">Certified Experts</h3>
                  <p className="text-sm text-muted-foreground mt-1">Industry leaders</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BookingSection() {
  return (
    <section id="booking" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Book a Consultation</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ready to transform your business? Schedule a free consultation with our experts.
          </p>
        </div>
        <CalendarWidget />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-background border-t py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold">Savannah Labs</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Leading IT consulting firm delivering innovative solutions for businesses worldwide.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Cloud Infrastructure</li>
              <li>Cybersecurity</li>
              <li>Software Development</li>
              <li>Data Analytics</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>About Us</li>
              <li>Careers</li>
              <li>Contact</li>
              <li>Blog</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>hello@savannah-labs.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Tech Street</li>
              <li>San Francisco, CA</li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          © 2024 Savannah Labs. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="savannah-labs-theme">
      <div className="min-h-screen bg-background">
        <Navbar />
        <HeroSection />
        <ServiceSection />
        <CaseStudySection />
        <BookingSection />
        <Footer />
      </div>
    </ThemeProvider>
  );
}