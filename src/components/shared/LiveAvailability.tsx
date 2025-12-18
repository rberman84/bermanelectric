import { useState, useEffect } from "react";
import { Clock, CheckCircle2, Calendar } from "lucide-react";

const LiveAvailability = () => {
  const [availability, setAvailability] = useState<{
    status: "available" | "busy" | "limited";
    nextSlot: string;
    slotsToday: number;
  } | null>(null);

  useEffect(() => {
    // Simulate live availability based on current time
    const checkAvailability = () => {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();
      
      // Business hours: Mon-Fri 7AM-7PM, Sat 8AM-4PM
      const isWeekday = day >= 1 && day <= 5;
      const isSaturday = day === 6;
      const isSunday = day === 0;
      
      let status: "available" | "busy" | "limited" = "available";
      let nextSlot = "";
      let slotsToday = 0;
      
      if (isSunday) {
        status = "limited";
        nextSlot = "Monday 7:00 AM";
        slotsToday = 0;
      } else if (isSaturday) {
        if (hour < 8) {
          status = "available";
          nextSlot = "Today 8:00 AM";
          slotsToday = 4;
        } else if (hour < 16) {
          status = "available";
          nextSlot = `Today ${hour + 1}:00 ${hour + 1 < 12 ? 'AM' : 'PM'}`;
          slotsToday = Math.max(1, 16 - hour);
        } else {
          status = "limited";
          nextSlot = "Monday 7:00 AM";
          slotsToday = 0;
        }
      } else if (isWeekday) {
        if (hour < 7) {
          status = "available";
          nextSlot = "Today 7:00 AM";
          slotsToday = 6;
        } else if (hour < 19) {
          // Simulate varying availability throughout the day
          const remainingHours = 19 - hour;
          slotsToday = Math.max(1, Math.floor(remainingHours / 2));
          
          if (slotsToday >= 3) {
            status = "available";
          } else if (slotsToday >= 1) {
            status = "busy";
          } else {
            status = "limited";
          }
          
          const nextHour = hour + 1;
          nextSlot = `Today ${nextHour > 12 ? nextHour - 12 : nextHour}:00 ${nextHour >= 12 ? 'PM' : 'AM'}`;
        } else {
          status = "limited";
          if (day === 5) {
            nextSlot = "Saturday 8:00 AM";
          } else {
            nextSlot = "Tomorrow 7:00 AM";
          }
          slotsToday = 0;
        }
      }
      
      setAvailability({ status, nextSlot, slotsToday });
    };
    
    checkAvailability();
    const interval = setInterval(checkAvailability, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  if (!availability) return null;

  const statusConfig = {
    available: {
      bg: "bg-[hsl(140,70%,92%)]",
      border: "border-[hsl(140,60%,70%)]",
      text: "text-[hsl(140,60%,30%)]",
      icon: CheckCircle2,
      label: "Available Today",
      pulse: true
    },
    busy: {
      bg: "bg-[hsl(45,90%,92%)]",
      border: "border-[hsl(45,80%,60%)]",
      text: "text-[hsl(45,80%,30%)]",
      icon: Clock,
      label: "Limited Slots",
      pulse: true
    },
    limited: {
      bg: "bg-[hsl(0,0%,95%)]",
      border: "border-[hsl(0,0%,80%)]",
      text: "text-[hsl(0,0%,40%)]",
      icon: Calendar,
      label: "Next Available",
      pulse: false
    }
  };

  const config = statusConfig[availability.status];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-full ${config.bg} ${config.border} border`}>
      <div className="relative">
        <Icon className={`w-5 h-5 ${config.text}`} />
        {config.pulse && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(140,70%,50%)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[hsl(140,70%,45%)]"></span>
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <span className={`text-sm font-semibold ${config.text}`}>{config.label}</span>
        <span className="text-xs text-muted-foreground">
          {availability.status === "available" && availability.slotsToday > 0
            ? `${availability.slotsToday} slots open • Next: ${availability.nextSlot}`
            : `Next: ${availability.nextSlot}`
          }
        </span>
      </div>
    </div>
  );
};

export default LiveAvailability;