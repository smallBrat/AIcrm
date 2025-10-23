import React, { useState, useEffect, useRef } from 'react';
import { Phone, Mail, User, Calendar, Clock, TrendingUp, Users, Settings, Bell, Search, Plus, Play, Pause, Trash2, Edit3, Star, MessageSquare, BarChart3, PieChart as PieChartIcon, DollarSign, Target, Zap, Brain, Headphones, PhoneCall, CheckCircle, XCircle, AlertTriangle, Check, Info, MessageCircle, ArrowLeft, ArrowRight, Send, Sparkles, Smartphone, MessageSquareIcon, Hash, LogOut, Shield, Key, UserPlus, BadgeCheck, AlertCircle, X, UserCheck, Lock, KeyRound, ShieldCheck, FileText, Users2, Eye, EyeOff, Sun, Moon, ArrowUp, ArrowDown, Database, Cpu, ChevronDown, RefreshCcw, Link } from 'lucide-react';

// --- AUTHENTICATION & ROLE CONFIGURATION ---
const ROLE_ACCESS = {
  Administrator: ['dashboard', 'contacts', 'analytics', 'settings', 'conversations'], // FIXED: Removed 'campaigns'
  Manager: ['dashboard', 'contacts', 'campaigns', 'scripts', 'analytics', 'settings', 'conversations'], 
  Agent: ['dashboard', 'contacts', 'calls', 'conversations', 'settings', 'scripts'], 
};
const ALL_ROLES = ['Administrator', 'Manager', 'Agent'];
const ALL_AGENTS = ['Mike Chen', 'Lisa Park', 'Anna Kim', 'AI Agent Luna'];
const ALL_MANAGERS = ['Sarah Manager', 'John Manager'];

// Mock Data
const MOCK_DATA = {
    contactList: [
        { id: 'c1', name: 'Acme Corp', type: 'Company', status: 'customer', tags: ['Enterprise', 'Hot'], lastActivity: '2 days ago', phone: '555-0101', email: 'contact@acmecorp.com', timezone: "America/Los_Angeles (PST)" },
        { id: 'c2', name: 'Sarah Johnson', type: 'Lead', status: 'lead', tags: ['Demo Req'], lastActivity: '4 hours ago', phone: '555-0102', email: 'sarah.j@techcorp.com', timezone: "America/New_York (EST)" },
        { id: 'c3', name: 'Global Logistics', type: 'Partner', status: 'prospect', tags: ['Cold'], lastActivity: '1 month ago', phone: '555-0103', email: 'logistics@global.net', timezone: "Europe/London (GMT)" },
        { id: 'c4', name: 'Mike Smith', type: 'Customer', status: 'customer', tags: ['SME', 'Billing'], lastActivity: '1 day ago', phone: '555-0104', email: 'mike.s@smeco.org', timezone: "America/Chicago (CST)" },
        { id: 'c5', name: 'Luna AI Test', type: 'Test Lead', status: 'lead', tags: ['Internal', 'AI'], lastActivity: '2 minutes ago', phone: '555-0105', email: 'luna@ai.com', timezone: "Asia/Kolkata (IST)" },
    ],
    campaigns: [
        { id: 'cp1', name: 'Q4 Lead Nurturing', status: 'Running', type: 'Email + Call', progress: 75, startDate: '2025-10-01', endDate: '2025-12-31' },
        { id: 'cp2', name: 'Product Launch Blitz', status: 'Completed', type: 'Call', progress: 100, startDate: '2025-09-01', endDate: '2025-09-15' },
        { id: 'cp3', name: 'Reactivation Push', status: 'Paused', type: 'SMS', progress: 40, startDate: '2025-10-15', endDate: '2025-11-15' },
    ],
    scripts: [
        { id: 's1', name: 'Product Demo Opener', role: 'Agent', content: 'Hi [Name], thanks for your interest. To start, I wanted to quickly confirm your main challenge is [Challenge]... (AI Suggests next steps)', tags: ['Sales', 'Demo'], lastUpdated: '2025-10-20', rating: 4.5 },
        { id: 's2', name: 'Billing Inquiry Resolution', role: 'Agent', content: 'I understand you have a question about your latest invoice for [Amount]. Let me check the payment status for [Invoice ID]... (AI Guides troubleshooting)', tags: ['Support', 'Billing'], lastUpdated: '2025-09-15', rating: 4.8 },
        { id: 's3', name: 'Cold Call Outreach V3', role: 'Manager', content: 'The goal of this call is discovery. Use the framework: Current State -> Pain Points -> Future Goal. Do not pitch features.', tags: ['Outreach', 'Cold'], lastUpdated: '2025-10-18', rating: 3.9 },
    ],
    conversations: [
        { id: 'conv1', contact: 'Acme Corp', agent: 'Mike Chen', type: 'Call', duration: '12:35', date: '2025-10-20', summary: 'Discussed Enterprise features and pricing. Needs follow-up with legal.', sentiment: 'Positive' },
        { id: 'conv2', contact: 'Sarah Johnson', agent: 'AI Agent Luna', type: 'Chat', duration: '08:15', date: '2025-10-21', summary: 'Requested demo meeting next week. AI extracted time preference (Wednesday afternoon).', sentiment: 'Neutral' },
        { id: 'conv3', contact: 'Global Logistics', agent: 'Lisa Park', type: 'Email', duration: null, date: '2025-10-10', summary: 'Sent initial partnership proposal. Awaiting response.', sentiment: 'Neutral' },
    ],
    users: [
        { id: 'u1', name: 'Mike Chen', role: 'Agent', status: 'Active', lastLogin: '2025-10-21 09:30 AM' },
        { id: 'u2', name: 'Lisa Park', role: 'Agent', status: 'Active', lastLogin: '2025-10-21 10:00 AM' },
        { id: 'u3', name: 'Sarah Manager', role: 'Manager', status: 'Active', lastLogin: '2025-10-21 09:00 AM' },
        { id: 'u4', name: 'Chris Admin', role: 'Administrator', status: 'Active', lastLogin: '2025-10-21 08:00 AM' },
        { id: 'u5', name: 'John Manager', role: 'Manager', status: 'Inactive', lastLogin: '2025-10-20 04:00 PM' },
    ],
};

// --- CHART COMPONENTS (SVG BASED) ---

