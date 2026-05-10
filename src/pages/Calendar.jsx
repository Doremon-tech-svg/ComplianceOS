import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import ProgressBar from "../components/ui/ProgressBar";
import { Button } from "../components/ui/Common";
import { apiFetch } from "../services/api";
import { getUserId } from "../utils/helpers";
import { deadlines } from "../utils/constants";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const DAYS = [27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
const MUTED = new Set([0, 1, 2, 3, 4]);
const EVENT_DAYS = new Set([4, 7, 10, 14]);

export default function CalendarPage() {
  const [deadlineData, setDeadlineData] = useState(deadlines);
  const [selected, setSelected] = useState(10);

  useEffect(() => {
    apiFetch(`/api/compliance/calendar/${getUserId()}`).then(setDeadlineData).catch(() => { });
  }, []);

  const dayEvents = deadlineData.filter((d) =>
    d.deadline_date?.includes(`-${String(selected).padStart(2, "0")}`)
  );

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-start justify-between mb-7">
          <div>
            <h1 className="text-3xl font-bold text-cs-900 tracking-tight">Compliance Calendar</h1>
            <p className="text-cs-400 text-sm mt-1">Track regulatory deadlines for Q4 2024</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">Export CSV</Button>
            <Button variant="primary" size="sm">Add Event</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          {/* Month card */}
          <div className="bg-white border border-cs-100 rounded-2xl p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-cs-900 text-xl">November 2024</h2>
              <div className="flex gap-4 text-2xl text-cs-400 select-none">
                <span className="cursor-pointer hover:text-cs-700">‹</span>
                <span className="cursor-pointer hover:text-cs-700">›</span>
              </div>
            </div>
            <div className="grid grid-cols-7 mb-2">
              {WEEKDAYS.map((d) => (
                <span key={d} className="text-center text-xs font-bold text-cs-500 tracking-widest">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-2">
              {DAYS.map((day, idx) => {
                const muted = MUTED.has(idx);
                const hasEvent = EVENT_DAYS.has(day) && !muted;
                const isSelected = selected === day && !muted;
                return (
                  <motion.button
                    key={`${day}-${idx}`}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => !muted && setSelected(day)}
                    className={`relative mx-auto w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors
                      ${muted ? "text-cs-300" : "text-cs-800 hover:bg-cs-50"}
                      ${isSelected ? "!bg-cs-900 !text-cs-50" : ""}`}
                  >
                    {day}
                    {hasEvent && (
                      <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isSelected ? "bg-cs-300" : "bg-cs-500"}`} />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Side panels */}
          <div className="flex flex-col gap-5">
            <div className="bg-white border border-cs-100 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-cs-900 text-base">Nov {selected}, 2024</h2>
                <span className="text-cs-400 text-xs font-bold tracking-widest">{dayEvents.length || 3} TASKS</span>
              </div>
              {(dayEvents.length ? dayEvents : deadlineData.slice(0, 3)).map((ev) => (
                <div key={ev.id} className="border-l-4 border-cs-500 pl-4 py-3 mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-cs-900 text-sm">{ev.title}</p>
                    <p className="text-cs-400 text-xs mt-0.5">{ev.description}</p>
                  </div>
                  <span className="bg-cs-100 text-cs-600 text-xs font-bold px-2 py-0.5 rounded flex-shrink-0">{ev.compliance_type}</span>
                </div>
              ))}
            </div>

            <div className="bg-white border border-cs-100 rounded-2xl p-5">
              <h2 className="font-bold text-cs-900 text-base mb-3">Upcoming Deadlines</h2>
              {deadlineData.slice(3).map((d) => (
                <div key={d.id} className="border-l-4 border-cs-300 pl-4 py-2 mb-2 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-cs-900 text-sm">{d.title}</p>
                    <p className="text-cs-400 text-xs">{d.description}</p>
                  </div>
                  <ArrowRight size={16} className="text-cs-400 flex-shrink-0" />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[["TOTAL TASKS", "18", "text-cs-900"], ["CRITICAL", "04", "text-red-600"]].map(([label, val, color]) => (
                <div key={label} className="bg-white border border-cs-100 rounded-2xl p-4">
                  <p className="text-xs font-bold text-cs-500 tracking-widest">{label}</p>
                  <p className={`text-3xl font-bold mt-1 ${color}`}>{val}</p>
                </div>
              ))}
            </div>

            <div className="bg-cs-900 rounded-2xl p-5 text-cs-50">
              <h2 className="font-bold text-base mb-3">Risk Forecast</h2>
              <div className="flex items-center justify-between mb-2">
                <span className="text-cs-300 text-sm">Late Filing Risk</span>
                <span className="bg-cs-700 text-red-300 text-xs font-bold px-2 py-0.5 rounded">LOW</span>
              </div>
              <ProgressBar value={18} size="sm" />
              <p className="text-cs-400 text-xs mt-3 leading-relaxed">Submission speed increased 12% this quarter.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
