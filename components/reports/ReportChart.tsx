"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import { ChartDataResponse, ChartSeriesPoint } from "@/lib/api/types/reports";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { Maximize } from "lucide-react";

interface ReportChartProps {
  data: ChartDataResponse;
  isHidden: boolean;
}

export default function ReportChart({ data, isHidden }: ReportChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [dimensions, setDimensions] = useState({ width: 0, height: 350 });
  const [zoomTransform, setZoomTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  const [hoverData, setHoverData] = useState<{ date: string; x: number; values: { groupKey: string, color: string, value: number }[], total: number } | null>(null);

  // ResizeObserver for responsive width
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      if (width > 0) setDimensions(prev => ({ ...prev, width }));
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Compute Scales and Data Grouping
  const chartProps = useMemo(() => {
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const innerWidth = dimensions.width - margin.left - margin.right;
    const innerHeight = dimensions.height - margin.top - margin.bottom;

    if (innerWidth <= 0 || !data.points.length) return null;

    // Group points by date
    const dates = Array.from(new Set(data.points.map(p => p.date))).sort();
    
    // Create mapping of date -> { groupKey: value }
    const dateMap = new Map<string, Record<string, number>>();
    data.points.forEach(p => {
      if (!dateMap.has(p.date)) dateMap.set(p.date, {});
      dateMap.get(p.date)![p.groupKey] = p.value;
    });

    const parsedDates = dates.map(d => parseISO(d));
    const minDate = d3.min(parsedDates) as Date;
    const maxDate = d3.max(parsedDates) as Date;

    const xScale = d3.scaleTime()
      .domain([minDate, maxDate])
      .range([0, innerWidth]);

    // Apply zoom transform to xScale
    const zoomedXScale = zoomTransform.rescaleX(xScale);

    const maxY = d3.max(data.points, d => d.value) || 0;
    // We add a bit of padding to top of Y scale
    const yScale = d3.scaleLinear()
      .domain([0, maxY * 1.1])
      .range([innerHeight, 0]);

    // Compute Total line
    const totalData = dates.map(date => {
      const row = dateMap.get(date)!;
      const sum = Object.values(row).reduce((acc, v) => acc + v, 0);
      return { date, value: sum, parsed: parseISO(date) };
    });

    return {
      margin, innerWidth, innerHeight, dates, dateMap, xScale, zoomedXScale, yScale, totalData
    };
  }, [data, dimensions, zoomTransform]);

  // Bind D3 Zoom behavior
  useEffect(() => {
    if (!svgRef.current || !chartProps) return;
    
    const svg = d3.select(svgRef.current);
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 10])
      .translateExtent([[0, 0], [chartProps.innerWidth, chartProps.innerHeight]])
      .extent([[0, 0], [chartProps.innerWidth, chartProps.innerHeight]])
      .on("zoom", (e) => {
        setZoomTransform(e.transform);
        setHoverData(null); // hide hover on zoom
      });

    svg.call(zoom);
    return () => { svg.on(".zoom", null); };
  }, [chartProps?.innerWidth, chartProps?.innerHeight]); // only re-bind if dimensions change

  const handleResetZoom = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().duration(750).call(
      d3.zoom<SVGSVGElement, unknown>().transform, 
      d3.zoomIdentity
    );
  };

  if (isHidden) {
    return <div className="h-0 overflow-hidden transition-all duration-500" />;
  }

  return (
    <div ref={containerRef} className="w-full relative h-[350px] bg-white dark:bg-[#151515] border-b border-gray-100 dark:border-[#222]">
      
      {data.points.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-medium">
          Grafik için yeterli veri bulunamadı.
        </div>
      ) : (
        <>
          <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="block cursor-crosshair">
            {chartProps && (
              <g transform={`translate(${chartProps.margin.left},${chartProps.margin.top})`}>
                
                {/* Grid Lines */}
                <g className="text-gray-100 dark:text-[#222]">
                  {chartProps.yScale.ticks(5).map(tick => (
                    <line key={tick} x1={0} x2={chartProps.innerWidth} y1={chartProps.yScale(tick)} y2={chartProps.yScale(tick)} stroke="currentColor" strokeDasharray="4,4" />
                  ))}
                </g>

                {/* X Axis */}
                <g transform={`translate(0,${chartProps.innerHeight})`} className="text-gray-400 font-medium text-xs">
                  {chartProps.zoomedXScale.ticks(5).map(tick => (
                    <g key={tick.toISOString()} transform={`translate(${chartProps.zoomedXScale(tick)},0)`}>
                      <line y2={6} stroke="currentColor" />
                      <text y={20} textAnchor="middle" fill="currentColor">{format(tick, "MMM d", { locale: tr })}</text>
                    </g>
                  ))}
                </g>

                {/* Y Axis */}
                <g className="text-gray-400 font-medium text-xs">
                  {chartProps.yScale.ticks(5).map(tick => (
                    <g key={tick} transform={`translate(0,${chartProps.yScale(tick)})`}>
                      <text x={-10} dy="0.32em" textAnchor="end" fill="currentColor">{tick}</text>
                    </g>
                  ))}
                </g>

                {/* Clip Path for Zooming */}
                <clipPath id="clip-chart">
                  <rect width={chartProps.innerWidth} height={chartProps.innerHeight} />
                </clipPath>

                {/* Series Lines & Areas */}
                <g clipPath="url(#clip-chart)">
                  {data.series.map(series => {
                    const seriesData = chartProps.dates.map(date => {
                      const val = chartProps.dateMap.get(date)?.[series.groupKey] || 0;
                      return { parsed: parseISO(date), value: val };
                    });

                    const areaGenerator = d3.area<{parsed: Date, value: number}>()
                      .x(d => chartProps.zoomedXScale(d.parsed))
                      .y0(chartProps.innerHeight)
                      .y1(d => chartProps.yScale(d.value))
                      .curve(d3.curveMonotoneX);

                    const lineGenerator = d3.line<{parsed: Date, value: number}>()
                      .x(d => chartProps.zoomedXScale(d.parsed))
                      .y(d => chartProps.yScale(d.value))
                      .curve(d3.curveMonotoneX);

                    return (
                      <g key={series.groupKey}>
                        <path d={areaGenerator(seriesData) || undefined} fill={series.color} fillOpacity={0.1} />
                        <path d={lineGenerator(seriesData) || undefined} fill="none" stroke={series.color} strokeWidth={2} />
                      </g>
                    );
                  })}

                  {/* Grand Total Line (computed on frontend) */}
                  {data.series.length > 1 && (
                    <path 
                      d={d3.line<{parsed: Date, value: number}>()
                        .x(d => chartProps.zoomedXScale(d.parsed))
                        .y(d => chartProps.yScale(d.value))
                        .curve(d3.curveMonotoneX)(chartProps.totalData) || undefined} 
                      fill="none" 
                      stroke="#9CA3AA" 
                      strokeWidth={2} 
                      strokeDasharray="4,4" 
                    />
                  )}
                </g>

                {/* Interaction Overlay for Hover Tooltip */}
                <rect 
                  width={chartProps.innerWidth} 
                  height={chartProps.innerHeight} 
                  fill="transparent" 
                  onMouseMove={(e) => {
                    // Find closest date
                    const [xPos] = d3.pointer(e);
                    const dateHovered = chartProps.zoomedXScale.invert(xPos);
                    
                    // find closest in dates array
                    let closestDate = chartProps.dates[0];
                    let minDiff = Infinity;
                    chartProps.dates.forEach(d => {
                      const diff = Math.abs(parseISO(d).getTime() - dateHovered.getTime());
                      if (diff < minDiff) {
                        minDiff = diff;
                        closestDate = d;
                      }
                    });

                    const row = chartProps.dateMap.get(closestDate)!;
                    const values = data.series.map(s => ({
                      groupKey: s.groupKey,
                      color: s.color,
                      value: row[s.groupKey] || 0
                    }));
                    const total = values.reduce((sum, v) => sum + v.value, 0);

                    setHoverData({
                      date: closestDate,
                      x: chartProps.zoomedXScale(parseISO(closestDate)),
                      values,
                      total
                    });
                  }}
                  onMouseLeave={() => setHoverData(null)}
                />

                {/* Hover Crosshair & Tooltip */}
                {hoverData && (
                  <g>
                    {/* Vertical Line */}
                    <line 
                      x1={hoverData.x} x2={hoverData.x} 
                      y1={0} y2={chartProps.innerHeight} 
                      stroke="#B5482E" strokeWidth={1} strokeDasharray="4,4" 
                      className="pointer-events-none"
                    />
                    
                    {/* Dots on line */}
                    {hoverData.values.map(v => (
                      <circle 
                        key={v.groupKey}
                        cx={hoverData.x}
                        cy={chartProps.yScale(v.value)}
                        r={4}
                        fill={v.color}
                        stroke="#fff"
                        strokeWidth={2}
                        className="pointer-events-none"
                      />
                    ))}
                  </g>
                )}
              </g>
            )}
          </svg>

          {/* HTML Tooltip */}
          {hoverData && chartProps && (
            <div 
              className="absolute pointer-events-none bg-white dark:bg-[#1a1a1a] shadow-xl border border-gray-100 dark:border-[#333] rounded-xl p-3 z-10 w-48 transition-transform duration-75"
              style={{
                left: hoverData.x + chartProps.margin.left + 20,
                // keep tooltip in bounds
                ...(hoverData.x > chartProps.innerWidth - 200 ? { left: hoverData.x + chartProps.margin.left - 210 } : {}),
                top: 40
              }}
            >
              <div className="text-xs text-gray-500 mb-2 font-medium">{format(parseISO(hoverData.date), "dd MMMM yyyy", { locale: tr })}</div>
              <div className="space-y-1.5">
                {hoverData.values.map(v => (
                  <div key={v.groupKey} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: v.color }} />
                      <span className="truncate max-w-[90px]">{v.groupKey}</span>
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">{v.value}</span>
                  </div>
                ))}
                
                {hoverData.values.length > 1 && (
                  <div className="pt-1.5 mt-1.5 border-t border-gray-100 dark:border-[#333] flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">Genel Toplam</span>
                    <span className="font-bold text-gray-900 dark:text-white">{hoverData.total}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Zoom Reset Button */}
          {zoomTransform.k !== 1 && (
            <button 
              onClick={handleResetZoom}
              className="absolute top-4 right-4 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] text-gray-600 dark:text-gray-300 p-1.5 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              title="Yakınlaştırmayı Sıfırla"
            >
              <Maximize className="w-4 h-4" />
            </button>
          )}
        </>
      )}
    </div>
  );
}
