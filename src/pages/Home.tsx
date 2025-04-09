
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Camera, Search, BookImage, Users, Star, MessageSquare, ChevronRight, Mail } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 md:px-10 flex items-center justify-between border-b border-border">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">PhotoFlow</h1>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
            About Us
          </a>
          <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
            Testimonials
          </a>
          <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link to="/login">
            <Button>Log In</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 md:px-10 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mb-6">
          Smart Photo Management for Photographers and Event Managers
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
          Automate your workflow, organize your photos with AI, and deliver beautiful digital albums to your clients.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/login">
            <Button size="lg" className="px-8">
              Get Started
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <a href="#features">
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 md:px-10 bg-muted">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-lg shadow-sm border border-border">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-6">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Photo Management</h3>
              <p className="text-muted-foreground">
                Upload and organize all your event photos in one place. Batch process and organize your work effortlessly.
              </p>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-sm border border-border">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-6">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Smart Search</h3>
              <p className="text-muted-foreground">
                Find photos using face recognition or text prompts. Our AI helps you locate the perfect shots instantly.
              </p>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-sm border border-border">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-6">
                <BookImage className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Digital Albums</h3>
              <p className="text-muted-foreground">
                Create beautiful digital albums to deliver to your clients. Custom branding and easy sharing options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">About Us</h2>
              <p className="text-muted-foreground mb-4">
                PhotoFlow was created by photographers who understand the challenges of managing thousands of event photos. 
                Our mission is to streamline the photography workflow with powerful AI tools.
              </p>
              <p className="text-muted-foreground mb-6">
                We combine cutting-edge technology with a user-friendly interface to help photographers and event managers 
                save time and deliver exceptional results to their clients.
              </p>
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Trusted by Professionals</h4>
                  <p className="text-sm text-muted-foreground">Over 1,000 photographers use PhotoFlow</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 bg-accent rounded-lg p-8">
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <Camera className="h-20 w-20 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 md:px-10 bg-muted">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-lg shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              </div>
              <p className="italic text-muted-foreground mb-6">
                "PhotoFlow has completely transformed how I deliver wedding photos to my clients. The face recognition feature 
                alone has saved me countless hours of sorting through thousands of images."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="font-medium text-primary">JD</span>
                </div>
                <div>
                  <h4 className="font-medium">John Doe</h4>
                  <p className="text-sm text-muted-foreground">Wedding Photographer</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              </div>
              <p className="italic text-muted-foreground mb-6">
                "As an event manager, I need to quickly find specific moments from corporate events. The smart search 
                feature has been a game-changer for our team's efficiency."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="font-medium text-primary">JS</span>
                </div>
                <div>
                  <h4 className="font-medium">Jane Smith</h4>
                  <p className="text-sm text-muted-foreground">Corporate Event Manager</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              </div>
              <p className="italic text-muted-foreground mb-6">
                "The digital album feature has elevated my business. My clients are impressed with how quickly I can 
                deliver professional, branded albums after their events."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="font-medium text-primary">RJ</span>
                </div>
                <div>
                  <h4 className="font-medium">Robert Johnson</h4>
                  <p className="text-sm text-muted-foreground">Portrait Photographer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <p className="text-muted-foreground mb-10">
            Have questions about PhotoFlow? Our team is here to help you get started.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <div className="flex items-center p-4 bg-card rounded-lg border border-border w-full sm:w-auto">
              <Mail className="h-5 w-5 text-primary mr-3" />
              <span>support@photoflow.com</span>
            </div>
            <div className="flex items-center p-4 bg-card rounded-lg border border-border w-full sm:w-auto">
              <MessageSquare className="h-5 w-5 text-primary mr-3" />
              <span>Live Chat Available</span>
            </div>
          </div>
          <Link to="/login">
            <Button size="lg" className="px-8">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-10 bg-card border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-xl font-bold text-primary">PhotoFlow</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Smart photo management for photographers
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h3 className="font-medium mb-3">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Pricing</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#about" className="text-sm text-muted-foreground hover:text-foreground">About Us</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Blog</a></li>
                  <li><a href="#contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2025 PhotoFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
