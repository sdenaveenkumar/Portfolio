import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  LineChart,
} from 'recharts';

const data = [
  { semester: 'Sem 1', cgpa: 9.5 },
  { semester: 'Sem 2', cgpa: 8.55 },
  { semester: 'Sem 3', cgpa: 9.11 },
  { semester: 'Sem 4', cgpa: 8.1 },
];

const transcriptData = {
  "Sem 1": [
    { code: "DCA1101", name: "Fundamentals of IT & Programming", total: 83, grade: "A", color: "bg-green-100 text-green-700" },
    { code: "DCA1102", name: "Programming in C", total: 93, grade: "A+", color: "bg-emerald-100 text-emerald-700" },
    { code: "DCA1103", name: "Basic Mathematics", total: 94, grade: "A+", color: "bg-emerald-100 text-emerald-700" },
    { code: "DCA1104", name: "Understanding PC & Troubleshooting", total: 86, grade: "A", color: "bg-green-100 text-green-700" },
    { code: "DCA1130", name: "Programming in C – Practical", total: 81, grade: "A", color: "bg-green-100 text-green-700" }
  ],
  "Sem 2": [
    { code: "DCA1201", name: "Operating System", total: 77, grade: "B+", color: "bg-blue-100 text-blue-700" },
    { code: "DCA1202", name: "Data Structures and Algorithms", total: 79, grade: "B+", color: "bg-blue-100 text-blue-700" },
    { code: "DCA1203", name: "Object Oriented Programming – C++", total: 77, grade: "B+", color: "bg-blue-100 text-blue-700" },
    { code: "DCA1204", name: "Communication Skills & Personality Dev", total: 83, grade: "A", color: "bg-green-100 text-green-700" },
    { code: "DCA1205", name: "Digital Logic", total: 80, grade: "A", color: "bg-green-100 text-green-700" },
    { code: "DCA1230", name: "DSA using C++ - Practical", total: 92, grade: "A+", color: "bg-emerald-100 text-emerald-700" }
  ],
  "Sem 3": [
    { code: "DCA2101", name: "Computer Oriented Numerical Methods", total: 82, grade: "A", color: "bg-green-100 text-green-700" },
    { code: "DCA2102", name: "DBMS", total: 85, grade: "A", color: "bg-green-100 text-green-700" },
    { code: "DCA2103", name: "Computer Organization", total: 90, grade: "A+", color: "bg-emerald-100 text-emerald-700" },
    { code: "DCA2104", name: "Basics of Data Communication", total: 79, grade: "B+", color: "bg-blue-100 text-blue-700" },
    { code: "DCA2130", name: "DBMS – Practical", total: 96, grade: "A+", color: "bg-emerald-100 text-emerald-700" }
  ],
  "Sem 4": [
    { code: "DCA2201", name: "Computer Networking", total: 75, grade: "B+", color: "bg-blue-100 text-blue-700" },
    { code: "DCA2202", name: "Java Programming", total: 77, grade: "B+", color: "bg-blue-100 text-blue-700" },
    { code: "DCA2203", name: "System Software", total: 84, grade: "A", color: "bg-green-100 text-green-700" },
    { code: "DCA2204", name: "Principles of Financial Accounting and Management", total: 69, grade: "C+", color: "bg-yellow-100 text-yellow-700" },
    { code: "DCA2230", name: "Java Programming – Practical", total: 84, grade: "A", color: "bg-green-100 text-green-700" },
    { code: "DCA2231", name: "System Software Programming – Practical", total: 100, grade: "A+", color: "bg-emerald-100 text-emerald-700" }
  ]
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white px-4 py-3 rounded-2xl shadow-xl border border-gray-800">
        <p className="font-bold text-sm mb-1 text-gray-300">{label}</p>
        <p className="text-2xl font-black">{payload[0].value} SGPA</p>
      </div>
    );
  }
  return null;
};

const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.2 }
  }
};

const textLetterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 12, stiffness: 200 }
  }
};