const LineChart = ({ data, dataKey, labelKey, title, color, darkMode }) => {
    const WIDTH = 600;
    const HEIGHT = 200;
    const padding = 30;

    // Calculate max value for scaling
    const maxVal = Math.max(...data.map(d => d[dataKey]));
    const scaleY = (value) => HEIGHT - padding - (value / maxVal) * (HEIGHT - 2 * padding);
    const scaleX = (index) => padding + (index / (data.length - 1)) * (WIDTH - 2 * padding);

    // Generate SVG path for the line
    const linePath = data.map((d, i) => {
        const x = scaleX(i);
        const y = scaleY(d[dataKey]);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    const primaryColor = color || 'rgb(99, 102, 241)'; // Indigo-500

    return (
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto">
            {/* Y-Axis Line */}
            <line x1={padding} y1={padding} x2={padding} y2={HEIGHT - padding} stroke={darkMode ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)'} />
            {/* X-Axis Line */}
            <line x1={padding} y1={HEIGHT - padding} x2={WIDTH - padding} y2={HEIGHT - padding} stroke={darkMode ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)'} />

            {/* Y-Axis Labels (Max, Mid, Min) */}
            <text x={padding - 5} y={padding + 5} fontSize="12" textAnchor="end" fill={darkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)'}>{maxVal}{title.includes('%') ? '%' : ''}</text>
            <text x={padding - 5} y={scaleY(maxVal / 2) + 5} fontSize="12" textAnchor="end" fill={darkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)'}>{Math.round(maxVal / 2)}{title.includes('%') ? '%' : ''}</text>
            <text x={padding - 5} y={HEIGHT - padding} fontSize="12" textAnchor="end" fill={darkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)'}>0</text>
            
            {/* Line Path */}
            <path d={linePath} fill="none" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" />

            {/* Data Points and X-Axis Labels */}
            {data.map((d, i) => {
                const x = scaleX(i);
                const y = scaleY(d[dataKey]);
                return (
                    <React.Fragment key={i}>
                        {/* Data Point */}
                        <circle cx={x} cy={y} r="5" fill="white" stroke={primaryColor} strokeWidth="3" />
                        
                        {/* X-Axis Label */}
                        <text x={x} y={HEIGHT - padding / 2} fontSize="12" textAnchor="middle" fill={darkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)'}>{d[labelKey]}</text>
                    </React.Fragment>
                );
            })}
        </svg>
    );
};

const FunnelChart = ({ data, darkMode }) => {
    const MAX_WIDTH = 500;
    const SEGMENT_HEIGHT = 40;
    const GAP = 3;
    const maxCount = data[0].count; // Always the first stage (Total Leads)

    // Calculate total height of the SVG viewbox
    const TOTAL_HEIGHT = data.length * (SEGMENT_HEIGHT + GAP);

    let currentY = 0;
    let prevSegmentWidth = MAX_WIDTH;
    const chartElements = [];

    const colorMap = {
        'Total Leads': 'rgb(99, 102, 241)', // Indigo
        'Contacted': 'rgb(168, 85, 247)',    // Purple
        'Qualified': 'rgb(34, 197, 94)',      // Green
        'Proposal Sent': 'rgb(249, 115, 22)', // Orange
        'Converted': 'rgb(239, 68, 68)'      // Red
    };
    
    data.forEach((d, i) => {
        const scale = d.count / maxCount;
        const currentSegmentWidth = MAX_WIDTH * scale;
        
        // Calculate the corners of the trapezoid for the current segment
        const x1 = MAX_WIDTH / 2 - prevSegmentWidth / 2; // Top-Left X
        const x2 = MAX_WIDTH / 2 + prevSegmentWidth / 2; // Top-Right X
        const x3 = MAX_WIDTH / 2 + currentSegmentWidth / 2; // Bottom-Right X
        const x4 = MAX_WIDTH / 2 - currentSegmentWidth / 2; // Bottom-Left X

        const y1 = currentY; // Top Y
        const y2 = currentY + SEGMENT_HEIGHT; // Bottom Y

        const path = `M ${x1} ${y1} L ${x2} ${y1} L ${x3} ${y2} L ${x4} ${y2} Z`;
        const fillColor = colorMap[d.stage];
        const retentionRate = i > 0 ? ((d.count / data[i-1].count) * 100).toFixed(1) : 100;
        const totalConversion = ((d.count / maxCount) * 100).toFixed(1);

        chartElements.push(
            <g key={d.stage} className="transition-transform duration-300 hover:scale-[1.01]">
                {/* Trapezoid Segment */}
                <path 
                    d={path} 
                    fill={fillColor} 
                    opacity="0.95" 
                    className="shadow-lg"
                    style={{ filter: "url(#glow)" }}
                />
                
                {/* Text Label (Stage Name and Count) */}
                <text 
                    x={MAX_WIDTH / 2} 
                    y={y1 + SEGMENT_HEIGHT / 2 + 5} 
                    textAnchor="middle" 
                    fontSize="16" 
                    fontWeight="bold"
                    fill="white"
                    className="pointer-events-none"
                >
                    {d.stage} ({d.count})
                </text>

                {/* Conversion Rates */}
                {i > 0 && (
                    <text 
                        x={MAX_WIDTH + 10} 
                        y={y1 + SEGMENT_HEIGHT / 2 + 5} 
                        textAnchor="start" 
                        fontSize="12" 
                        fill={darkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)'}
                    >
                        Retention: {retentionRate}%
                        <tspan x={MAX_WIDTH + 10} dy="1em" fill={darkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)'}>
                            Total: {totalConversion}%
                        </tspan>
                    </text>
                )}
            </g>
        );

        prevSegmentWidth = currentSegmentWidth;
        currentY += SEGMENT_HEIGHT + GAP;
    });

    return (
        <svg viewBox={`0 0 ${MAX_WIDTH + 150} ${TOTAL_HEIGHT}`} className="w-full h-auto">
             {/* Simple filter for a subtle glow effect (since SVG filters can't use Tailwind classes) */}
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            {chartElements}
        </svg>
    );
};
// --- END FUNNEL CHART COMPONENT ---


const GroupedBarChart = ({ data, labelKey, barKey1, barKey2, color1, color2, darkMode }) => {
    const WIDTH = 600;
    const HEIGHT = 200;
    const padding = 30;
    const barWidth = 15;
    const groupPadding = 20;

    // Calculate max values for each key for separate scaling
    const maxVal1 = Math.max(...data.map(d => d[barKey1])); // Conversions (max ~70)
    const maxVal2 = Math.max(...data.map(d => d[barKey2])); // Revenue (max ~82000)

    // Scaling function for Bar Key 1 (Conversions) - Blue
    const heightScale1 = (value) => (value / maxVal1) * (HEIGHT - 2 * padding);
    
    // Scaling function for Bar Key 2 (Revenue) - Green
    const heightScale2 = (value) => (value / maxVal2) * (HEIGHT - 2 * padding);
    
    const scaleX = (index) => padding + groupPadding + (index / data.length) * (WIDTH - 2 * padding - data.length * 2 * barWidth - groupPadding * (data.length - 1)) + index * 2 * barWidth;
    
    const primaryColor1 = color1 || 'rgb(99, 102, 241)'; // Indigo-500
    const primaryColor2 = color2 || 'rgb(34, 197, 94)';  // Green-500

    return (
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto">
            {/* X-Axis Line */}
            <line x1={padding} y1={HEIGHT - padding} x2={WIDTH - padding} y2={HEIGHT - padding} stroke={darkMode ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)'} />

            {/* Bars and Labels */}
            {data.map((d, i) => {
                const xBase = scaleX(i);
                
                // Bar 1 (Conversions)
                const x1 = xBase;
                const h1 = heightScale1(d[barKey1]);
                const y1 = HEIGHT - padding - h1;

                // Bar 2 (Revenue)
                const x2 = xBase + barWidth + 2; // Offset for grouped appearance
                const h2 = heightScale2(d[barKey2]);
                const y2 = HEIGHT - padding - h2;
                
                return (
                    <React.Fragment key={i}>
                        {/* Bar 1 (Conversions) */}
                        <rect x={x1} y={y1} width={barWidth} height={h1} fill={primaryColor1} rx="3" ry="3" />
                        <text x={x1 + barWidth / 2} y={y1 - 5} fontSize="10" textAnchor="middle" fill={primaryColor1}>{d[barKey1]}</text>

                        {/* Bar 2 (Revenue) */}
                        <rect x={x2} y={y2} width={barWidth} height={h2} fill={primaryColor2} rx="3" ry="3" />
                        <text x={x2 + barWidth / 2} y={y2 - 5} fontSize="10" textAnchor="middle" fill={primaryColor2}>₹{(d[barKey2] / 1000)}K</text>
                        
                        {/* X-Axis Label */}
                        <text x={xBase + barWidth} y={HEIGHT - padding / 2} fontSize="12" textAnchor="middle" fill={darkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)'}>{d[labelKey]}</text>
                    </React.Fragment>
                );
            })}
        </svg>
    );
};

// --- NEW COMPONENT: Pie Chart for AI Usage Breakdown ---
const PieChart = ({ data, darkMode }) => {
    // Increased size to make it slightly larger and more readable
    const SIZE = 250; 
    // Define the space needed outside the circle for the stroke to render fully
    const PADDING = 15; 
    // Adjusted dimensions for the viewBox
    const VIEW_SIZE = SIZE + PADDING * 2; 

    // Center point, adjusted by padding
    const CENTER = VIEW_SIZE / 2;
    // Radius must be calculated from the padded size
    const RADIUS = SIZE / 2;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

    let cumulativePercentage = 0;
    let cumulativeAngle = -90; // Start at the top (-90 degrees)

    // Calculate total for percentages
    const total = data.reduce((sum, item) => sum + item.value, 0); 

    const slices = data.map((item, index) => {
        const percentage = (item.value / total) * 100;
        const offset = CIRCUMFERENCE * (1 - percentage / 100);
        
        // Use the current cumulative angle for rotation
        const rotationAngle = cumulativeAngle; 
        
        // Prepare for the next slice
        cumulativeAngle += (percentage / 100) * 360; 
        
        const color = item.color; // Color assumed from data item
        // Use a fixed stroke width that looks good in the layout
        const STROKE_WIDTH = 50; 

        return (
            <circle
                key={item.label}
                // Center coordinates are now based on VIEW_SIZE / 2
                cx={CENTER} 
                cy={CENTER}
                // Radius is based on the visible area, minus half the stroke width
                r={RADIUS - STROKE_WIDTH / 2} 
                fill="transparent"
                stroke={color}
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
                // FIX: Apply rotation for correct slice starting point
                transform={`rotate(${rotationAngle} ${CENTER} ${CENTER})`} 
                className="transition-all duration-700 ease-in-out"
                // Add hover effect
                style={{ filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.2))" }}
            />
        );
    });

    const legend = (
        <div className="flex flex-col space-y-2 w-full">
            {data.map((item) => (
                <div key={item.label} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm truncate">{item.label}</span>
                    <span className="text-sm font-semibold ml-auto">{((item.value / total) * 100).toFixed(1)}%</span> 
                </div>
            ))}
        </div>
    );

    return (
        <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-8">
            {/* Set SVG size for display and the viewBox to include padding */}
            <svg width={SIZE} height={SIZE} viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`} className="flex-shrink-0">
                {/* Background circle is drawn at the new CENTER points */}
                {/* Removed the background circle as it covers the slices. Instead, we rely on the stroke dashes. */}
                {slices}
                <text x={CENTER} y={CENTER} textAnchor="middle" alignmentBaseline="middle" fontSize="24" fontWeight="bold" fill={darkMode ? 'white' : 'black'}>
                    {total.toLocaleString()}
                </text>
                <text x={CENTER} y={CENTER + 20} textAnchor="middle" alignmentBaseline="middle" fontSize="12" fill={darkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)'}>
                    Total Calls
                </text>
            </svg>
            <div className="mt-4 md:mt-0 md:flex-1 w-full">{legend}</div>
        </div>
    );
};

// --- NEW COMPONENT: Goal Tracker with Circular Progress Bar ---
const GoalTracker = ({ goal, target, current, icon: Icon, color, darkMode }) => {
    const percentage = Math.min(100, (current / target) * 100);
    const size = 100;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    // Fallback for dark/light mode
    const backgroundColor = darkMode ? 'rgb(75, 85, 99)' : 'rgb(229, 231, 235)';
    const primaryColor = color || 'rgb(99, 102, 241)';

    // Format current/target based on goal type (ratio or currency)
    const formatValue = (val) => {
        // FIXED: Currency changed to INR (₹)
        if (goal.includes('Revenue')) return `₹${val.toLocaleString('en-IN')}`;
        if (goal.includes('Ratio')) return `${(val * 100).toFixed(1)}%`;
        return val.toLocaleString();
    }

    // FIXED: Changed layout to full vertical stacking (flex-col) and removed target/current value from SVG.
    return (
        <div className={`p-5 rounded-xl shadow-lg flex flex-col justify-start ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`flex items-center space-x-3 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                <Icon className={`h-5 w-5`} style={{ color: primaryColor }} />
                <span>{goal}</span>
            </div>
            
            {/* Main Content Block: SVG and details vertically stacked */}
            <div className="flex flex-col items-center space-y-3 w-full"> 
                {/* SVG Container: Fixed width/height */}
                <div className="relative" style={{ width: `${size}px`, height: `${size}px` }}>
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            stroke={backgroundColor}
                            fill="transparent"
                            strokeWidth={strokeWidth}
                            r={radius}
                            cx={size / 2}
                            cy={size / 2}
                        />
                        {/* Progress circle */}
                        <circle
                            stroke={primaryColor}
                            fill="transparent"
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            r={radius}
                            cx={size / 2}
                            cy={size / 2}
                            style={{
                                transition: 'stroke-dashoffset 0.8s ease-out',
                                transform: 'rotate(-90deg)',
                                transformOrigin: '50% 50%'
                            }}
                        />
                        {/* Center Content (Only Percentage) */}
                        <g className="transform rotate-90" style={{ transformOrigin: '50% 50%' }}>
                            <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" 
                                fontSize="18" fontWeight="bold" style={{ fill: primaryColor }}>
                                {percentage.toFixed(1)}%
                            </text>
                        </g>
                    </svg>
                    {/* Inner Icon */}
                    <div className="absolute inset-0 flex items-center justify-center -mt-2">
                        <Icon className={`h-6 w-6 opacity-30`} style={{ color: primaryColor }} />
                    </div>
                </div>
                
                {/* Text Details Container: Clear separation for labels */}
                <div className="text-center w-full space-y-1"> 
                    <p className={`text-xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatValue(current)}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Current Progress
                    </p>
                    {/* Removed Target Data from this section to meet user request */}
                </div>
            </div>
        </div>
    );
};

// --- NEW COMPONENT: Latest Campaign Summary ---
const LatestCampaignSummary = ({ campaign, darkMode }) => {
    if (!campaign) {
        return (
            <div className={`rounded-lg p-6 shadow-lg border border-dashed ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-300 text-gray-600'}`}>
                <AlertCircle className="h-6 w-6 text-yellow-500 inline mr-2" />
                <span className="font-semibold">No Campaigns Launched Yet.</span>
                <p className="text-sm mt-2">Launch a new campaign in the Campaign Management tab to see its real-time summary here.</p>
            </div>
        );
    }
    
    const progress = Math.min(100, campaign.progress);
    
    return (
        <div className={`rounded-xl p-6 shadow-lg border-l-4 ${
            campaign.status === 'Active' ? 'border-green-500' : 
            campaign.status === 'Paused' ? 'border-yellow-500' : 'border-blue-500'
        } ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    <span>Latest Campaign: {campaign.name}</span>
                </h3>
                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    campaign.status === 'Active' ? 'bg-green-100 text-green-800' :
                    campaign.status === 'Paused' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                }`}>
                    {campaign.status}
                </span>
            </div>
            
            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Target Progress</span>
                    <span className="font-semibold text-blue-600">{progress}% Complete</span>
                </div>
                <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
                    <div 
                        className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed">
                    <div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Targeted Contacts</p>
                        <p className="font-bold text-xl">{campaign.targeted.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Conversion Rate</p>
                        <p className="font-bold text-xl text-green-500">{campaign.conversionRatio}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
// --- END NEW COMPONENTS ---


// The second, duplicate declaration of GroupedBarChart was removed from here.

// --- CORE APPLICATION COMPONENT ---
const App = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [userRole, setUserRole] = useState('Administrator'); // Default for development

  // App Navigation and Data State (Unchanged functionality)
  const [activeTab, setActiveTab] = useState('dashboard');
  const [calls, setCalls] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [scripts, setScripts] = useState([
    {
      id: 1,
      title: "Welcome Call",
      tone: "friendly",
      language: "en-US",
      voice: "en-US-Joanna",
      content: "Hello {name}, this is calling from AI CRM. How are you today? I wanted to discuss our special offer available until {appointment_date}.",
      variables: ["name", "appointment_date"],
      createdAt: "2024-01-10"
    },
    {
      id: 2,
      title: "Follow-up Call",
      tone: "neutral",
      language: "en-US",
      voice: "en-US-Joanna",
      content: "Hi {name}, I'm calling to follow up on our previous conversation. Do you have a moment?",
      variables: ["name"],
      createdAt: "2024-01-12"
    }
  ]);
  const [conversations, setConversations] = useState([
    {
      id: 1,
      contactId: 1,
      name: "Sarah Johnson",
      company: "Acme Corporation",
      avatar: "https://placehold.co/40x40/667085/FFFFFF?text=SJ",
      lastMessage: "Thanks for the information! When can we schedule a demo?",
      unreadCount: 2,
      channel: "email",
      status: "hot",
      timestamp: "6h ago",
      messages: [
        {
          id: 1,
          sender: "You",
          text: "Hi Sarah, following up on our call. Here are the pricing details you requested.",
          timestamp: "6h ago",
          read: true
        },
        {
          id: 2,
          sender: "Sarah Johnson",
          text: "Thanks for the information! When can we schedule a demo?",
          timestamp: "6h ago",
          read: false
        }
      ],
      aiAutoReply: false
    },
    {
      id: 2,
      contactId: 2,
      name: "Michael Chen",
      company: "Innovate Labs",
      avatar: "https://placehold.co/40x40/667085/FFFFFF?text=MC",
      lastMessage: "Can you clarify the integration process?",
      unreadCount: 1,
      channel: "sms",
      status: "normal",
      timestamp: "1d ago",
      messages: [
        {
          id: 1,
          sender: "You",
          text: "Hi Michael, I'd be happy to explain the integration process. Our system supports API connections and webhook integrations.",
          timestamp: "1d ago",
          read: true
        },
        {
          id: 2,
          sender: "Michael Chen",
          text: "Can you clarify the integration process?",
          timestamp: "1d ago",
          read: false
        }
      ],
      aiAutoReply: false
    },
    {
      id: 3,
      contactId: 3,
      name: "Emily Rodriguez",
      company: "Growth Co",
      avatar: "https://placehold.co/40x40/667085/FFFFFF?text=ER",
      lastMessage: "Subject: Re: Product Inquiry",
      unreadCount: 0,
      channel: "email",
      status: "normal",
      timestamp: "2d ago",
      messages: [
        {
          id: 1,
          sender: "You",
          text: "Hi Emily, thank you for your inquiry about our product. I'd be happy to provide more details.",
          timestamp: "2d ago",
          read: true
        },
        {
          id: 2,
          sender: "Emily Rodriguez",
          text: "I'm interested in learning more about your enterprise features. Could you send me some documentation?",
          timestamp: "2d ago",
          read: true
        }
      ],
      aiAutoReply: false
    },
    {
      id: 4,
      contactId: 4,
      name: "David Park",
      company: "Future Tech",
      avatar: "https://placehold.co/40x40/667085/FFFFFF?text=DP",
      lastMessage: "What's the timeline for implementation?",
      unreadCount: 1,
      channel: "whatsapp",
      status: "normal",
      timestamp: "3d ago",
      messages: [
        {
          id: 1,
          sender: "You",
          text: "Hi David, thanks for reaching out. The typical implementation timeline is 2-3 weeks depending on your specific requirements.",
          timestamp: "3d ago",
          read: true
        },
        {
          id: 2,
          sender: "David Park",
          text: "What's the timeline for implementation?",
          timestamp: "3d ago",
          read: false
        }
      ],
      aiAutoReply: false
    }
  ]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedScriptId, setSelectedScriptId] = useState(''); // State for selected script
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callTranscript, setCallTranscript] = useState('');
  const [showNewContactModal, setShowNewContactModal] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '', company: '', status: 'lead', sentiment: 'neutral', assignedAgent: 'AI Agent Luna' });
  const [showNewScriptModal, setShowNewScriptModal] = useState(false);
  const [newScript, setNewScript] = useState({
    title: '',
    tone: 'friendly',
    language: 'en-US',
    voice: 'en-US-Joanna',
    content: '',
    variables: []
  });
  const [activeChannel, setActiveChannel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  // User Profile State
  const [showProfileDropdown, setShowProfileDropdown] = useState(false); // New state for dropdown
  const profileDropdownRef = useRef(null); // Ref for dropdown closure
  const [userProfile, setUserProfile] = useState({
    name: "Admin",
    email: "admin@aicrm.com",
    role: "Administrator",
    avatar: "https://placehold.co/40x40/667085/FFFFFF?text=AD",
    lastLogin: "Today, 9:30 AM",
    notifications: true,
    twoFactor: true,
    theme: "light"
  });
  // User Profile Tab State (Used within Settings Tab now)
  const [userProfileTab, setUserProfileTab] = useState('profile');
  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      message: 'New lead added: Sarah Johnson',
      timestamp: '5m ago',
      read: false
    },
    {
      id: 2,
      type: 'info',
      message: 'AI Agent conversion rate up 8% this week!',
      timestamp: '10m ago',
      read: false
    },
    {
      id: 3,
      type: 'warning',
      message: 'Peak calling hours detected: 2-4 PM',
      timestamp: '15m ago',
      read: true
    },
    {
      id: 4,
      type: 'success',
      message: 'Call completed with Michael Chen',
      timestamp: '20m ago',
      read: true
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(2);
  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);
  // User Management State (NEW)
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', role: 'Administrator', email: 'admin@ai.com', status: 'Active', team: 'System' },
    { id: 2, name: 'Sarah Manager', role: 'Manager', email: 'sarah@ai.com', status: 'Active', team: 'Blue Team' },
    { id: 3, name: 'John Manager', role: 'Manager', email: 'john@ai.com', status: 'Active', team: 'Red Team' },
    { id: 4, name: 'Mike Chen', role: 'Agent', email: 'mike@ai.com', status: 'Active', team: 'Red Team' },
    { id: 5, name: 'Lisa Park', role: 'Agent', email: 'lisa@ai.com', status: 'Active', team: 'Blue Team' },
    { id: 6, name: 'Anna Kim', role: 'Agent', email: 'anna@ai.com', status: 'Inactive', team: 'Blue Team' },
    { id: 7, name: 'AI Agent Luna', role: 'Agent', email: 'luna@ai.com', status: 'Active', team: 'AI Dept' },
  ]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Campaign State (NEW)
  const CAMPAIGN_TYPES = ['Lead Nurturing', 'Product Renewal', 'Customer Feedback', 'Upsell/Cross-sell'];
  const [campaignStep, setCampaignStep] = useState(1);
  const [newCampaign, setNewCampaign] = useState({
      name: '',
      type: CAMPAIGN_TYPES[0],
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      targetStatus: [], // Array of statuses to target
      selectedScriptId: '',
      assignedAgent: ALL_AGENTS[0],
      targetedCount: 0,
      status: 'Draft'
  });
  const [campaigns, setCampaigns] = useState([
    { id: 1, name: 'Q4 Renewal Push', type: 'Product Renewal', status: 'Active', progress: 85, successRate: 72, conversionRatio: 24, agent: 'AI Agent Luna', targeted: 5000, converted: 1200 },
    { id: 2, name: 'New Lead Nurturing 2.0', type: 'Lead Nurturing', status: 'Paused', progress: 40, successRate: 55, conversionRatio: 18, agent: 'Lisa Park', targeted: 8000, converted: 1440 },
    { id: 3, name: 'Cross-sell Q3 Top Tier', type: 'Upsell/Cross-sell', status: 'Completed', progress: 100, successRate: 85, conversionRatio: 35, agent: 'Mike Chen', targeted: 1500, converted: 525 },
  ]);
  
  // NEW: Goal and KPI Tracker Data
  const GOALS_DATA = [
      { goal: "Q4 Revenue Target", target: 500000, current: 350000, icon: DollarSign, color: 'rgb(34, 197, 94)' }, // Green
      { goal: "Lead Conversion Ratio", target: 0.35, current: 0.28, icon: TrendingUp, color: 'rgb(99, 102, 241)' }, // Indigo
      { goal: "Automation Ratio", target: 0.85, current: 0.72, icon: Zap, color: 'rgb(168, 85, 247)' }, // Purple
  ];
  
  // NEW: AI Usage Data for Pie Chart (Admin Dashboard)
  const AI_USAGE_DATA = [
      { label: "Language Model (GPT/Gemini)", value: 45200, color: 'rgb(99, 102, 241)' }, // Indigo
      { label: "Voice Synthesis (TTS)", value: 18500, color: 'rgb(34, 197, 94)' }, // Green
      { label: "Call Transcription", value: 12000, color: 'rgb(249, 115, 22)' }, // Orange
      { label: "Data Grounding/Search", value: 7500, color: 'rgb(239, 68, 68)' }, // Red
  ];


  // --- AUTH FUNCTIONS ---
  const handleLogin = (role) => {
    setUserRole(role);
    setIsAuthenticated(true);
    setIsLoginPage(false);
    setUserProfile(prev => ({...prev, name: role, role: role, avatar: `https://placehold.co/40x40/667085/FFFFFF?text=${role.substring(0,2).toUpperCase()}`}));
    setActiveTab(ROLE_ACCESS[role][0]); // Set initial tab based on role
  };

  const handleSignup = (role) => {
    // In a real app, this would create a user. For frontend mock, auto-login.
    handleLogin(role);
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setUserRole('');
    setIsLoginPage(true);
  };

  // --- UTILITY EFFECTS ---
  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle outside click for dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownRef]);

  // Mock data initialization
  useEffect(() => {
    const mockContacts = [
      { 
        id: 1, 
        name: 'Sarah Johnson', 
        email: 'sarah@techcorp.com', 
        phone: '+1 (555) 123-4567', 
        company: 'TechCorp', 
        status: 'customer', 
        lastContact: '2024-01-15', 
        nextFollowUp: '2024-01-22', 
        score: 85,
        lastInteraction: '2025-10-12',
        sentiment: 'positive',
        assignedAgent: 'Mike Chen'
      },
      { 
        id: 2, 
        name: 'Michael Chen', 
        email: 'michael@innovate.io', 
        phone: '+1 (555) 987-6543', 
        company: 'Innovate Labs', 
        status: 'lead', 
        lastContact: '2024-01-10', 
        nextFollowUp: '2024-01-18', 
        score: 62,
        lastInteraction: '2025-10-11',
        sentiment: 'neutral',
        assignedAgent: 'Lisa Park'
      },
      { 
        id: 3, 
        name: 'Emma Rodriguez', 
        email: 'emma@growthco.com', 
        phone: '+1 (555) 456-7890', 
        company: 'Growth Co', 
        status: 'prospect', 
        lastContact: '2024-01-12', 
        nextFollowUp: '2024-01-20', 
        score: 78,
        lastInteraction: '2025-10-10',
        sentiment: 'positive',
        assignedAgent: 'Mike Chen'
      },
      { 
        id: 4, 
        name: 'David Kim', 
        email: 'david@futuretech.net', 
        phone: '+1 (555) 321-0987', 
        company: 'Future Tech', 
        status: 'customer', 
        lastContact: '2024-01-14', 
        nextFollowUp: '2024-01-25', 
        score: 92,
        lastInteraction: '2025-10-09',
        sentiment: 'negative',
        assignedAgent: 'Anna Kim'
      },
      { 
        id: 5, 
        name: 'Linda Wang', 
        email: 'linda@startup.com', 
        phone: '+1 (555) 789-0123', 
        company: 'Startup Inc', 
        status: 'lead', 
        lastContact: '2024-01-13', 
        nextFollowUp: '2024-01-21', 
        score: 70,
        lastInteraction: '2025-10-12',
        sentiment: 'positive',
        assignedAgent: 'Lisa Park'
      },
      { 
        id: 6, 
        name: 'Tomás García', 
        email: 'tomas@global.com', 
        phone: '+1 (555) 234-5678', 
        company: 'Global Solutions', 
        status: 'prospect', 
        lastContact: '2024-01-11', 
        nextFollowUp: '2024-01-19', 
        score: 65,
        lastInteraction: '2025-10-11',
        sentiment: 'neutral',
        assignedAgent: 'Mike Chen'
      },
    ];
    setContacts(mockContacts);
    const mockCalls = [
      { id: 1, contactId: 1, contactName: 'Sarah Johnson', duration: '12:34', status: 'completed', timestamp: '2024-01-15T14:30:00', outcome: 'Interested in premium plan' },
      { id: 2, contactId: 2, contactName: 'Michael Chen', duration: '08:21', status: 'completed', timestamp: '2024-01-10T11:15:00', outcome: 'Requested demo' },
      { id: 3, contactId: 3, contactName: 'Emma Rodriguez', duration: '15:47', status: 'in-progress', timestamp: '2024-01-16T09:00:00', outcome: '' },
    ];
    setCalls(mockCalls);
  }, []);
  
  // Calculate targeted count whenever targetStatus changes
  useEffect(() => {
    const count = contacts.filter(c => newCampaign.targetStatus.includes(c.status)).length;
    setNewCampaign(prev => ({ ...prev, targetedCount: count }));
  }, [newCampaign.targetStatus, contacts]);

  // --- DATA & UTILITY FUNCTIONS ---
  // Simulate call timer
  useEffect(() => {
    let interval;
    if (isCalling) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCalling]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = (contact, scriptId) => { // Updated to accept scriptId
    setSelectedContact(contact);
    setIsCalling(true);
    setCallDuration(0);
    setCallTranscript('');
    
    const selectedScript = scripts.find(s => s.id === parseInt(scriptId));
    let initialMessage = "Hello, this is your AI assistant calling. How are you today?";

    if (selectedScript) {
        // Simple variable substitution for mock transcript
        initialMessage = selectedScript.content.replace(/{name}/g, contact.name).replace(/{appointment_date}/g, 'next Tuesday');
    }

    // Simulate AI call transcript
    setTimeout(() => {
      setCallTranscript(`AI: ${initialMessage}
${contact.name}: Hi there! I was wondering about your premium features...
AI: Great question! Our premium plan includes advanced analytics, priority support, and custom integrations.`);
    }, 2000);
  };

  const endCall = () => {
    setIsCalling(false);
    if (selectedContact) {
      const newCall = {
        id: calls.length + 1,
        contactId: selectedContact.id,
        contactName: selectedContact.name,
        duration: formatTime(callDuration),
        status: 'completed',
        timestamp: new Date().toISOString(),
        outcome: 'AI conversation completed'
      };
      setCalls(prev => [...prev, newCall]);
    }
    setSelectedContact(null);
    setSelectedScriptId(''); // Reset selected script
  };

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      const contact = {
        id: contacts.length + 1,
        ...newContact,
        lastContact: new Date().toISOString().split('T')[0],
        nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        score: Math.floor(Math.random() * 40) + 30
      };
      setContacts(prev => [...prev, contact]);
      setNewContact({ name: '', email: '', phone: '', company: '', status: 'lead', sentiment: 'neutral', assignedAgent: 'AI Agent Luna' });
      setShowNewContactModal(false);
    }
  };
  
  // FIX 1: Delete Contact Function
  const deleteContact = (contactId) => {
      if (window.confirm("Are you sure you want to delete this contact?")) {
          setContacts(prev => prev.filter(c => c.id !== contactId));
          alert("Contact deleted successfully.");
      }
  };
  // END FIX 1

  const addScript = () => {
    if (newScript.title && newScript.content) {
      const script = {
        id: scripts.length + 1,
        ...newScript,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setScripts(prev => [...prev, script]);
      setNewScript({
        title: '',
        tone: 'friendly',
        language: 'en-US',
        voice: 'en-US-Joanna',
        content: '',
        variables: []
      });
      setShowNewScriptModal(false);
    }
  };
  
  const deleteScript = (id) => {
    setScripts(prev => prev.filter(script => script.id !== id));
  };
  
  const toggleAiAutoReply = (conversationId) => {
    setConversations(prev => {
        const updatedConversations = prev.map(conv => 
            conv.id === conversationId 
                ? { ...conv, aiAutoReply: !conv.aiAutoReply } 
                : conv
        );
        // Also update the selectedConversation state immediately if it matches
        if (selectedConversation && selectedConversation.id === conversationId) {
            setSelectedConversation(updatedConversations.find(conv => conv.id === conversationId));
        }
        return updatedConversations;
    });
  };
  
  const sendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;
    const newMessage = {
      id: selectedConversation.messages.length + 1,
      sender: "You",
      text: messageInput,
      timestamp: "Just now",
      read: true
    };
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { 
              ...conv, 
              messages: [...conv.messages, newMessage],
              lastMessage: messageInput,
              unreadCount: 0,
              timestamp: "Just now"
            } 
          : conv
      )
    );
    setSelectedConversation(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));
    setMessageInput('');
    // Generate AI suggestion for next response
    setTimeout(() => {
      const suggestions = [
        "I can send you our detailed pricing breakdown right away. When would be a good time to discuss?",
        "Would you like me to schedule a demo with our sales team?",
        "Let me know if you need any additional information about our features.",
        "Our implementation typically takes 2-3 weeks. Would you like to discuss your specific requirements?"
      ];
      setAiSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
    }, 1000);
  };
  
  const useAiSuggestion = () => {
    setMessageInput(aiSuggestion);
    setAiSuggestion('');
  };
  
  const markAsRead = (conversationId) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unreadCount: 0 } 
          : conv
      )
    );
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'customer': return 'bg-green-100 text-green-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'lead': return 'bg-yellow-100 text-yellow-800';
      // FIX 2: Mismatched status used in table
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-yellow-100 text-yellow-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // FIX 2: New function to get Sentiment badge styles
  const getSentimentColor = (sentiment) => {
      switch (sentiment) {
          case 'positive': return 'bg-green-100 text-green-800';
          case 'neutral': return 'bg-yellow-100 text-yellow-800';
          case 'negative': return 'bg-red-100 text-red-800';
          default: return 'bg-gray-100 text-gray-800';
      }
  };

  const getCallStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };
  
  const getToneColor = (tone) => {
    switch (tone) {
      case 'friendly': return 'bg-green-100 text-green-800';
      case 'neutral': return 'bg-gray-100 text-gray-800';
      case 'professional': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Filter conversations based on active channel and search query
  const filteredConversations = conversations.filter(conv => {
    // Channel filter
    if (activeChannel !== 'all' && conv.channel !== activeChannel) {
      return false;
    }
    // Search filter
    if (searchQuery && !conv.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !conv.company.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Mock live transcription data
  const liveTranscription = [
    { id: 1, speaker: 'AI Agent', message: 'Hello Sarah, this is your AI assistant from TechCorp. How are you today?', timestamp: '10:15:23 AM' },
    { id: 2, speaker: 'Customer', message: 'Hi! I\'m doing well, thanks for asking.', timestamp: '10:15:28 AM' },
    { id: 3, speaker: 'AI Agent', message: 'Great! I wanted to discuss our special premium plan that includes advanced analytics and priority support.', timestamp: '10:15:35 AM' },
    { id: 4, speaker: 'Customer', message: 'That sounds interesting. What\'s the pricing?', timestamp: '10:15:42 AM' },
    { id: 5, speaker: 'AI Agent', message: 'Our premium plan is $99/month with a 14-day free trial. Would you like me to send you more details?', timestamp: '10:15:50 AM' }
  ];
  // Mock performance alerts
  const performanceAlerts = [
    { id: 1, type: 'success', message: 'Conversion rate increased by 12% this week!', timestamp: '10:12 AM', icon: Check },
    { id: 2, type: 'info', message: 'Peak calling hours detected: 2-4 PM', timestamp: '10:08 AM', icon: Info },
    { id: 3, type: 'warning', message: 'Customer sentiment dip detected in last 3 calls', timestamp: '10:05 AM', icon: AlertTriangle }
  ];
  const getAlertIcon = (type) => {
    switch (type) {
      case 'success': return Check;
      case 'info': return Info;
      case 'warning': return AlertTriangle;
      default: return Info;
    }
  };
  
  // --- ROLE-SPECIFIC DASHBOARD METRICS ---
  
  const totalCampaigns = campaigns.length;
  const avgSuccessRate = (campaigns.reduce((sum, c) => sum + c.successRate, 0) / totalCampaigns).toFixed(1);
  const avgConversionRatio = (campaigns.reduce((sum, c) => sum + c.conversionRatio, 0) / totalCampaigns).toFixed(1);

  // Manager Metrics: Focused on Campaign Performance (BASED ON USER PROMPT)
  const managerMetrics = [
    { title: 'Total Campaigns', value: totalCampaigns, icon: Target, change: `Active: ${campaigns.filter(c => c.status === 'Active').length}` },
    { title: 'Avg. Success Rate', value: `${avgSuccessRate}%`, icon: CheckCircle, change: '↑ 5.2%' },
    { title: 'Avg. Conversion Ratio', value: `${avgConversionRatio}%`, icon: TrendingUp, change: '↑ 2.5%' },
    { title: 'Total Converted Contacts', value: campaigns.reduce((sum, c) => sum + c.converted, 0).toLocaleString(), icon: UserCheck, change: 'MoM' }
  ];

  // Admin Metrics: Focused on System/Resource Health (BASED ON USER PROMPT)
  const adminMetrics = [
    { title: 'Total Users', value: users.length, icon: Users, change: '7 Total' },
    { title: 'Total Campaigns', value: totalCampaigns, icon: Target, change: '12 Active' },
    { title: 'AI Agent Calls (MoM)', value: '15,890', icon: PhoneCall, change: '↑ 18%' },
    { title: 'Active AI Models', value: 4, icon: Brain, change: 'Stable' },
    { title: 'Total API Calls (24h)', value: '45.2K', icon: Zap, change: '↑ 4.2%' },
    { title: 'AI Usage Health', value: '95% Max', icon: Cpu, change: 'Check Settings' },
  ];
  // ----------------------------------------

  // Notification functions
  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id 
          ? { ...notif, read: true } 
          : notif
      )
    );
    setNotificationCount(prev => prev - 1);
  };
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setNotificationCount(0);
  };
  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    setNotificationCount(prev => prev > 0 ? prev - 1 : 0);
  };
  const clearAllNotifications = () => {
    setNotifications([]);
    setNotificationCount(0);
  };
  // User Profile functions
  const updateUserProfile = (updates) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    updateUserProfile({ theme: !darkMode ? 'dark' : 'light' });
  };
  // Contact Update Functions
  const updateContactStatus = (contactId, newStatus) => {
    setContacts(prev => 
      prev.map(contact => 
        contact.id === contactId 
          ? { ...contact, status: newStatus } 
          : contact
      )
    );
  };
  const updateContactSentiment = (contactId, newSentiment) => {
    setContacts(prev => 
      prev.map(contact => 
        contact.id === contactId 
          ? { ...contact, sentiment: newSentiment } 
          : contact
      )
    );
  };
  const updateContactAssignedAgent = (contactId, newAgent) => {
    setContacts(prev => 
      prev.map(contact => 
        contact.id === contactId 
          ? { ...contact, assignedAgent: newAgent } 
          : contact
      )
    );
  };
  
  // --- USER MANAGEMENT CRUD FUNCTIONS (NEW) ---
  const handleSaveUser = (user) => {
      if (user.id) {
          // Update existing user
          setUsers(prev => prev.map(u => u.id === user.id ? user : u));
          alert(`User ${user.name} updated.`);
      } else {
          // Add new user
          const newUser = { 
              ...user, 
              id: users.length + 1, 
              status: 'Active', 
              team: user.team || (user.role === 'Administrator' ? 'System' : 'Unassigned') 
          };
          setUsers(prev => [...prev, newUser]);
          alert(`User ${user.name} created.`);
      }
      setShowUserModal(false);
      setEditingUser(null);
  };

  const handleDeleteUser = (userId) => {
      if (window.confirm('Are you sure you want to delete this user?')) {
          setUsers(prev => prev.filter(u => u.id !== userId));
          alert('User deleted.');
      }
  };

  const handleEditClick = (user) => {
      setEditingUser(user);
      setShowUserModal(true);
  };

  const handleAddClick = (role) => {
      setEditingUser({ name: '', email: '', role: role, team: '' });
      setShowUserModal(true);
  };
  // --- END USER MANAGEMENT CRUD ---

  // --- CAMPAIGN CREATION FUNCTIONS (NEW) ---
  const handleCampaignChange = (e) => {
      const { name, value } = e.target;
      setNewCampaign(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleTargetStatus = (status) => {
      setNewCampaign(prev => {
          const newStatuses = prev.targetStatus.includes(status)
              ? prev.targetStatus.filter(s => s !== status)
              : [...prev.targetStatus, status];
          return { ...prev, targetStatus: newStatuses };
      });
  };
  
  const validateCampaignStep1 = () => {
      return newCampaign.name && newCampaign.startDate && newCampaign.endDate;
  };
  
  const validateCampaignStep2 = () => {
      return newCampaign.targetStatus.length > 0;
  };
  
  const validateCampaignStep3 = () => {
      return newCampaign.selectedScriptId && newCampaign.assignedAgent;
  };
  
  const launchCampaign = () => {
      if (validateCampaignStep3()) {
          // Simulate adding the new campaign to the list
          const campaign = {
              id: campaigns.length + 1,
              name: newCampaign.name,
              type: newCampaign.type,
              status: 'Active',
              progress: 0,
              successRate: 0,
              conversionRatio: 0,
              agent: newCampaign.assignedAgent,
              targeted: newCampaign.targetedCount,
              converted: 0,
          };
          setCampaigns(prev => [...prev, campaign]);

          alert(`Campaign '${newCampaign.name}' launched successfully! Targeting ${newCampaign.targetedCount} contacts.`);
          setCampaignStep(1); // Reset flow
          setNewCampaign({ // Reset form
              name: '',
              type: CAMPAIGN_TYPES[0],
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              targetStatus: [],
              selectedScriptId: '',
              assignedAgent: ALL_AGENTS[0],
              targetedCount: 0,
              status: 'Draft'
          });
          setActiveTab('campaigns'); // Show Campaign Report after launch

          // Helper to create a campaign from a simplified modal (used by CampaignManagementFlow)
          const createCampaign = (campaignData) => {
            const campaign = {
              id: campaigns.length + 1,
              name: campaignData.name || `Campaign ${campaigns.length + 1}`,
              type: campaignData.type || CAMPAIGN_TYPES[0],
              status: 'Active',
              progress: 0,
              successRate: 0,
              conversionRatio: 0,
              agent: campaignData.assignedAgent || ALL_AGENTS[0],
              targeted: campaignData.targetedCount || 0,
              converted: 0,
            };
            setCampaigns(prev => [...prev, campaign]);
            alert(`Campaign '${campaign.name}' created.`);
          };

      } else {
          alert('Please complete all required fields.');
      }
  };
  // --- END CAMPAIGN CREATION FUNCTIONS ---

  // Helper: Trigger n8n workflow via webhook URL (set VITE_N8N_TRIGGER_URL in .env)
  const triggerN8nWorkflow = async (campaign) => {
    const url = import.meta.env.VITE_N8N_TRIGGER_URL;
    if (!url) {
      // No webhook configured; silently return
      console.warn('VITE_N8N_TRIGGER_URL not set; skipping n8n trigger');
      return null;
    }

    const payload = {
      id: campaign.id,
      name: campaign.name,
      type: campaign.type,
      assignedAgent: campaign.assignedAgent,
      targetedCount: campaign.targeted || campaign.targetedCount || 0,
      status: campaign.status || 'Draft',
      createdAt: new Date().toISOString()
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (!resp.ok) throw new Error(`n8n trigger failed: ${resp.status} ${resp.statusText}`);
      return await resp.json().catch(() => ({ status: resp.status }));
    } finally {
      clearTimeout(timeout);
    }
  };

  // --- DYNAMIC ANALYTICS DATA ---
  
  // Dynamic Agent Performance Data (Monthly structure)
  const [performanceMonth, setPerformanceMonth] = useState('Oct 2025');
  
  // Color Map for Agents
  const agentColorMap = {
      'AI Agent Luna': 'rgb(168, 85, 247)', // Purple
      'Mike Chen': 'rgb(34, 197, 94)',      // Green
      'Lisa Park': 'rgb(59, 130, 246)',      // Blue
      'Anna Kim': 'rgb(249, 115, 22)',       // Orange
  };
  
  const agentPerformanceData = {
    'Oct 2025': [
      { name: 'AI Agent Luna', calls: 456, conversion: 78, completion: 96, team: 'AI Dept' },
      { name: 'Mike Chen', calls: 342, conversion: 72, completion: 94, team: 'Red Team' },
      { name: 'Lisa Park', calls: 318, conversion: 68, completion: 91, team: 'Blue Team' },
      { name: 'Anna Kim', calls: 295, conversion: 65, completion: 88, team: 'Blue Team' },
    ],
    'Sep 2025': [
      { name: 'AI Agent Luna', calls: 400, conversion: 75, completion: 95, team: 'AI Dept' },
      { name: 'Mike Chen', calls: 320, conversion: 70, completion: 92, team: 'Red Team' },
      { name: 'Lisa Park', calls: 300, conversion: 65, completion: 90, team: 'Blue Team' },
      { name: 'Anna Kim', calls: 280, conversion: 63, completion: 87, team: 'Blue Team' },
    ],
  };

  // Static Data (for charts that don't need monthly context change for mock)
  const callSuccessRateData = [
    { day: 'Mon', rate: 28 },
    { day: 'Tue', rate: 30 },
    { day: 'Wed', rate: 29 },
    { day: 'Thu', rate: 45 },
    { day: 'Fri', rate: 50 },
    { day: 'Sat', rate: 25 },
    { day: 'Sun', rate: 32 }
  ];
  const conversionFunnelData = [
    { stage: 'Total Leads', count: 1500 },
    { stage: 'Contacted', count: 1200 },
    { stage: 'Qualified', count: 850 },
    { stage: 'Proposal Sent', count: 420 },
    { stage: 'Converted', count: 245 }
  ];
  const revenueImpactData = [
    { day: 'Mon', conversions: 60, revenue: 80000 },
    { day: 'Tue', conversions: 65, revenue: 78000 },
    { day: 'Wed', conversions: 45, revenue: 45000 },
    { day: 'Thu', conversions: 50, revenue: 48000 },
    { day: 'Fri', conversions: 62, revenue: 82000 },
    { day: 'Sat', conversions: 70, revenue: 55000 },
    { day: 'Sun', conversions: 68, revenue: 60000 }
  ];
  const availableMonths = Object.keys(agentPerformanceData);
  // --- END DYNAMIC ANALYTICS DATA ---

  // --- SUB-COMPONENTS: Campaign Creation Steps / Report ---

  const CampaignStep1Setup = ({ campaign, handleChange, campaignTypes }) => (
      <div className="space-y-6">
          <h4 className="text-xl font-semibold mb-4">1. Campaign Details</h4>
          <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Campaign Name</label>
              <input type="text" name="name" value={campaign.name} onChange={handleChange} required
                  className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-600 border-gray-600 text-white' : 'border border-gray-300'}`}
                  placeholder="e.g., Q4 Customer Renewal Push"
              />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Campaign Type</label>
                  <select name="type" value={campaign.type} onChange={handleChange}
                      className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-600 border-gray-600 text-white' : 'border border-gray-300'}`}
                  >
                      {campaignTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
              </div>
              <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Start Date</label>
                  <input type="date" name="startDate" value={campaign.startDate} onChange={handleChange} required
                      className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-600 border-gray-600 text-white' : 'border border-gray-300'}`}
                  />
              </div>
          </div>
          <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>End Date</label>
              <input type="date" name="endDate" value={campaign.endDate} onChange={handleChange} required
                  className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-600 border-gray-600 text-white' : 'border border-gray-300'}`}
                  />
          </div>
      </div>
  );

  const CampaignStep2Audience = ({ campaign, handleToggleStatus, darkMode }) => {
      const allStatuses = ['lead', 'prospect', 'customer'];
      const getStatusLabel = (status) => status.charAt(0).toUpperCase() + status.slice(1);
      
      return (
          <div className="space-y-6">
              <h4 className="text-xl font-semibold mb-4">2. Audience Segmentation</h4>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                  <h5 className="font-medium mb-2">Target Contact Statuses</h5>
                  <div className="flex flex-wrap gap-3">
                      {allStatuses.map(status => (
                          <button
                              key={status}
                              type="button"
                              onClick={() => handleToggleStatus(status)}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                  campaign.targetStatus.includes(status)
                                      ? 'bg-blue-600 text-white shadow-md'
                                      : darkMode
                                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-500'
                                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-200'
                              }`}
                          >
                              {getStatusLabel(status)}
                              {campaign.targetStatus.includes(status) && <Check className="inline h-4 w-4 ml-2" />}
                          </button>
                      ))}
                  </div>
              </div>
              <div className={`p-4 rounded-lg border-l-4 ${
                  campaign.targetedCount > 0 ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
              } ${darkMode ? 'bg-gray-700 border-gray-500' : ''}`}>
                  <p className="font-semibold text-lg flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>Total Targeted Contacts:</span>
                      <span className="text-green-600 dark:text-green-400">{campaign.targetedCount.toLocaleString()}</span>
                  </p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {campaign.targetedCount > 0 
                          ? `Contacts matching selected statuses: ${campaign.targetStatus.map(s => getStatusLabel(s)).join(', ')}.` 
                          : 'Please select at least one contact status to define your audience.'}
                  </p>
              </div>
          </div>
      );
  };

  const CampaignStep3ScriptAgent = ({ campaign, handleChange, scripts, darkMode }) => {
      const selectedScript = scripts.find(s => s.id === parseInt(campaign.selectedScriptId));
      return (
          <div className="space-y-6">
              <h4 className="text-xl font-semibold mb-4">3. Script & Agent Allocation</h4>
              <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Select Campaign Script</label>
                  <select name="selectedScriptId" value={campaign.selectedScriptId} onChange={handleChange} required
                      className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-600 border-gray-600 text-white' : 'border border-gray-300'}`}
                  >
                      <option value="">Choose a script...</option>
                      {scripts.map(script => (
                          <option key={script.id} value={script.id}>{script.title} ({script.tone})</option>
                      ))}
                  </select>
                  {selectedScript && (
                      <div className={`mt-3 p-3 rounded-lg border-l-4 border-blue-400 ${
                          darkMode ? 'bg-gray-700' : 'bg-blue-50'
                      }`}>
                          <p className="text-sm italic">{selectedScript.content.substring(0, 100)}...</p>
                      </div>
                  )}
              </div>
              <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Assign Agent (Human or AI)</label>
                  <select name="assignedAgent" value={campaign.assignedAgent} onChange={handleChange} required
                      className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-600 border-gray-600 text-white' : 'border border-gray-300'}`}
                  >
                      <option value="AI Agent Luna">AI Agent Luna (Automated)</option>
                      {ALL_AGENTS.filter(a => a !== 'AI Agent Luna').map(agent => (
                          <option key={agent} value={agent}>{agent} (Human)</option>
                      ))}
                  </select>
              </div>
          </div>
      );
  };

  const CampaignStep4Review = ({ campaign, scripts, darkMode }) => {
      const selectedScript = scripts.find(s => s.id === parseInt(campaign.selectedScriptId)) || {};
      
      const reviewItemClass = `p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`;
      const valueClass = `font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`;

      return (
          <div className="space-y-6">
              <h4 className="text-xl font-semibold mb-4">4. Review and Launch</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={reviewItemClass}>
                      <p className="text-sm text-gray-500">Campaign Name</p>
                      <p className={valueClass}>{campaign.name}</p>
                  </div>
                  <div className={reviewItemClass}>
                      <p className="text-sm text-gray-500">Campaign Type</p>
                      <p className={valueClass}>{campaign.type}</p>
                  </div>
                  <div className={reviewItemClass}>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className={valueClass}>{campaign.startDate} to {campaign.endDate}</p>
                  </div>
                  <div className={reviewItemClass}>
                      <p className="text-sm text-gray-500">Assigned Agent</p>
                      <p className={valueClass}>{campaign.assignedAgent}</p>
                  </div>
              </div>

              <div className={reviewItemClass}>
                  <p className="text-sm text-gray-500 mb-1">Target Audience Statuses</p>
                  <div className="flex flex-wrap gap-2">
                      {campaign.targetStatus.map(status => (
                          <span key={status} className="px-3 py-1 text-xs bg-blue-500 text-white rounded-full font-medium">
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                      ))}
                  </div>
                  <p className="font-bold text-xl mt-2">Targeted Contacts: <span className="text-green-600">{campaign.targetedCount}</span></p>
              </div>
              
              <div className={reviewItemClass}>
                  <p className="text-sm text-gray-500 mb-1">Selected Script: <span className={valueClass}>{selectedScript.title}</span></p>
                  <p className={`text-sm italic ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>"{selectedScript.content}"</p>
              </div>

          </div>
      );
  };
  
  // New Campaign Report Component
  const CampaignReport = ({ campaigns, darkMode }) => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-500" />
                <span>Active Campaign Summary</span>
            </h3>
            
            <div className={`p-4 rounded-lg border-l-4 border-green-500 ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                <p className="text-lg font-semibold text-green-700 dark:text-green-400">
                    {campaigns.filter(c => c.status === 'Active').length} Active Campaigns Currently Running.
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Monitor real-time progress and success ratios below.
                </p>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className={darkMode ? 'bg-gray-600' : 'bg-gray-100'}>
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Campaign</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Progress</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Success Rate</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Conversion Ratio</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Agent</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
                        {campaigns.map((camp) => (
                            <tr key={camp.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                                <td className="px-4 py-4">
                                    <div className="font-medium">{camp.name}</div>
                                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{camp.type}</div>
                                </td>
                                <td className="px-4 py-4">
                                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                        camp.status === 'Active' ? 'bg-green-100 text-green-800' :
                                        camp.status === 'Paused' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-blue-100 text-blue-800'
                                    }`}>
                                        {camp.status}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
                                        <div 
                                            className="h-2 rounded-full bg-blue-500"
                                            style={{ width: `${camp.progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs mt-1 block">{camp.progress}%</span>
                                </td>
                                <td className={`px-4 py-4 font-semibold ${camp.successRate > 70 ? 'text-green-500' : 'text-yellow-500'}`}>{camp.successRate}%</td>
                                <td className="px-4 py-4 font-semibold text-indigo-500">{camp.conversionRatio}%</td>
                                <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{camp.agent}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
  }

  // Campaign Management Wrapper Component (simplified)
  const CampaignManagementFlow = ({ userRole, campaigns, darkMode }) => {
    const isManagerOrAdmin = userRole !== 'Agent';
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', type: CAMPAIGN_TYPES[0], assignedAgent: ALL_AGENTS[0], targetedCount: 0 });

    if (!isManagerOrAdmin) {
      // Agent role defaults to live call view
      return <AgentLiveCallAssistant {...{ selectedContact, setSelectedContact, selectedScriptId, setSelectedScriptId, contacts, scripts, startCall, isCalling, callDuration, callTranscript, endCall, darkMode }} />;
    }

    const openNewCampaignModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const submit = (e) => {
      e.preventDefault();
        // Create locally first
        const created = createCampaign(form);

        // Trigger remote n8n workflow if the environment variable is set
        (async () => {
          try {
            const res = await triggerN8nWorkflow(created);
            // optional: you can inspect res here for success
            console.log('n8n trigger response', res);
          } catch (err) {
            console.error('Failed to trigger n8n workflow', err);
            // show user-friendly message (non-blocking)
            alert('Campaign created locally but failed to trigger n8n workflow. Check console for details.');
          }
        })();

        setForm({ name: '', type: CAMPAIGN_TYPES[0], assignedAgent: ALL_AGENTS[0], targetedCount: 0 });
        closeModal();
    };

    return (
      <div className="space-y-6">
        <div className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-lg font-semibold">Campaigns</h3>
          <div className="flex items-center space-x-2">
            <button onClick={openNewCampaignModal} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700">
              <Plus className="h-4 w-4" />
              <span>New Campaign</span>
            </button>
          </div>
        </div>

        {/* Keep the Campaign Report intact */}
        <CampaignReport campaigns={campaigns} darkMode={darkMode} />

        {/* New Campaign Modal (minimal fields) */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form onSubmit={submit} className={`w-full max-w-md p-6 rounded-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              <h4 className="text-lg font-semibold mb-4">Create New Campaign</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Campaign Name</label>
                  <input required value={form.name} onChange={(e) => setForm(prev => ({...prev, name: e.target.value}))} className="w-full px-3 py-2 rounded-lg border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm(prev => ({...prev, type: e.target.value}))} className="w-full px-3 py-2 rounded-lg border">
                    {CAMPAIGN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Assign Agent</label>
                  <select value={form.assignedAgent} onChange={(e) => setForm(prev => ({...prev, assignedAgent: e.target.value}))} className="w-full px-3 py-2 rounded-lg border">
                    {ALL_AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Targeted Contacts (approx)</label>
                  <input type="number" value={form.targetedCount} onChange={(e) => setForm(prev => ({...prev, targetedCount: parseInt(e.target.value || '0')}))} className="w-full px-3 py-2 rounded-lg border" />
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white">Create</button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  };

  // Agent Live Call Assistant Component (Separated for clarity)
  const AgentLiveCallAssistant = ({ selectedContact, setSelectedContact, selectedScriptId, setSelectedScriptId, contacts, scripts, startCall, isCalling, callDuration, callTranscript, endCall, darkMode }) => (
      <div className="space-y-6">
        <div className={`rounded-lg shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-4">Start Instant AI Call</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Contact Selection */}
                <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Target Contact</label>
                    <select
                        value={selectedContact?.id || ''}
                        onChange={(e) => {
                            const contactId = e.target.value;
                            if (contactId) {
                                const contact = contacts.find(c => c.id === parseInt(contactId));
                                if (contact) setSelectedContact(contact);
                            } else {
                                setSelectedContact(null);
                            }
                        }}
                        className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'}`}
                    >
                        <option value="">Choose a contact...</option>
                        {contacts.map(contact => (
                            <option key={contact.id} value={contact.id}>
                                {contact.name} - {contact.company}
                            </option>
                        ))}
                    </select>
                    {selectedContact && (
                        <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <User className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-medium">{selectedContact.name}</p>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{selectedContact.phone}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Script Selection */}
                <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Select AI Script</label>
                    <select
                        value={selectedScriptId}
                        onChange={(e) => setSelectedScriptId(e.target.value)}
                        className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'}`}
                    >
                        <option value="">Choose a script...</option>
                        {scripts.map(script => (
                            <option key={script.id} value={script.id}>
                                {script.title} ({script.tone})
                            </option>
                        ))}
                    </select>
                    {selectedScriptId && (
                        <div className={`mt-4 p-3 rounded-lg border-l-4 border-blue-400 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                            <p className="font-medium text-sm mb-1">Script Preview:</p>
                            <p className={`text-xs italic ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {scripts.find(s => s.id === parseInt(selectedScriptId))?.content.substring(0, 70)}...
                            </p>
                        </div>
                    )}
                </div>

                {/* Call Actions */}
                <div className="flex flex-col justify-center">
                    <button
                        onClick={() => selectedContact && selectedScriptId && startCall(selectedContact, selectedScriptId)}
                        disabled={!selectedContact || !selectedScriptId}
                        className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 justify-center transition-colors ${
                            selectedContact && selectedScriptId
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        <Phone className="h-5 w-5" />
                        <span>Start Live Call</span>
                    </button>
                    {isCalling && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-blue-800">Call in Progress</span>
                            </div>
                            <div className="text-sm font-bold text-blue-600">
                                {formatTime(callDuration)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
  );
  
  // --- SUB-COMPONENTS: User Management Modals/Tabs ---

  // Component for adding/editing a user (NEW)
  const UserModal = ({ user, onClose, onSave, allUsers, darkMode }) => {
    const [formData, setFormData] = useState(user);
    const isEditing = !!user.id;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const rolesAllowed = userRole === 'Administrator' ? ALL_ROLES : ['Agent'];

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
            <form onSubmit={handleSubmit} className={`rounded-xl shadow-2xl w-full max-w-md p-6 ${
                darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}>
                <h3 className="text-xl font-bold mb-4">{isEditing ? `Edit User: ${user.name}` : `Add New ${user.role} User`}</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'}`}
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'}`}
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'}`}
                            disabled={userRole !== 'Administrator' && isEditing} // Only Admin can change role of existing user
                        >
                            {rolesAllowed.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Team</label>
                        <input
                            type="text"
                            name="team"
                            value={formData.team}
                            onChange={handleChange}
                            className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'}`}
                            placeholder="e.g., Blue Team, AI Dept"
                        />
                    </div>
                </div>

                <div className="flex space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                            darkMode 
                                ? 'border border-gray-600 text-gray-200 hover:bg-gray-700' 
                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700"
                    >
                        {isEditing ? 'Save Changes' : 'Add User'}
                    </button>
                </div>
            </form>
        </div>
    );
  };

  // Settings User Management Tab (NEW)
  const SettingsUserManagementTab = ({ darkMode, userRole, users, handleEditClick, handleDeleteUser }) => {
    // Determine which users the current role can manage
    const targetRoles = userRole === 'Administrator' ? ALL_ROLES.filter(r => r !== 'Administrator') : ['Agent'];
    const filteredUsers = users.filter(u => targetRoles.includes(u.role));
    const isAdministrator = userRole === 'Administrator';

    const getRoleColor = (role) => {
        if (role === 'Administrator') return 'bg-red-100 text-red-800';
        if (role === 'Manager') return 'bg-purple-100 text-purple-800';
        if (role === 'Agent') return 'bg-blue-100 text-blue-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">
                    {isAdministrator ? 'Global User Management' : 'Team Agent Management'}
                </h3>
                <button
                    onClick={() => handleAddClick(isAdministrator ? 'Manager' : 'Agent')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
                >
                    <UserPlus className="h-4 w-4" />
                    <span>Add {isAdministrator ? 'User' : 'Agent'}</span>
                </button>
            </div>
            
            <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {isAdministrator 
                    ? 'Manage all user accounts, roles, and teams across the organization.'
                    : 'Manage agents reporting to you (Blue Team/Red Team).'
                }
            </p>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className={darkMode ? 'bg-gray-600' : 'bg-gray-100'}>
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Team</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className={darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'}>
                                <td className="px-4 py-3">
                                    <div className="font-medium">{user.name}</div>
                                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getRoleColor(user.role)}`}>
                                        {user.role}
                                    </span>
                                </td>
                                {/* FIX: Corrected the JSX className syntax from " to ` for interpolation */}
                                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{user.team}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => handleEditClick(user)} className="text-blue-600 hover:text-blue-800 p-1">
                                            <Edit3 className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-800 p-1">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
  };
  
  // Settings Profile Tab (No changes)
  const SettingsProfileTab = ({ userProfile, updateUserProfile, updateProfile, darkMode }) => {
    return (
      <div className="space-y-6">
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => updateUserProfile({ name: e.target.value })}
                  className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-600 border-gray-600 text-white' : 'border border-gray-300'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                <input
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => updateUserProfile({ email: e.target.value })}
                  className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-600 border-gray-600 text-white' : 'border border-gray-300'}`}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Role</label>
              <input
                type="text"
                value={userRole}
                disabled
                className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-600 border-gray-600 text-gray-400' : 'bg-gray-100 border border-gray-300 text-gray-500'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Last Login</label>
              <input
                type="text"
                value={userProfile.lastLogin}
                disabled
                className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-600 border-gray-600 text-gray-400' : 'bg-gray-100 border border-gray-300 text-gray-500'}`}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => alert('Profile updated successfully!')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
          <div className="flex items-center space-x-4">
            <img src={userProfile.avatar} alt="Profile" className="w-20 h-20 rounded-full" />
            <div>
              <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Upload a new profile picture</p>
              <button className={`px-4 py-2 rounded-lg border transition-colors ${darkMode ? 'bg-gray-600 text-blue-400 border-gray-500 hover:bg-gray-500' : 'bg-white text-blue-600 border-gray-300 hover:bg-blue-50'}`}>
                Upload New Photo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Settings General Tab (No changes)
  const SettingsGeneralTab = ({ userProfile, updateUserProfile, toggleDarkMode, darkMode }) => {
    return (
      <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <h3 className="text-lg font-semibold mb-4">General Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Enable Notifications</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Receive email and push notifications</p>
            </div>
            <button
              onClick={() => updateUserProfile({ notifications: !userProfile.notifications })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${userProfile.notifications ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${userProfile.notifications ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Theme</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Choose between light and dark mode</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => { toggleDarkMode(); if(darkMode) toggleDarkMode(); }}
                className={`p-2 rounded-lg transition-colors ${!darkMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <Sun className="h-4 w-4" />
              </button>
              <button
                onClick={() => { toggleDarkMode(); if(!darkMode) toggleDarkMode(); }}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <Moon className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t">
            <button
              type="button"
              onClick={() => alert('General settings updated successfully!')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Settings Security Tab (No changes)
  const SettingsSecurityTab = ({ userProfile, updateUserProfile, darkMode }) => {
    return (
      <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Two-Factor Authentication</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Add extra security to your account</p>
            </div>
            <button
              onClick={() => updateUserProfile({ twoFactor: !userProfile.twoFactor })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${userProfile.twoFactor ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${userProfile.twoFactor ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
          <div className={`border-t pt-4 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Login History</h4>
            <div className="space-y-2">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Today, 9:30 AM</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>IP: 192.168.1.1 • Location: New York, USA</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Current Session</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Yesterday, 3:45 PM</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>IP: 192.168.1.2 • Location: London, UK</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-500 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>Previous</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => alert('Security settings updated successfully!')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Security Settings
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Settings Password Tab (No changes)
  const SettingsPasswordTab = ({ darkMode }) => {
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const updatePassword = () => {
        if (passwords.new !== passwords.confirm) {
            alert('Passwords do not match!');
            return;
        }
        if (passwords.new.length < 8) {
            alert('New password must be at least 8 characters!');
            return;
        }
        alert('Password updated successfully!');
        setPasswords({ current: '', new: '', confirm: '' });
    };
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>
          <form className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Current Password</label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                placeholder="Enter current password"
                className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-600 border-gray-600 text-white' : 'border border-gray-300'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>New Password</label>
              <input
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                placeholder="Enter new password"
                className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-600 border-gray-600 text-white' : 'border border-gray-300'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                placeholder="Confirm new password"
                className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-600 border-gray-600 text-white' : 'border border-gray-300'}`}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={updatePassword}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h3 className="text-lg font-semibold mb-4">Password Requirements</h3>
          <ul className={`space-y-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <li>• At least 8 characters</li>
            <li>• Contains at least one uppercase letter</li>
            <li>• Contains at least one lowercase letter</li>
            <li>• Contains at least one number</li>
            <li>• Contains at least one special character (!@#$%^&*)</li>
          </ul>
        </div>
      </div>
    );
  };

  // Settings API Usage Tab (UPDATED WITH BILLING/SUBSCRIPTION)
  const SettingsApiUsageTab = ({ darkMode }) => {
    const apiUsageData = [
        { name: 'AI Language Model (Gemini)', provider: 'Google', endpoint: '/gemini/generate', calls: 35240, rateLimit: 500, status: '95% Used' },
        { name: 'AI Voice Synthesis (TTS)', provider: 'Google', endpoint: '/tts/synthesize', calls: 12100, rateLimit: 150, status: 'Stable' },
        { name: 'CRM Data Connector (DB)', provider: 'Firestore', endpoint: '/data/contacts', calls: 5890, rateLimit: 1000, status: 'Stable' },
        { name: 'AI Search/Grounding', provider: 'Google', endpoint: '/search/query', calls: 450, rateLimit: 50, status: 'High Usage' },
    ];
    
    const subscriptionDetails = {
        plan: "Enterprise Platinum",
        // FIXED 4: Currency changed to INR (₹)
        price: "₹4,99,999",
        billingCycle: "Monthly",
        nextPayment: "November 1, 2025",
        usageCap: "200K calls/month",
        currentSpent: "₹4,12,050.50"
    };

    return (
        <div className="space-y-6">
            {/* Subscription and Billing */}
            <div className={`rounded-lg p-6 border-l-4 border-blue-500 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                    <DollarSign className="h-6 w-6 text-green-500" />
                    <span>Subscription & Billing Overview</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Current Plan</p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{subscriptionDetails.plan}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Monthly Cost</p>
                        <p className="text-lg font-bold">{subscriptionDetails.price}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Next Payment</p>
                        <p className="text-lg font-bold">{subscriptionDetails.nextPayment}</p>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-dashed border-gray-300 dark:border-gray-600">
                    <p className="text-sm font-medium flex items-center justify-between">
                        <span>Current Usage Spend:</span>
                        <span className="font-bold text-lg text-red-500">{subscriptionDetails.currentSpent}</span>
                    </p>
                    <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                        Manage Payment Methods
                    </button>
                </div>
            </div>

            {/* API Usage Monitoring */}
            <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                    <Cpu className="h-6 w-6 text-purple-400" />
                    <span>API Usage & Rate Monitoring</span>
                </h3>
                <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    System-level monitoring of external AI and internal API resource utilization against rate limits.
                </p>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className={darkMode ? 'bg-gray-600' : 'bg-gray-200'}>
                            <tr>
                                <th className="px-4 py-2 text-xs font-medium uppercase tracking-wider">API Service</th>
                                <th className="px-4 py-2 text-xs font-medium uppercase tracking-wider">Endpoint</th>
                                <th className="px-4 py-2 text-xs font-medium uppercase tracking-wider">Calls (24h)</th>
                                <th className="px-4 py-2 text-xs font-medium uppercase tracking-wider">Rate Limit</th>
                                <th className="px-4 py-2 text-xs font-medium uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
                            {apiUsageData.map((api, index) => (
                                <tr key={index} className={darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}>
                                    <td className="px-4 py-3 font-medium">
                                        {api.name}
                                        <span className={`block text-xs font-normal ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{api.provider}</span>
                                    </td>
                                    <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{api.endpoint}</td>
                                    <td className="px-4 py-3 text-sm font-semibold">{api.calls.toLocaleString()}</td>
                                    <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{api.rateLimit}/s</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                            api.status === 'Stable' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {api.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-6 p-4 rounded-lg bg-red-100 text-red-800 text-sm dark:bg-red-900 dark:text-red-300">
                    <AlertCircle className="inline h-4 w-4 mr-1" /> **Action Required:** The AI Language Model is approaching its rate limit. Consider scaling resources.
                </div>
            </div>
        </div>
    );
  };
  
  // --- AUTH PAGE COMPONENT ---
  const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('Administrator'); // Default for professional look

    const submitAuth = (isLogin) => {
        if (!email || !password) {
            alert('Please enter email and password.');
            return;
        }
        if (isLogin) {
            handleLogin(selectedRole);
        } else {
            handleSignup(selectedRole);
        }
    };

    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className={`w-full max-w-md rounded-xl shadow-2xl p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold">AI CRM Platform</h1>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {isLoginPage ? 'Sign in to access your dashboard' : 'Create a new account'}
            </p>
          </div>
          <form className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full rounded-lg px-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full rounded-lg px-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Select Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className={`w-full rounded-lg px-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'}`}
              >
                <option value="Administrator">Administrator</option>
                <option value="Manager">Manager</option>
                <option value="Agent">Agent</option>
              </select>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {selectedRole === 'Administrator' && 'System oversight and configuration.'}
                {selectedRole === 'Manager' && 'Performance tracking and campaign oversight.'}
                {selectedRole === 'Agent' && 'Day-to-day contact and conversation handling.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => submitAuth(isLoginPage)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors"
            >
              {isLoginPage ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
          <div className={`mt-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <button
              onClick={() => setIsLoginPage(!isLoginPage)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {isLoginPage ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // --- MAIN APP RENDER ---
  if (!isAuthenticated) {
    return <AuthPage />;
  }
  
  // --- MAIN CRM LAYOUT RENDER ---
  // Dynamic Sidebar Configuration based on Role
  const sidebarTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'contacts', label: 'Contacts', icon: Users },
    // Role-specific label for the call/campaign launcher tab
    { id: (userRole === 'Agent' ? 'calls' : 'campaigns'), label: (userRole === 'Agent' ? 'Live Calls' : 'Campaign Management'), icon: Phone },
    { id: 'conversations', label: 'Conversations', icon: MessageCircle },
    { id: 'scripts', label: 'Scripts', icon: MessageSquare, hidden: userRole === 'Agent' }, // Agents don't manage scripts in this view
    { id: 'analytics', label: 'Analytics', icon: PieChartIcon, hidden: userRole === 'Agent' }, // Agents use Dashboard, Managers/Admins use Analytics
    { id: 'settings', label: 'Settings', icon: Settings }
  ].filter(item => {
      // Check if the role explicitly includes the item ID
      const hasAccess = ROLE_ACCESS[userRole]?.includes(item.id);
      
      // Special handling for the combined calls/campaigns tab
      const combinedTabId = userRole === 'Agent' ? 'calls' : 'campaigns';
      if (item.id === combinedTabId) {
          return ROLE_ACCESS[userRole]?.includes(combinedTabId);
      }

      return hasAccess;
  });


  const isManagerOrAdmin = userRole === 'Administrator' || userRole === 'Manager';
  const currentMetrics = userRole === 'Administrator' ? adminMetrics : managerMetrics;
  
  // Latest campaign for summary card
  const latestCampaign = campaigns.length > 0 ? campaigns[campaigns.length - 1] : null;

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`shadow-sm border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AI CRM Platform</h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Logged in as: <span className="font-semibold text-blue-500">{userRole}</span></p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100'}`}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              {/* Notifications Button (FIXED DARK MODE) */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-2 relative ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>
                {/* Notifications Panel (FIXED DARK MODE) */}
                {showNotifications && (
                  <div className={`absolute right-0 mt-2 w-96 rounded-lg shadow-xl border z-50 transition-colors duration-200 ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Notifications</h3>
                        <div className="flex space-x-2">
                          <button 
                            onClick={markAllNotificationsAsRead}
                            className="text-xs text-blue-600 hover:text-blue-400"
                          >
                            Mark all as read
                          </button>
                          <button 
                            onClick={clearAllNotifications}
                            className="text-xs text-red-600 hover:text-red-400"
                          >
                            Clear all
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            className={`p-4 border-b cursor-pointer transition-colors duration-200 ${
                              !notif.read 
                                ? 'bg-blue-900/10 border-l-4 border-blue-500 hover:bg-blue-900/20 dark:bg-blue-900/20 dark:border-blue-400' 
                                : darkMode 
                                  ? 'hover:bg-gray-700 border-gray-700' 
                                  : 'hover:bg-gray-100 border-gray-200'
                            }`}
                            onClick={() => markNotificationAsRead(notif.id)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                notif.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                                notif.type === 'info' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                              }`}>
                                {notif.type === 'success' && <Check className="h-4 w-4" />}
                                {notif.type === 'info' && <Info className="h-4 w-4" />}
                                {notif.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm">{notif.message}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{notif.timestamp}</span>
                                  {!notif.read && (
                                    <span className="bg-blue-500 text-white text-xs px-1 py-0.5 rounded">New</span>
                                  )}
                                </div>
                              </div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearNotification(notif.id);
                                }}
                                className={darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-700'}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          No notifications
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* User Profile Dropdown (omitted for brevity, content remains same) */}
              <div className="relative" ref={profileDropdownRef}>
                <button 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} hidden sm:inline`}>{userProfile.name}</span>
                </button>
                {showProfileDropdown && (
                  <div className={`absolute right-0 mt-2 w-64 rounded-lg shadow-xl border z-50 ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <p className="font-semibold">{userProfile.name}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{userProfile.email}</p>
                      <span className="text-xs mt-1 inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">{userRole}</span>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setActiveTab('settings');
                          setShowProfileDropdown(false);
                          setUserProfileTab('profile');
                        }}
                        className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                          darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Profile Settings</span>
                      </button>
                      <button
                        onClick={logout}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className={`rounded-lg shadow-sm p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="space-y-2">
                {sidebarTabs.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                        setActiveTab(item.id);
                        setCampaignStep(1); // Reset campaign flow on tab change
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === item.id || (item.id === 'campaigns' && activeTab === 'calls') // Handle dual name for calls/campaigns
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : darkMode 
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>
          {/* Main Content */}
          <div className="flex-1">
            {/* Dashboard (Updated for Manager/Admin roles) */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className={`rounded-lg shadow-sm p-6 ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <h2 className="text-xl font-bold mb-4">
                      {userRole === 'Administrator' ? 'System & Global Oversight' : 'Campaign Performance Dashboard'}
                  </h2>
                  
                  {/* KPI Cards */}
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${userRole === 'Administrator' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
                    {/* Dynamic Metrics based on Role */}
                    {currentMetrics.map((stat, index) => (
                      <div 
                          key={index} 
                          className={`rounded-xl p-4 transition-shadow duration-300 ${
                            darkMode ? 'bg-gray-700 shadow-lg' : 'bg-white shadow-lg'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-sm font-medium ${
                              darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>{stat.title}</p>
                            <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
                          </div>
                          <div className="p-3 bg-blue-100 rounded-full">
                            <stat.icon className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <p className={`text-xs mt-2 font-medium ${
                            stat.change.includes('↑') ? 'text-green-600' : 
                            stat.change.includes('Stable') ? 'text-gray-500' : 'text-red-600'
                        }`}>
                            {stat.change}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                    {/* Admin Specific: AI Usage Breakdown */}
                    {userRole === 'Administrator' && (
                      <div className={`lg:col-span-1 rounded-lg p-6 shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                          <Cpu className="h-5 w-5 text-purple-500" />
                          <span>AI Resource Usage Breakdown (24h)</span>
                        </h3>
                        <PieChart data={AI_USAGE_DATA} darkMode={darkMode} />
                      </div>
                    )}
                    
                    {/* Goal Tracker (Visible to all roles, takes remaining space) */}
                    <div className={`lg:col-span-${userRole === 'Administrator' ? '2' : '3'} space-y-4`}>
                      <h3 className="text-lg font-semibold flex items-center space-x-2 mb-2">
                          <Target className="h-5 w-5 text-blue-500" />
                          <span>Organizational Goals & KPIs</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {GOALS_DATA.map((goal, index) => (
                              <GoalTracker 
                                  key={index} 
                                  goal={goal.goal} 
                                  target={goal.target} 
                                  current={goal.current} 
                                  icon={goal.icon} 
                                  color={goal.color}
                                  darkMode={darkMode}
                              />
                          ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Manager/Agent Specific: Latest Campaign Status */}
                  {(userRole !== 'Administrator') && (
                    <div className="mt-8">
                      <LatestCampaignSummary 
                        campaign={latestCampaign} 
                        darkMode={darkMode}
                      />
                    </div>
                  )}

                  {/* Agent Role: Quick Access / History */}
                  {userRole === 'Agent' && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                          {/* Recent Calls */}
                          <div className={`rounded-lg shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                              <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold">Recent Live Calls</h3>
                              <button onClick={() => setActiveTab('calls')} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                  View All
                              </button>
                              </div>
                              <div className="space-y-3">
                              {calls.slice(0, 3).map((call) => (
                                  <div key={call.id} className={`flex items-center justify-between p-3 rounded-lg ${
                                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                                  }`}>
                                  <div>
                                      <p className="font-medium">{call.contactName}</p>
                                      <p className={`text-sm ${
                                      darkMode ? 'text-gray-400' : 'text-gray-500'
                                      }`}>{call.duration} • {new Date(call.timestamp).toLocaleDateString()}</p>
                                  </div>
                                  <span className={`text-sm font-medium ${
                                      call.status === 'completed' ? 'text-green-600' :
                                      call.status === 'in-progress' ? 'text-blue-600' :
                                      'text-red-600'
                                  }`}>
                                      {call.status}
                                  </span>
                                  </div>
                              ))}
                              </div>
                          </div>
                          {/* High Priority Contacts */}
                          <div className={`rounded-lg shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                              <h3 className="text-lg font-semibold mb-4">High Priority Contacts</h3>
                              <div className="space-y-3">
                              {contacts
                                  .filter(contact => contact.score > 80)
                                  .slice(0, 3)
                                  .map((contact) => (
                                  <div key={contact.id} className={`flex items-center justify-between p-3 rounded-lg ${
                                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                                  }`}>
                                      <div>
                                      <p className="font-medium">{contact.name}</p>
                                      <p className={`text-sm ${
                                          darkMode ? 'text-gray-400' : 'text-gray-500'
                                      }`}>{contact.company}</p>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                      <span className={`px-2 py-1 text-xs rounded-full ${
                                          contact.status === 'customer' ? 'bg-green-100 text-green-800' :
                                          contact.status === 'prospect' ? 'bg-blue-100 text-blue-800' :
                                          'bg-yellow-100 text-yellow-800'
                                      }`}>
                                          {contact.status}
                                      </span>
                                      <span className="text-sm font-medium text-yellow-600">Score: {contact.score}</span>
                                      </div>
                                  </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Contacts (Content remains the same) */}
            {activeTab === 'contacts' && (
                <div className={`rounded-lg shadow-sm p-6 ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold">Contacts</h2>
                        <button
                        onClick={() => setShowNewContactModal(true)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-colors"
                        >
                        <Plus className="h-4 w-4" />
                        <span>Add Contact</span>
                        </button>
                    </div>
                    {/* ... Contact Table Content (Omitted for brevity) ... */}
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search contacts..."
                                className={`w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    darkMode 
                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                    : 'border border-gray-300'
                                }`}
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Contact</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Company</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Last Interaction</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Sentiment</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Assigned Agent</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${
                                darkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'
                            }`}>
                                {contacts.map((contact) => (
                                    <tr key={contact.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                                    <td className="px-4 py-3">
                                        <div>
                                        <p className="font-medium">{contact.name}</p>
                                        <p className={`text-sm ${
                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>{contact.email}</p>
                                        <p className={`text-sm ${
                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>{contact.phone}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm">{contact.company}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm">{contact.lastInteraction}</p>
                                    </td>
                                    {/* FIX 2: Sentiment Display Only */}
                                    <td className="px-4 py-3">
                                        <span 
                                            className={`px-2 py-1 text-xs rounded-full font-medium ${getSentimentColor(contact.sentiment)}`}
                                        >
                                            {contact.sentiment.charAt(0).toUpperCase() + contact.sentiment.slice(1)}
                                        </span>
                                    </td>
                                    {/* FIX 2: Status Display Only */}
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(contact.status)}`}
                                        >
                                            {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                        value={contact.assignedAgent}
                                        onChange={(e) => updateContactAssignedAgent(contact.id, e.target.value)}
                                        className={`px-2 py-1 text-xs rounded-full ${
                                            darkMode ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-800'
                                        }`}
                                        >
                                        <option>Mike Chen</option>
                                        <option>Lisa Park</option>
                                        <option>Anna Kim</option>
                                        <option>AI Agent Luna</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center space-x-2">
                                        {/* FIX 1: Call Button now uses the correct contact data */}
                                        <button
                                            onClick={() => startCall(contact, scripts[0].id)} 
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title={`Start AI Call to ${contact.name}`}
                                        >
                                            <Phone className="h-4 w-4" />
                                        </button>
                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Edit3 className="h-4 w-4" />
                                        </button>
                                        {/* FIX 1: Delete Button now works */}
                                        <button 
                                            onClick={() => deleteContact(contact.id)} 
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title={`Delete ${contact.name}`}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                        </div>
                                    </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Campaign Management / Live Calls (Consolidated Tab) */}
            {(activeTab === 'campaigns' || activeTab === 'calls') && (
              <div className="space-y-6">
                {/* AI Call Controls - Title changed based on role */}
                <div className={`bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-xl font-bold">
                        {isManagerOrAdmin ? 'Campaign Launch Pad & Reporting' : 'Live AI Call Assistant'}
                      </h2>
                      <p className="text-blue-100 mt-1">
                        {isManagerOrAdmin ? 'Design, deploy, monitor, and report on new AI campaigns' : 'Make instant, script-guided calls to contacts'}
                      </p>
                    </div>
                    <Brain className="h-12 w-12 text-white opacity-90" />
                  </div>
                  {/* Stats Block (Simplified for Campaign/Live Call view) */}
                  {isManagerOrAdmin && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-500/20 p-4 rounded-lg">
                            <div className="text-2xl font-bold">{totalCampaigns}</div>
                            <div className="text-sm text-blue-100">Total Campaigns</div>
                        </div>
                        <div className="bg-blue-500/20 p-4 rounded-lg">
                            <div className="text-2xl font-bold">{avgSuccessRate}%</div>
                            <div className="text-sm text-blue-100">Avg. Success Rate</div>
                        </div>
                        <div className="bg-blue-500/20 p-4 rounded-lg">
                            <div className="text-2xl font-bold">{avgConversionRatio}%</div>
                            <div className="text-sm text-blue-100">Avg. Conversion Ratio</div>
                        </div>
                    </div>
                  )}
                </div>
                
                {/* CAMPAIGN MANAGEMENT / LIVE CALL ASSISTANT */}
        {isManagerOrAdmin ? (
          <CampaignManagementFlow 
            userRole={userRole}
            campaigns={campaigns}
            darkMode={darkMode}
          />
        ) : (
                    <AgentLiveCallAssistant 
                        selectedContact={selectedContact} 
                        setSelectedContact={setSelectedContact}
                        selectedScriptId={selectedScriptId}
                        setSelectedScriptId={setSelectedScriptId}
                        contacts={contacts}
                        scripts={scripts}
                        startCall={startCall}
                        isCalling={isCalling}
                        callDuration={callDuration}
                        callTranscript={callTranscript}
                        endCall={endCall}
                        darkMode={darkMode}
                    />
                )}
                
                {/* Call History (Simplified View) - Visible for Agent and relevant to Campaign reporting */}
                <div className={`rounded-lg shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{userRole === 'Agent' ? 'Recent Live Call History' : 'Recent AI Interaction History'}</h3>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Full Log
                    </button>
                  </div>
                  <div className="space-y-4">
                    {calls.length > 0 ? (
                      calls.slice(0, 3).map((call) => (
                        <div 
                          key={call.id} 
                          className={`border rounded-lg p-4 ${
                            darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{call.contactName}</p>
                              <p className={`text-sm ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>{call.outcome}</p>
                            </div>
                            <p className={`font-medium text-sm ${getCallStatusColor(call.status)}`}>
                              {call.status}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">No recent AI Interactions.</div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Conversations */}
            {activeTab === 'conversations' && (
                <div className={`rounded-lg shadow-sm p-6 ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <h2 className="text-xl font-semibold mb-6">Conversations</h2>
                    {/* ... Conversation Content ... */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Inbox Sidebar */}
                      <div className={`lg:col-span-1 rounded-lg p-4 ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Inbox</h3>
                          <span className={`text-sm ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {filteredConversations.filter(c => c.unreadCount > 0).length} unread
                          </span>
                        </div>
                        <div className="mb-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search conversations..."
                              className={`w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                darkMode 
                                  ? 'bg-gray-600 border-gray-600 text-white' 
                                  : 'border border-gray-300'
                              }`}
                            />
                          </div>
                        </div>
                        {/* Channel Filter */}
                        <div className={`flex space-x-2 mb-4 overflow-x-auto p-1 rounded-lg ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                          <button
                            onClick={() => setActiveChannel('all')}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                              activeChannel === 'all' 
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : darkMode 
                                  ? 'text-gray-300 hover:bg-gray-600' 
                                  : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            All
                          </button>
                          <button
                            onClick={() => setActiveChannel('calls')}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                              activeChannel === 'calls' 
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : darkMode 
                                  ? 'text-gray-300 hover:bg-gray-600' 
                                  : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <Phone className="h-3 w-3 inline mr-1" /> Calls
                          </button>
                          <button
                            onClick={() => setActiveChannel('sms')}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                              activeChannel === 'sms' 
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : darkMode 
                                  ? 'text-gray-300 hover:bg-gray-600' 
                                  : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <Smartphone className="h-3 w-3 inline mr-1" /> SMS
                          </button>
                          <button
                            onClick={() => setActiveChannel('whatsapp')}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                              activeChannel === 'whatsapp' 
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : darkMode 
                                  ? 'text-gray-300 hover:bg-gray-600' 
                                  : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <MessageSquareIcon className="h-3 w-3 inline mr-1" /> WhatsApp
                          </button>
                          <button
                            onClick={() => setActiveChannel('email')}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                              activeChannel === 'email' 
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : darkMode 
                                  ? 'text-gray-300 hover:bg-gray-600' 
                                  : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <Mail className="h-3 w-3 inline mr-1" /> Email
                          </button>
                        </div>
                        {/* Conversation List */}
                        <div className="space-y-2">
                            {filteredConversations.length > 0 ? (
                                filteredConversations.map((conv) => (
                                    <div
                                        key={conv.id}
                                        onClick={() => {
                                            setSelectedConversation(conv);
                                            markAsRead(conv.id);
                                        }}
                                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                            selectedConversation?.id === conv.id
                                                ? 'bg-blue-50 border-l-4 border-blue-500'
                                                : darkMode 
                                                    ? 'hover:bg-gray-600' 
                                                    : 'hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <img src={conv.avatar} alt={conv.name} className="w-10 h-10 rounded-full" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium truncate">{conv.name}</h4>
                                                    {conv.unreadCount > 0 && (
                                                        <span className="bg-black text-white text-xs rounded-full px-2 py-1">
                                                            {conv.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={`text-sm truncate mt-1 ${
                                                    darkMode ? 'text-gray-300' : 'text-gray-600'
                                                }`}>{conv.lastMessage}</p>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className={`text-xs ${
                                                        darkMode ? 'text-gray-400' : 'text-gray-500'
                                                    }`}>{conv.timestamp}</span>
                                                    {conv.status === 'hot' && (
                                                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Hot</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={`text-center py-6 ${
                                    darkMode ? 'text-gray-400' : 'text-gray-500'
                                }}`}>
                                    No conversations found
                                </div>
                            )}
                        </div>
                      </div>
                      {/* Conversation Detail */}
                      {selectedConversation ? (
                        <div className={`lg:col-span-2 rounded-lg p-4 ${
                          darkMode ? 'bg-gray-700' : 'bg-white'
                        }`}>
                          <div className="flex items-center justify-between mb-4 pb-4 border-b">
                            <div className="flex items-center space-x-3">
                              <img src={selectedConversation.avatar} alt={selectedConversation.name} className="w-10 h-10 rounded-full" />
                              <div>
                                <h3 className="font-semibold">{selectedConversation.name}</h3>
                                <div className="flex items-center space-x-2">
                                  <p className={`text-sm ${
                                    darkMode ? 'text-gray-400' : 'text-gray-600'
                                  }`}>{selectedConversation.company}</p>
                                  {selectedConversation.status === 'hot' && (
                                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Hot</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-medium ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>AI Auto-Reply</span>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  toggleAiAutoReply(selectedConversation.id);
                                }}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  selectedConversation.aiAutoReply 
                                    ? 'bg-blue-600' 
                                    : darkMode ? 'bg-gray-600' : 'bg-gray-200'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    selectedConversation.aiAutoReply ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                          {/* Messages */}
                          <div className="h-96 overflow-y-auto mb-4">
                            {selectedConversation.messages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`mb-4 max-w-[80%] ${
                                  msg.sender === 'You'
                                    ? 'ml-auto bg-blue-50 text-gray-900 rounded-lg rounded-tr-none p-3'
                                    : darkMode
                                      ? 'mr-auto bg-gray-600 text-white rounded-lg rounded-tl-none p-3'
                                      : 'mr-auto bg-gray-100 text-gray-900 rounded-lg rounded-tl-none p-3'
                                }`}
                              >
                                {msg.sender !== 'You' && (
                                  <div className="font-medium text-sm mb-1">{msg.sender}</div>
                                )}
                                <div className="text-sm">{msg.text}</div>
                                <div className="text-xs mt-1 flex items-center justify-end">
                                  {msg.timestamp}
                                  {msg.sender === 'You' && (
                                    <CheckCircle className="h-4 w-4 ml-1 text-blue-500" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          {/* AI Suggested Reply */}
                          {aiSuggestion && (
                            <div className={`border rounded-lg p-4 mb-4 ${
                              darkMode 
                                ? 'bg-purple-900 border-purple-700 text-purple-100' 
                                : 'bg-purple-50 border-purple-200 text-purple-800'
                            }`}>
                              <div className="flex items-center space-x-2 mb-2">
                                <Sparkles className="h-5 w-5" />
                                <span className="text-sm font-medium">AI Suggested Reply:</span>
                              </div>
                              <p className="text-sm mb-3">{aiSuggestion}</p>
                              <button
                                onClick={useAiSuggestion}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  darkMode 
                                    ? 'bg-purple-800 text-purple-100 hover:bg-purple-700' 
                                    : 'bg-white text-purple-700 hover:bg-purple-100'
                                }`}
                              >
                                Use this reply
                              </button>
                            </div>
                          )}
                          {/* Message Input */}
                          <div className="flex items-center space-x-2">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                placeholder="Type your message..."
                                className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                  darkMode 
                                    ? 'bg-gray-600 border-gray-600 text-white' 
                                    : 'border border-gray-300'
                              }`}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                              />
                            </div>
                            <button
                              onClick={sendMessage}
                              disabled={!messageInput.trim()}
                              className={`p-2 rounded-lg ${
                                messageInput.trim()
                                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                                  : darkMode 
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              <Send className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className={`lg:col-span-2 rounded-lg p-4 flex items-center justify-center ${
                          darkMode ? 'bg-gray-700' : 'bg-white'
                        }`}>
                          <div className="text-center">
                            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className={`text-gray-500`}>Select a conversation to view messages</p>
                          </div>
                        </div>
                      )}
                    </div>
                </div>
            )}
            
            {/* Scripts (Content remains the same) */}
            {activeTab === 'scripts' && (
              <div className={`rounded-lg shadow-sm p-6 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold">Call Scripts</h2>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Manage AI call scripts with dynamic variables</p>
                  </div>
                  <button
                    onClick={() => setShowNewScriptModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Script</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {scripts.map((script) => (
                    <div key={script.id} className={`rounded-lg p-4 ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{script.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              script.tone === 'friendly' ? 'bg-green-100 text-green-800' :
                              script.tone === 'neutral' ? 'bg-gray-100 text-gray-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {script.tone}
                            </span>
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              {script.language}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setNewScript({ ...script });
                              setShowNewScriptModal(true);
                            }}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteScript(script.id)}
                            className="p-1 text-gray-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className={`rounded-lg p-3 mb-3 ${
                        darkMode ? 'bg-gray-600' : 'bg-gray-100'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{script.content}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Voice: {script.voice}</span>
                        <span>Variables: {script.variables.join(', ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Analytics (Content RESTORED and complete) */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className={`rounded-lg shadow-sm p-6 ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <h2 className="text-xl font-semibold mb-4">Deep Campaign Analytics</h2>
                  <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Conversion and Revenue breakdown for strategic planning.
                  </p>
                  
                  {/* Revenue Impact Analysis (Grouped Bar Chart) */}
                  <div className={`rounded-lg shadow-sm p-6 mb-6 ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <div className="flex items-center space-x-2 mb-4">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <h3 className="text-lg font-semibold">Revenue Impact Analysis</h3>
                    </div>
                    <div className={`p-4 rounded-lg ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        <GroupedBarChart
                            data={revenueImpactData}
                            labelKey="day"
                            barKey1="conversions"
                            barKey2="revenue"
                            color1="rgb(99, 102, 241)" // Indigo (Conversions)
                            color2="rgb(34, 197, 94)"  // Green (Revenue)
                            darkMode={darkMode}
                        />
                        <div className="flex justify-center mt-4 space-x-6">
                            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                            <span>Conversions (Count)</span>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span>Revenue (₹K)</span>
                        </div>
                    </div>
                  </div>
                  
                  {/* Conversion Funnel (FunnelChart component) */}
                  <div className={`rounded-lg shadow-sm p-6 mb-6 ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <h3 className="text-lg font-semibold mb-2">Conversion Funnel</h3>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Lead progression and retention through sales stages
                    </p>
                    <div className={`p-4 rounded-lg flex flex-col items-center ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        <FunnelChart data={conversionFunnelData} darkMode={darkMode} />
                        <div className="text-sm text-center mt-4">
                            <span className="font-medium text-blue-500">245</span> converted out of <span className="font-medium text-indigo-500">1500</span> leads.
                        </div>
                    </div>
                  </div>
                  
                  {/* Agent Performance - DYNAMIC MONTHLY VIEW - UPDATED COLORS */}
                  <div className={`rounded-lg shadow-sm p-6 ${
                      darkMode ? 'bg-gray-800' : 'bg-white'
                  }`}>
                      <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">Agent Performance Scorecard</h3>
                          <select
                              value={performanceMonth}
                              onChange={(e) => setPerformanceMonth(e.target.value)}
                              className={`px-3 py-1 rounded-lg text-sm ${
                                  darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border border-gray-300'
                              }`}
                          >
                              {availableMonths.map(month => (
                                  <option key={month} value={month}>{month}</option>
                              ))}
                          </select>
                      </div>
                      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Performance metrics for **{performanceMonth}**.
                      </p>
                      <div className={`p-4 rounded-lg ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                          <div className="space-y-4">
                              {agentPerformanceData[performanceMonth]?.map((agent, index) => (
                                  <div key={index} className="flex items-center space-x-4">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold`}
                                          style={{ backgroundColor: agentColorMap[agent.name] || 'gray' }}>
                                          {index + 1}
                                      </div>
                                      <div className="flex-1">
                                          <div className="flex items-center justify-between">
                                              <div>
                                                  <div className="font-medium">{agent.name} <span className={`text-xs ml-1 px-2 py-0.5 rounded-full ${agent.team === 'AI Dept' ? 'bg-pink-100 text-pink-800' : 'bg-gray-200 text-gray-700'}`}>{agent.team}</span></div>
                                                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{agent.calls} calls completed</div>
                                              </div>
                                              <div className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-bold">
                                                  {agent.conversion}% Conversion
                                              </div>
                                          </div>
                                          <div className={`mt-1 h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
                                              <div 
                                                  className="h-2 rounded-full"
                                                  style={{ 
                                                      width: `${agent.completion}%`,
                                                      backgroundColor: agentColorMap[agent.name] || 'gray'
                                                  }}
                                              ></div>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
                </div>
              </div>
            )}
            {/* Settings (Updated with API Usage Tab) */}
            {activeTab === 'settings' && (
              <div className={`rounded-lg shadow-sm p-6 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h2 className="text-xl font-semibold mb-6">Account & System Settings</h2>
                <div className={`border-b mb-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <nav className="flex space-x-8 overflow-x-auto pb-2">
                      <button
                        onClick={() => setUserProfileTab('profile')}
                        className={`pb-3 font-medium text-sm transition-colors ${
                          userProfileTab === 'profile'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <User className="inline h-4 w-4 mr-1" /> Profile
                      </button>
                      <button
                        onClick={() => setUserProfileTab('general')}
                        className={`pb-3 font-medium text-sm transition-colors ${
                          userProfileTab === 'general'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Settings className="inline h-4 w-4 mr-1" /> General
                      </button>
                      <button
                        onClick={() => setUserProfileTab('security')}
                        className={`pb-3 font-medium text-sm transition-colors ${
                          userProfileTab === 'security'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <ShieldCheck className="inline h-4 w-4 mr-1" /> Security
                      </button>
                      <button
                        onClick={() => setUserProfileTab('password')}
                        className={`pb-3 font-medium text-sm transition-colors ${
                          userProfileTab === 'password'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Lock className="inline h-4 w-4 mr-1" /> Password
                      </button>
                      {/* Permissions/User Management Tab (All Admin/Manager) */}
                      {(userRole === 'Administrator' || userRole === 'Manager') && (
                        <button
                          onClick={() => setUserProfileTab('management')}
                          className={`pb-3 font-medium text-sm transition-colors ${
                            userProfileTab === 'management'
                              ? 'border-b-2 border-green-500 text-green-600'
                              : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <Users2 className="inline h-4 w-4 mr-1" /> User Management
                        </button>
                      )}
                      {/* API Usage Tab (Admin only) */}
                      {userRole === 'Administrator' && (
                        <button
                          onClick={() => setUserProfileTab('apiUsage')}
                          className={`pb-3 font-medium text-sm transition-colors ${
                            userProfileTab === 'apiUsage'
                              ? 'border-b-2 border-purple-500 text-purple-600'
                              : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <Database className="inline h-4 w-4 mr-1" /> API Usage
                        </button>
                      )}
                    </nav>
                </div>

                {/* Settings Content Switch */}
                <div className="space-y-6">
                    {userProfileTab === 'profile' && <SettingsProfileTab {...{ userProfile, updateUserProfile, darkMode, userRole }} />}
                    {userProfileTab === 'general' && <SettingsGeneralTab {...{ userProfile, updateUserProfile, toggleDarkMode, darkMode }} />}
                    {userProfileTab === 'security' && <SettingsSecurityTab {...{ userProfile, updateUserProfile, darkMode }} />}
                    {userProfileTab === 'password' && <SettingsPasswordTab {...{ darkMode }} />}
                    {userProfileTab === 'management' && <SettingsUserManagementTab {...{ darkMode, userRole, users, handleEditClick, handleDeleteUser }} />}
                    {userProfileTab === 'apiUsage' && userRole === 'Administrator' && <SettingsApiUsageTab {...{ darkMode }} />}

                    {/* AI Calling Settings (Admin Only) */}
                    {userRole === 'Administrator' && (
                        <div className={`border rounded-lg p-4 ${
                          darkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                          <h3 className="font-medium mb-2">AI Calling System Configuration (Admin Only)</h3>
                          <p className={`text-sm mb-4 ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>Configure your AI assistant's core voice and scheduling behavior</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <label className={`block text-sm font-medium mb-1 ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>Voice Type</label>
                              <select className={`w-full rounded-lg px-3 py-2 ${
                                darkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white' 
                                  : 'border border-gray-300'
                              }`}>
                                <option>Professional Female</option>
                                <option>Professional Male</option>
                                <option>Friendly Female</option>
                                <option>Friendly Male</option>
                              </select>
                            </div>
                            <div>
                              <label className={`block text-sm font-medium mb-1 ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>Speaking Speed</label>
                              <select className={`w-full rounded-lg px-3 py-2 ${
                                darkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white' 
                                  : 'border border-gray-300'
                              }`}>
                                <option>Normal</option>
                                <option>Slow</option>
                                <option>Fast</option>
                              </select>
                            </div>
                            <div>
                              <label className={`block text-sm font-medium mb-1 ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>Max Calls/Day</label>
                              <input type="number" className={`w-full rounded-lg px-3 py-2 ${
                                darkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white' 
                                  : 'border border-gray-300'
                              }`} defaultValue="50" />
                            </div>
                          </div>
                          <button className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors">
                            Save System Config
                          </button>
                        </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Modals (omitted for brevity, content remains same) */}
      {isCalling && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg shadow-xl w-full max-w-2xl mx-4 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">AI Call in Progress</h3>
                    <p className={`text-gray-600`}>{selectedContact.name} • {selectedContact.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{formatTime(callDuration)}</div>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Duration</p>
                </div>
              </div>
              <div className={`rounded-lg p-4 h-64 overflow-y-auto mb-4 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <pre className={`text-sm whitespace-pre-wrap ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>{callTranscript || 'Connecting to AI assistant...'}</pre>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={endCall}
                  className="bg-red-600 text-white px-6 py-3 rounded-full flex items-center space-x-2 hover:bg-red-700 transition-colors"
                >
                  <Phone className="h-5 w-5 rotate-135" />
                  <span>End Call</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showNewContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* FIX 1: New Contact Modal Content */}
          <div className={`rounded-xl shadow-2xl w-full max-w-md p-6 ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
              <h3 className="text-xl font-bold mb-4">Add New Contact</h3>
              
              <div className="space-y-4">
                  <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                      <input
                          type="text"
                          value={newContact.name}
                          onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                          required
                          className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'}`}
                      />
                  </div>
                  <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                      <input
                          type="email"
                          value={newContact.email}
                          onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                          className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'}`}
                      />
                  </div>
                  <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone</label>
                      <input
                          type="text"
                          value={newContact.phone}
                          onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                          required
                          className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'}`}
                      />
                  </div>
                  <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Company</label>
                      <input
                          type="text"
                          value={newContact.company}
                          onChange={(e) => setNewContact({...newContact, company: e.target.value})}
                          className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'}`}
                      />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                          <select
                              value={newContact.status}
                              onChange={(e) => setNewContact({...newContact, status: e.target.value})}
                              className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'}`}
                          >
                              <option value="lead">Lead</option>
                              <option value="prospect">Prospect</option>
                              <option value="customer">Customer</option>
                          </select>
                      </div>
                      <div>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sentiment</label>
                          <select
                              value={newContact.sentiment}
                              onChange={(e) => setNewContact({...newContact, sentiment: e.target.value})}
                              className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'}`}
                          >
                              <option value="neutral">Neutral</option>
                              <option value="positive">Positive</option>
                              <option value="negative">Negative</option>
                          </select>
                      </div>
                  </div>
                  <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Assigned Agent</label>
                      <select
                          value={newContact.assignedAgent}
                          onChange={(e) => setNewContact({...newContact, assignedAgent: e.target.value})}
                          className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'}`}
                      >
                          {ALL_AGENTS.map(agent => (
                              <option key={agent} value={agent}>{agent}</option>
                          ))}
                      </select>
                  </div>
              </div>

              <div className="flex space-x-3 mt-6">
                  <button
                      type="button"
                      onClick={() => setShowNewContactModal(false)}
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                          darkMode 
                              ? 'border border-gray-600 text-gray-200 hover:bg-gray-700' 
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                      Cancel
                  </button>
                  <button
                      type="button"
                      onClick={addContact}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700"
                  >
                      Save Contact
                  </button>
              </div>
          </div>
        </div>
      )}
      {showNewScriptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* ... New Script Modal Content ... */}
          <div className={`rounded-xl shadow-2xl w-full max-w-lg p-6 ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <h3 className="text-xl font-bold mb-4">Create New Call Script</h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Script Title</label>
                <input
                  type="text"
                  value={newScript.title}
                  onChange={(e) => setNewScript({...newScript, title: e.target.value})}
                  required
                  className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tone</label>
                  <select
                    value={newScript.tone}
                    onChange={(e) => setNewScript({...newScript, tone: e.target.value})}
                    className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'}`}
                  >
                    <option value="friendly">Friendly</option>
                    <option value="neutral">Neutral</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Language</label>
                  <input
                    type="text"
                    value={newScript.language}
                    onChange={(e) => setNewScript({...newScript, language: e.target.value})}
                    className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'}`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Script Content (Use {'{variable}'} for dynamic fields)</label>
                <textarea
                  value={newScript.content}
                  onChange={(e) => setNewScript({...newScript, content: e.target.value})}
                  rows="5"
                  required
                  className={`w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'}`}
                  placeholder="e.g., Hello {name}, I'm calling about our {product}..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowNewScriptModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    darkMode 
                        ? 'border border-gray-600 text-gray-200 hover:bg-gray-700' 
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addScript}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700"
              >
                Save Script
              </button>
            </div>
          </div>
        </div>
      )}
      {/* NEW: User Management Modal */}
      {showUserModal && editingUser && (
        <UserModal 
            user={editingUser} 
            onClose={() => setShowUserModal(false)} 
            onSave={handleSaveUser} 
            allUsers={users} 
            darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default App;
