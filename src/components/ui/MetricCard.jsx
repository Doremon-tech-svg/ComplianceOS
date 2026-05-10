import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

/**
 * @param {{ title: string, value: string|number, subtitle?: string, icon: React.ReactNode, trend?: 'up'|'down'|'neutral', trendValue?: string }} props
 */
export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend = "neutral",
  trendValue,
}) {
  const trendConfig = {
    up:      { icon: TrendingUp,   color: "text-cs-500", bg: "bg-cs-100" },
    down:    { icon: TrendingDown, color: "text-cs-700", bg: "bg-cs-200" },
    neutral: { icon: Minus,        color: "text-cs-400", bg: "bg-cs-100" },
  };

  const TrendIcon = trendConfig[trend].icon;

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-cs-100 rounded-2xl p-6 flex flex-col gap-3"
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-full bg-cs-100 flex items-center justify-center text-cs-600">
          {icon}
        </div>

        {trendValue && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trendConfig[trend].bg} ${trendConfig[trend].color}`}
          >
            <TrendIcon size={12} />
            {trendValue}
          </span>
        )}
      </div>

      {/* Value */}
      <div>
        <p className="text-3xl font-bold text-cs-900 tracking-tight leading-none">
          {value}
        </p>
        <p className="text-cs-600 text-sm font-medium mt-1">{title}</p>
        {subtitle && (
          <p className="text-cs-400 text-xs mt-0.5">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
