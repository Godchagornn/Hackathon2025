import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MapPin, User, Leaf, RefreshCw } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";

export interface ItemCardProps {
  image: string;
  title: string;
  category: string;
  condition: string;
  location: string;
  user: string;
  ecoScore?: number;
  expiryDate?: string; // NEW: expiry date for the post
  onExchangeClick?: () => void;
  isOwner?: boolean;
}

export function ItemCard({
  image,
  title,
  category,
  condition,
  location,
  user,
  ecoScore,
  expiryDate,
  onExchangeClick,
  isOwner,
}: ItemCardProps) {
  return (
    <Card className="overflow-hidden rounded-2xl hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary/20">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full">
            Exchange
          </Badge>
        </div>
        {/* Countdown Timer Badge - Top Left */}
        {expiryDate && (
          <div className="absolute top-3 left-3">
            <CountdownTimer expiryDate={expiryDate} />
          </div>
        )}
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div>
          <h4 className="mb-1">{title}</h4>
          <Badge variant="outline" className="rounded-full text-xs">
            {category}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-xs">Condition:</span>
            <span className="text-xs text-foreground">{condition}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" />
            <span className="text-xs">{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5" />
            <span className="text-xs">{user}</span>
          </div>
        </div>

        {!isOwner && (
          <div className="mt-2">
            <Button 
              className="w-full rounded-xl gap-2"
              onClick={onExchangeClick}
            >
              <RefreshCw className="h-4 w-4" />
              Exchange
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
