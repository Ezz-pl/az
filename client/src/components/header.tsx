import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Car, Menu, User, LogIn } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "الرئيسية", icon: null },
    { href: "/vehicles", label: "المركبات", icon: null },
    { href: "/about", label: "من نحن", icon: null },
    { href: "/contact", label: "اتصل بنا", icon: null },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Car className="text-primary text-2xl" />
            <span className="text-2xl font-bold text-primary">رحلاتي</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-neutral hover:text-primary transition-colors font-medium ${
                  location === item.href ? "text-primary" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" className="text-neutral hover:text-primary">
              <User className="w-4 h-4 ml-2" />
              تسجيل الدخول
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <LogIn className="w-4 h-4 ml-2" />
              إنشاء حساب
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-8">
                {/* Mobile Logo */}
                <div className="flex items-center gap-2">
                  <Car className="text-primary text-2xl" />
                  <span className="text-2xl font-bold text-primary">رحلاتي</span>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-lg font-medium p-3 rounded-lg transition-colors ${
                        location === item.href
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Auth Buttons */}
                <div className="flex flex-col gap-3 mt-8">
                  <Button variant="outline" className="w-full">
                    <User className="w-4 h-4 ml-2" />
                    تسجيل الدخول
                  </Button>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <LogIn className="w-4 h-4 ml-2" />
                    إنشاء حساب
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
