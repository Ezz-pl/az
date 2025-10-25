import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  X, 
  Home, 
  Car, 
  MapPin, 
  Users, 
  Shield,
  LogIn
} from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { path: "/", label: "الرئيسية", icon: Home },
    { path: "/vehicles", label: "المركبات", icon: Car },
    { path: "/regions", label: "المناطق", icon: MapPin },
    { path: "/host-portal", label: "بوابة المستضيفين", icon: Users, badge: "شركاء" },
  ];

  // إزالة نظام الإدارة من قائمة التنقل

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">منصة المغامرات</h1>
                <p className="text-xs text-gray-600">Adventure Platform</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className={`relative flex items-center space-x-2 space-x-reverse ${
                      isActive(item.path) 
                        ? "bg-green-600 hover:bg-green-700 text-white" 
                        : "text-gray-700 hover:text-green-600"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge className="absolute -top-2 -right-2 text-xs bg-red-500 text-white">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
            
            <div className="flex items-center space-x-3 space-x-reverse">
              <Button asChild size="sm" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <Link href="/login">
                  <LogIn className="w-4 h-4 ml-1" />
                  دخول
                </Link>
              </Button>
              
              <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/checkout">
                  احجز الآن
                </Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className={`w-full justify-start flex items-center space-x-3 space-x-reverse ${
                        isActive(item.path) 
                          ? "bg-green-600 hover:bg-green-700 text-white" 
                          : "text-gray-700 hover:text-green-600"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge className="mr-auto text-xs bg-red-500 text-white">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                );
              })}
              
              {/* أزرار تسجيل الدخول للجوال */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <LogIn className="w-4 h-4 ml-1" />
                    تسجيل الدخول
                  </Button>
                </Link>
                
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    احجز الآن
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}