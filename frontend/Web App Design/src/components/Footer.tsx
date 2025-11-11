import { Leaf, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t bg-card mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Logo and Description */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-primary">CMU ShareCycle</span>
                <span className="text-xs text-muted-foreground">Green Campus Initiative</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Share More, Waste Less. Building a sustainable campus community together.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="h-4 w-4 text-primary fill-primary" /> for Chiang Mai University
          </p>
          <p className="mt-2">© 2025 CMU ShareCycle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