const Education = () => {
  return (
    <section id="education" className="relative bg-white/30 backdrop-blur-2xl border-t border-white/50 z-30 -mt-[100vh] rounded-t-[40px] shadow-[0_-20px_60px_rgba(0,0,0,0.1)]">
      
      <div className="max-w-6xl mx-auto px-6 py-24 pb-32">
        <div className="relative flex flex-col gap-8 md:gap-16">
          
          {/* Card 1: BCA Academics (Chart) */}
          <div 
            className="sticky top-[6rem] w-full bg-white/30 backdrop-blur-2xl rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-white/50 overflow-hidden z-10"
          >
            <div className="p-8 md:p-12 flex flex-col justify-center min-h-[70vh]">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center mb-10 md:mb-16"
              >
                <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                  <div className="px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-white/50 text-sm font-bold tracking-widest text-gray-800 uppercase shadow-sm">
                    Manipal University Jaipur
                  </div>
                  <div className="px-4 py-1.5 rounded-full bg-black text-white text-sm font-bold tracking-widest uppercase shadow-sm">
                    Class of 2027
                  </div>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-[#111111] tracking-tighter uppercase mb-6">
                  Academics
                </h2>
                <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                  Overall CGPA: <span className="font-bold text-black">8.82</span> (Distinction) <br />
                  My graduation performance across completed semesters.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="bg-white/40 backdrop-blur-md rounded-3xl p-6 md:p-12 border border-gray-100"
              >
                <div className="w-full h-[300px] md:h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data}
                      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="semester" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 14, fontWeight: 500 }}
                        dy={10}
                      />
                      <YAxis 
                        domain={[0, 10]} 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 14, fontWeight: 500 }}
                        dx={-10}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E5E7EB', strokeWidth: 2, strokeDasharray: '5 5' }} />
                      <Line 
                        type="monotone" 
                        dataKey="cgpa" 
                        stroke="#111111" 
                        strokeWidth={4}
                        activeDot={{ r: 8, fill: '#111111', stroke: '#fff', strokeWidth: 3 }}
                        dot={{ r: 5, fill: '#111111', stroke: '#111111' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </div>



          {/* Transcript Semester Cards 2, 3, 4, 5 */}
          {Object.keys(transcriptData).map((sem, idx) => {
            const colors = [
              'bg-[#E9E3FF] border-white/50', 
              'bg-[#E0F7FA]/60 border-white/50', 
              'bg-[#FFF3E0]/60 border-white/50', 
              'bg-[#E8F5E9]/60 border-white/50'
            ];
            const cardColor = colors[idx % colors.length];
            // Calculate sticky top offset so they stack. Card 1 is at 6rem.
            const topOffset = `calc(6rem + ${(idx + 1) * 2}rem)`;

            return (
              <div 
                key={sem} 
                className={`sticky w-full rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border backdrop-blur-3xl overflow-hidden z-20 ${cardColor}`}
                style={{ top: topOffset }}
              >
                <div className="p-6 md:p-8 max-h-[calc(100vh-8rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
                    <h4 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">{sem}</h4>
                    <div className="bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/50 shadow-sm inline-flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">SGPA</span>
                      <span className="text-lg font-black text-gray-900">{data.find(d => d.semester === sem)?.cgpa}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 md:gap-3">
                    {transcriptData[sem].map((subject, sIdx) => (
                      <div key={sIdx} className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl p-3 md:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-white/70 transition-colors">
                        <div className="flex flex-col">
                          <span className="text-[10px] md:text-xs font-mono text-gray-500 mb-0.5">{subject.code}</span>
                          <span className="text-base md:text-lg font-bold text-gray-900">{subject.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 md:gap-6 justify-between md:justify-end">
                          <div className="text-left md:text-right">
                            <span className="block text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Marks</span>
                            <span className="font-black text-gray-900 text-lg">{subject.total}</span>
                          </div>
                          <div className="w-px h-8 bg-gray-300 hidden md:block"></div>
                          <div className="w-16 flex justify-end">
                            <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-black shadow-sm ${subject.color}`}>
                              {subject.grade}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
};

export default Education;
